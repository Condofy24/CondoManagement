import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { UnitEntity } from './entities/unit.entity';
import { ClientSession, Model } from 'mongoose';
import { CreateUnitDto } from './dto/create-unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';
import { UserService } from '../user/user.service';
import { MongoServerError, ObjectId } from 'mongodb';
import {
  CondoRegistrationKeys,
  RegistrationKeyEntity,
} from './entities/registration-key.entity';
import { v4 as uuidv4 } from 'uuid';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MakeNewPaymentDto } from './dto/make-new-payment.dto';
import { IUnitPayment, PaymentsEntity } from './entities/payments.entity';
import { ParkingService } from '../parking/parking.service';
import { UnitModel } from './models/unit.model';
import { response } from 'express';

@Injectable()
export class UnitService {
  constructor(
    @InjectModel('Unit')
    private readonly unitModel: Model<UnitEntity>,
    private readonly parkingService: ParkingService,
    @InjectModel('Payments')
    private readonly paymentsModel: Model<PaymentsEntity>,
    @InjectModel('RegistrationKey')
    private readonly registrationKeyModel: Model<RegistrationKeyEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => BuildingService))
    private readonly buildingService: BuildingService,
  ) {}

  public async createUnit(buildingId: string, createUnitDto: CreateUnitDto) {
    const { unitNumber, size, isOccupiedByRenter, lateFeesInterestRate, fees } =
      createUnitDto;

    const building = await this.buildingService.findBuildingById(buildingId);

    if (!building) throw new BadRequestException('Invalid building Id');

    const unit = new this.unitModel({
      buildingId: building._id,
      unitNumber,
      size,
      isOccupiedByRenter,
      lateFeesInterestRate,
      fees,
    });

    let unitEntity;

    try {
      unitEntity = await unit.save();
    } catch (error) {
      let errorDescription = 'Building could not be created';

      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'A unit with the same unit number already exists for this building.';
      }

      throw new BadRequestException(error?.message, errorDescription);
    }

    // generate the registration keys for the unit
    const registrationKeys = await this.generateRegistrationKeysForUnit(
      unit._id,
    );

    // update unit count of associted building
    this.buildingService.updateBuilding(buildingId, {
      unitCount: building.unitCount + 1,
    });

    return { unitEntity, registrationKeys };
  }

  public async findUnitRegistrationKey(key: string) {
    return this.registrationKeyModel.findOne({ key });
  }

  private async generateRegistrationKeysForUnit(
    unitId: ObjectId,
  ): Promise<CondoRegistrationKeys> {
    const ownerRegistrationKey = new this.registrationKeyModel({
      unitId,
      key: uuidv4(),
      type: 'owner',
    });

    const renterRegistrationKey = new this.registrationKeyModel({
      unitId,
      key: uuidv4(),
      type: 'renter',
    });
    try {
      const { key: ownerKey } = await ownerRegistrationKey.save();
      const { key: renterKey } = await renterRegistrationKey.save();

      return { ownerKey, renterKey };
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async updateUnit(
    unitId: string,
    updatedFields: Partial<UnitEntity>,
  ): Promise<UnitEntity> {
    try {
      const updatedUnit = await this.unitModel.findByIdAndUpdate(
        new ObjectId(unitId),
        {
          $set: updatedFields,
        },
      );

      if (!updatedUnit) throw new NotFoundException('Unit not found');

      return updatedUnit;
    } catch (error) {
      let errorDescription = 'Unit could not be updated';

      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'A unit with the same unit number already exists for this building.';
      }

      throw new BadRequestException(error?.message, errorDescription);
    }
  }

  public async findAllBuildingUnits(buildingId: string): Promise<UnitModel[]> {
    const units = await this.unitModel.find({ buildingId }).exec();

    return Promise.all(
      units.map(async (unit: UnitEntity) => {
        const ownerKey = await this.registrationKeyModel.findOne({
          unitId: unit._id,
          type: 'owner',
        });

        const renterKey = await this.registrationKeyModel.findOne({
          unitId: unit._id,
          type: 'renter',
        });

        return new UnitModel(unit, ownerKey, renterKey);
      }),
    );
  }

  public async findUnitById(id: string): Promise<UnitEntity | null> {
    return await this.unitModel.findOne({ _id: id }).exec();
  }

  public async remove(id: string): Promise<void> {
    const unit = await this.unitModel.findOneAndRemove({ _id: id }).exec();

    if (!unit) throw new NotFoundException('Unit not found');

    const building = await this.buildingService.findBuildingById(
      unit.buildingId.toString(),
    );

    if (!building) return;

    await this.buildingService.updateBuilding(building._id.toString(), {
      unitCount: building.unitCount - 1,
    });
  }

  public async linkUnitToUser(
    userId: string,
    registrationKey: RegistrationKeyEntity,
    session: ClientSession,
  ) {
    const associationKey =
      registrationKey.type == 'owner' ? 'ownerId' : 'renterId';

    const unit = await this.unitModel.findById(registrationKey.unitId);

    if (!unit) throw new NotFoundException('Unit not found');

    if (unit[associationKey])
      throw new BadRequestException('Unit already associated with a user');

    await this.unitModel
      .findByIdAndUpdate(unit._id, {
        $set: { [associationKey]: userId },
      })
      .session(session)
      .exec();

    await this.registrationKeyModel
      .findByIdAndUpdate(registrationKey._id, {
        $set: { claimedBy: userId },
      })
      .session(session)
      .exec();
  }

  public async findAssociatedUnits(userId: string): Promise<UnitEntity[]> {
    const user = await this.userService.findUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    const filterKey = user.role == 3 ? 'ownerId' : 'renterId';

    return await this.unitModel.find({ [filterKey]: userId }).exec();
  }

  public async makeNewPayment(
    unitId: string,
    makeNewPaymentDto: MakeNewPaymentDto,
  ) {
    const { amount } = makeNewPaymentDto;
    const unit = await this.unitModel.findOne({ _id: unitId });

    if (!unit || !unit?.ownerId) {
      throw new NotFoundException(
        'Unit not found or not associated with an owner',
      );
    }

    let unitPayments = await this.paymentsModel.findOne({ unitId });
    if (!unitPayments) {
      unitPayments = await this.paymentsModel.create({ unitId });
    }

    let newOverdueFees = unit.overdueFees - amount;
    let newMonthlyBalance = unit.monthlyFeesBalance;

    if (newOverdueFees < 0) {
      // Remove from monthly balance and reset overdue to 0
      newMonthlyBalance += newOverdueFees; // overdue fees is negative -> add
      newOverdueFees = 0;
    }

    unitPayments.record.push({
      timeStamp: new Date(),
      amount,
      monthBalance: newMonthlyBalance,
      overdueFees: newOverdueFees,
      previousMonthBalance: unit?.monthlyFeesBalance,
      previousOverdueFees: unit?.overdueFees,
    } as IUnitPayment);

    unit.monthlyFeesBalance = newMonthlyBalance;
    unit.overdueFees = newOverdueFees;

    unitPayments.save();
    unit.save();

    return response.status(HttpStatus.NO_CONTENT);
  }

  public async getUnitPayments(unitId: string): Promise<PaymentsEntity | null> {
    return this.paymentsModel.findOne({ unitId });
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCron() {
    const units = await this.unitModel.find();
    units.forEach(async (unit) => {
      if (unit.ownerId) {
        // Reset monthly fees balance and add balance to overdue
        const sumOfParkingFees = (
          await this.parkingService.findByUnitId(unit.id)
        )?.reduce((acc, current) => {
          return (acc += current.fees);
        }, 0);
        unit.overdueFees +=
          unit.monthlyFeesBalance +
          unit.monthlyFeesBalance * (unit.lateFeesInterestRate / 100);
        unit.monthlyFeesBalance = unit.fees + sumOfParkingFees;
        await unit.save();
      }
    });
  }
}
