import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UnitEntity } from './entities/unit.entity';
import { Model } from 'mongoose';
import { CreateUnitDto } from './dto/create-unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';
import { response } from 'express';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { LinkUnitToBuidlingDto } from './dto/link-unit-to-building.dto';
import { UserService } from '../user/user.service';
import { MongoServerError, ObjectId } from 'mongodb';
import {
  CondoRegistrationKeys,
  RegistrationKeyEntity,
  RegistrationRoles,
} from './entities/registration-key.entity';
import { v4 as uuidv4 } from 'uuid';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MakeNewPaymentDto } from './dto/make-new-payment.dto';
import { PaymentsEntity } from './entities/payments.entity';

@Injectable()
export class UnitService {
  constructor(
    @InjectModel('Unit')
    private readonly unitModel: Model<UnitEntity>,
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
    const { unitNumber, size, isOccupiedByRenter, fees } = createUnitDto;

    const building = await this.buildingService.findOne(buildingId);

    if (!building) throw new BadRequestException('Invalid building Id');

    const unit = new this.unitModel({
      buildingId: building._id,
      unitNumber,
      size,
      isOccupiedByRenter,
      fees,
    });

    let unitEntity;

    try {
      unitEntity = await unit.save();
    } catch (error) {
      let errorDescription = 'Building could not be created';

      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'Unit with the same unit number already exists for this building.';
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
      type: RegistrationRoles.OWNER,
    });

    const renterRegistrationKey = new this.registrationKeyModel({
      unitId,
      key: uuidv4(),
      type: RegistrationRoles.RENTER,
    });
    try {
      const { key: ownerKey } = await ownerRegistrationKey.save();
      const { key: renterKey } = await renterRegistrationKey.save();

      return { ownerKey, renterKey };
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  public async updateUnit(unitId: string, updateUnitDto: UpdateUnitDto) {
    const { unitNumber, size, isOccupiedByRenter, fees } = updateUnitDto;
    const unit = await this.unitModel.findById(unitId);
    if (!unit) {
      throw new HttpException(
        { error: "Building doesn't exists", status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.unitModel.findByIdAndUpdate(unitId, {
      unitNumber: unitNumber,
      size: size,
      isOccupiedByRenter: isOccupiedByRenter,
      fees: fees,
    }); // To return the updated document)
    if (result instanceof Error)
      return new HttpException(' ', HttpStatus.INTERNAL_SERVER_ERROR);
    return {
      unitNumber,
      size,
      isOccupiedByRenter,
      fees,
    };
  }

  public async findAll(buildingId: string): Promise<UnitEntity[]> {
    const units = await this.unitModel.find({ buildingId }).exec();
    return units.map(
      (unit: UnitEntity) =>
        ({
          buildingId: unit.buildingId,
          ownerId: unit.ownerId,
          renterId: unit.renterId,
          unitNumber: unit.unitNumber,
          size: unit.size,
          isOccupiedByRenter: unit.isOccupiedByRenter,
          fees: unit.fees,
        }) as UnitEntity,
    );
  }
  public async findOne(id: string) {
    const unit = await this.unitModel.findById({ _id: id }).exec();
    if (!unit) {
      throw new HttpException(
        { error: 'Unit not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      id: unit._id,
      buildingId: unit.buildingId,
      ownerId: unit.ownerId,
      renterId: unit.renterId,
      unitNumber: unit.unitNumber,
      size: unit.size,
      isOccupiedByRenter: unit.isOccupiedByRenter,
      fees: unit.fees,
    };
  }
  public async remove(id: string): Promise<any> {
    const unit = await this.unitModel.findById(id).exec();
    if (!unit) {
      throw new HttpException('Unit not found', HttpStatus.BAD_REQUEST);
    }
    const buildingId = unit.buildingId.toString();
    const building = await this.buildingService.findOne(buildingId);
    if (!building) {
      throw new HttpException(
        {
          error: "Building doesn't exists",
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    let unitCount = building.unitCount;

    await this.unitModel.remove(unit);
    unitCount--;
    this.buildingService.updateBuilding(buildingId, { unitCount });

    return response.status(HttpStatus.NO_CONTENT);
  }
  public async linkUnitToUser(
    buildingId: string,
    userId: string,
    linkUnitToBuildingDto: LinkUnitToBuidlingDto,
  ) {
    const { unitNumber } = linkUnitToBuildingDto;
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpException(
        { error: 'User not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    const unitExists = await this.unitModel.find({ unitNumber: unitNumber });
    let unit;
    for (let i = 0; i < unitExists.length; i++) {
      if (JSON.stringify(unitExists[i]).localeCompare(buildingId)) {
        unit = unitExists[i];
      }
    }
    if (!unit) {
      throw new HttpException(
        { error: 'Unit not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    let result;
    if (user.role == 3) {
      result = await this.unitModel.findOneAndUpdate(
        { unitNumber, buildingId },
        {
          ownerId: userId,
        },
      );
    }
    if (user.role == 4) {
      result = await this.unitModel.findOneAndUpdate(
        { unitNumber, buildingId },
        {
          renterId: userId,
          isOccupiedByRenter: true,
        },
      );
    }
    return {
      id: unit._id,
      buildingId: unit.buildingId,
      ownerId: unit.ownerId,
      renterId: unit.renterId,
      unitNumber: unit.unitNumber,
      size: unit.size,
      isOccupiedByRenter: unit.isOccupiedByRenter,
      fees: unit.fees,
    };
  }
  public async findOwnerUnits(ownerId: string): Promise<UnitEntity[]> {
    const user = await this.userService.findUserById(ownerId);
    if (!user) {
      throw new HttpException(
        { error: 'User not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.role != 3) {
      throw new UnauthorizedException();
    }

    const units = await this.unitModel.find({ ownerId }).exec();
    return units.map(
      (unit: UnitEntity) =>
        ({
          buildingId: unit.buildingId,
          ownerId: unit.ownerId,
          renterId: unit.renterId,
          unitNumber: unit.unitNumber,
          size: unit.size,
          isOccupiedByRenter: unit.isOccupiedByRenter,
          fees: unit.fees,
        }) as UnitEntity,
    );
  }
  public async findRenterUnit(renterId: string) {
    const user = await this.userService.findUserById(renterId);
    if (!user) {
      throw new HttpException(
        { error: 'User not found', status: HttpStatus.NOT_FOUND },
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.role != 4) {
      throw new UnauthorizedException();
    }
    const unit = await this.unitModel.findOne({ renterId }).exec();
    if (!unit) {
      return null;
    }
    return {
      id: unit._id,
      buildingId: unit.buildingId,
      ownerId: unit.ownerId,
      renterId: unit.renterId,
      unitNumber: unit.unitNumber,
      size: unit.size,
      isOccupiedByRenter: unit.isOccupiedByRenter,
      fees: unit.fees,
    };
  }

  public async makeNewPayment(
    unitId: string,
    makeNewPaymentDto: MakeNewPaymentDto,
  ) {
    const { amount } = makeNewPaymentDto;
    const unitPayments = await this.paymentsModel.find({ unitId });
    console.log(unitPayments);
    // if (unit) {
    //   unit.payments = [
    //     ...unit.payments,
    //     {
    //       timeStamp: new Date(),
    //       amount,
    //       previousBalance: unit.balance,
    //       newBalance: unit.balance - amount,
    //     } as IUnitPayment,
    //   ];
    //   unit.balance -= amount;
    //   unit.save();
    // } else {
    //   throw new HttpException('Unit not found', HttpStatus.NOT_FOUND);
    // }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleCron() {
    const units = await this.unitModel.find();
    units.forEach(async (unit) => {
      if (unit.ownerId) {
        // Reset monthly fees balance and add balance to overdue
        unit.overdueFees += unit.monthlyFeesBalance;
        unit.monthlyFeesBalance = unit.fees;
        await unit.save();
      }
    });
  }
}
