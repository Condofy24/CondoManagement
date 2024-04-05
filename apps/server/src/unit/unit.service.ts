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
import { UserRoles } from '../user/user.model';
import { BuildingEntity } from '../building/entities/building.entity';
import { StorageService } from '../storage/storage.service';
import { ParkingEntity } from '../parking/entities/parking.entity';
import { StorageEntity } from '../storage/entities/storage.entity';
import { ParkingModel } from '../parking/models/parking.model';
import { StorageModel } from '../storage/models/storage.model';
import { NotificationService } from '../notification/notification.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { Triggers } from 'src/notification/notification-triggers';

@Injectable()
/**
 * Service class for managing units.
 */
export class UnitService {
  constructor(
    @InjectModel('Unit')
    private readonly unitModel: Model<UnitEntity>,
    private readonly storageService: StorageService,
    private readonly parkingService: ParkingService,
    @InjectModel('Payments')
    private readonly paymentsModel: Model<PaymentsEntity>,
    @InjectModel('RegistrationKey')
    private readonly registrationKeyModel: Model<RegistrationKeyEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => BuildingService))
    private readonly buildingService: BuildingService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Creates a new unit in a building.
   * @param buildingId - The ID of the building where the unit will be created.
   * @param createUnitDto - The data required to create the unit.
   * @returns An object containing the created unit entity and the registration keys for the unit.
   * @throws BadRequestException if the building ID is invalid or if a unit with the same unit number already exists for the building.
   */
  public async createUnit(buildingId: string, createUnitDto: CreateUnitDto) {
    const { unitNumber, size, isOccupiedByRenter, lateFeesInterestRate, fees } =
      createUnitDto;

    const building = await this.buildingService.findBuildingById(buildingId);

    if (!building)
      throw new BadRequestException({ message: 'Invalid building Id' });

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
      let errorDescription = 'Unit could not be created';

      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'A unit with the same unit number already exists for this building.';
      }

      throw new BadRequestException({
        error: error?.message,
        message: errorDescription,
      });
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

  /**
   * Finds a unit registration key.
   * @param key - The registration key to search for.
   * @returns A promise that resolves to the unit registration key.
   */
  public async findUnitRegistrationKey(key: string) {
    return this.registrationKeyModel.findOne({ key });
  }

  /**
   * Updates a unit with the specified unitId using the provided updatedFields.
   * @param unitId - The ID of the unit to be updated.
   * @param updatedFields - The fields to be updated in the unit.
   * @returns A Promise that resolves to the updated unit.
   * @throws NotFoundException if the unit with the specified unitId is not found.
   * @throws BadRequestException if there is an error updating the unit.
   */
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

      if (!updatedUnit)
        throw new NotFoundException({ message: 'Unit not found' });

      return updatedUnit;
    } catch (error) {
      let errorDescription = 'Unit could not be updated';

      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'A unit with the same unit number already exists for this building.';
      }

      throw new BadRequestException({
        error: error?.message,
        message: errorDescription,
      });
    }
  }

  /**
   * Retrieves all building units based on the provided building ID.
   * @param buildingId - The ID of the building.
   * @returns A promise that resolves to an array of UnitModel objects.
   */
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

        const { parkings, storages } = await this.getUnitAmmunitites(
          unit._id.toString(),
        );

        return new UnitModel({
          entity: unit,
          parkings: parkings.map((p) => new ParkingModel(p)),
          storages: storages.map((s) => new StorageModel(s)),
          ownerKey: ownerKey || undefined,
          renterKey: renterKey || undefined,
        });
      }),
    );
  }

  /**
   * Finds a unit by its ID.
   * @param id - The ID of the unit.
   * @returns A promise that resolves to the found unit entity, or null if not found.
   */
  public async findUnitById(id: string): Promise<UnitEntity | null> {
    return await this.unitModel.findOne({ _id: id }).exec();
  }

  /**
   * Removes a unit by its ID.
   * @param id - The ID of the unit to be removed.
   * @throws NotFoundException if the unit is not found.
   */
  public async remove(id: string): Promise<void> {
    const unit = await this.unitModel.findOneAndRemove({ _id: id }).exec();

    if (!unit) throw new NotFoundException({ message: 'Unit not found' });

    const building = await this.buildingService.findBuildingById(
      unit.buildingId.toString(),
    );

    if (!building) return;

    await this.buildingService.updateBuilding(building._id.toString(), {
      unitCount: building.unitCount - 1,
    });
  }

  public async claimOwnerUnit(userId: string, unitKey: string) {
    const user = await this.userService.findUserById(userId);

    if (!user) throw new NotFoundException('User not found');

    if (user.role !== UserRoles.OWNER)
      throw new BadRequestException({
        message: 'Must be an owner to claim a unit',
      });

    const key = await this.findUnitRegistrationKey(unitKey);

    if (!key) throw new BadRequestException({ message: 'Invalid unit key.' });

    const session = await this.unitModel.db.startSession();
    session.startTransaction();

    try {
      await this.linkUnitToUser(userId, key, session);

      await session.commitTransaction();
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      )
        throw error;

      throw new BadRequestException({
        error: error?.message,
        message: error?.message || "Couldn't claim unit",
      });
    } finally {
      session.endSession();
    }
  }

  /**
   * Links a unit to a user using the provided registration key.
   * Throws an exception if the unit is not found or if it is already associated with a user.
   * @param userId - The ID of the user to link the unit to.
   * @param registrationKey - The registration key entity containing the unit ID and type.
   * @param session - The MongoDB client session to use for the transaction.
   * @throws {NotFoundException} - If the unit is not found.
   * @throws {BadRequestException} - If the unit is already associated with a user.
   */
  public async linkUnitToUser(
    userId: string,
    registrationKey: RegistrationKeyEntity,
    session: ClientSession,
  ) {
    const associationKey =
      registrationKey.type == 'owner' ? 'ownerId' : 'renterId';

    const unit = await this.unitModel.findById(registrationKey.unitId);

    if (!unit) throw new NotFoundException({ message: 'Unit not found' });

    if (unit[associationKey])
      throw new BadRequestException({
        message: 'Invalid Key',
      });

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

  /**
   * Generates registration keys for a unit.
   * @param unitId - The ID of the unit.
   * @returns A promise that resolves to an object containing the generated registration keys for the unit.
   * @throws BadRequestException if there is an error while generating the registration keys.
   */
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

  /**
   * Finds the associated units for a given user.
   * @param userId The ID of the user.
   * @returns A promise that resolves to an array of UnitEntity objects.
   * @throws NotFoundException if the user is not found.
   */
  public async findAssociatedUnits(userId: string): Promise<UnitModel[]> {
    const user = await this.userService.findUserById(userId);

    if (!user) throw new NotFoundException({ message: 'User not found' });

    const filterKey = user.role == 3 ? 'ownerId' : 'renterId';

    const units: UnitEntity[] = await this.unitModel
      .find({ [filterKey]: userId })
      .exec();

    return Promise.all(
      units.map(async (unit: UnitEntity) => {
        const building: BuildingEntity | undefined =
          (await this.buildingService.findBuildingById(
            unit.buildingId.toString(),
          )) || undefined;

        const { parkings, storages } = await this.getUnitAmmunitites(
          unit._id.toString(),
        );

        return new UnitModel({
          entity: unit,
          parkings: parkings.map((p) => new ParkingModel(p)),
          storages: storages.map((s) => new StorageModel(s)),
          building: building,
        });
      }),
    );
  }

  private async getUnitAmmunitites(unitId: string): Promise<{
    parkings: ParkingEntity[];
    storages: StorageEntity[];
  }> {
    const parkings = await this.parkingService.findParkingsByUnitId(unitId);
    const storages = await this.storageService.findStoragesByUnitId(unitId);

    return { parkings, storages };
  }

  /**
   * Makes a new payment for a specific unit.
   * @param unitId - The ID of the unit.
   * @param makeNewPaymentDto - The data for the new payment.
   * @returns The HTTP response status.
   * @throws NotFoundException if the unit is not found or not associated with an owner.
   */
  public async makeNewPayment(
    unitId: string,
    makeNewPaymentDto: MakeNewPaymentDto,
  ) {
    const { amount } = makeNewPaymentDto;
    const unit = await this.unitModel.findOne({ _id: unitId });

    if (!unit || !unit?.ownerId) {
      throw new NotFoundException({
        message: 'Unit not found or not associated with an owner',
      });
    }

    let unitPayments = await this.paymentsModel.findOne({ unitId });
    if (!unitPayments) {
      unitPayments = await this.paymentsModel.create({ unitId });
    }

    let updatedOverdueFees = unit.overdueFees - amount;
    let newMonthlyBalance = unit.monthlyFeesBalance;

    if (updatedOverdueFees < 0) {
      // Remove from monthly balance and reset overdue to 0
      newMonthlyBalance += updatedOverdueFees; // overdue fees is negative -> add
      updatedOverdueFees = 0;

      if (newMonthlyBalance < 0) newMonthlyBalance = 0;
    }

    const newPayment = {
      timeStamp: new Date(),
      amount,
      monthBalance: newMonthlyBalance,
      overdueFees: updatedOverdueFees,
      previousMonthBalance: unit?.monthlyFeesBalance,
      previousOverdueFees: unit?.overdueFees,
    } as IUnitPayment;

    unitPayments.record.push(newPayment);

    unit.monthlyFeesBalance = newMonthlyBalance;
    unit.overdueFees = updatedOverdueFees;

    unitPayments.save();
    unit.save();

    // Sending notification to owner
    const owner = (await this.userService.findUserById(
      unit.ownerId.toString(),
    )) as UserEntity;

    const building = (await this.buildingService.findBuildingById(
      unit.buildingId.toString(),
    )) as BuildingEntity;

    await this.notificationService.dispatchNotification(
      Triggers.PAYMENT_PROCESSED,
      {
        buildingName: building.name,
        paymentAmount: amount,
        unitNumber: unit.unitNumber,
      },
      [owner],
    );

    return response.status(HttpStatus.NO_CONTENT);
  }

  /**
   * Retrieves the payment details for a specific unit.
   * @param unitId - The ID of the unit.
   * @returns A promise that resolves to the payment entity or null if not found.
   */
  public async getUnitPayments(unitId: string): Promise<PaymentsEntity | null> {
    return this.paymentsModel.findOne({ unitId });
  }

  /**
   * Retrieves the owner information associated to the unit
   * @param unitId - ID of the unit
   * @returns A promise that resovles to the user entity corresponding to unit owner
   */
  public async getOwnerInformation(unitId: string): Promise<UserEntity> {
    const unit = await this.unitModel.findOne({ _id: unitId });
    if (!unit?.ownerId)
      throw new NotFoundException({
        message: 'Unit has not owner associated to it.',
      });

    const owner = await this.userService.findUserById(unit?.ownerId.toString());

    if (!owner)
      throw new NotFoundException({
        message: 'Owner information could not be retrieved',
      });

    return owner;
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  /**
   * Handles the cron job for processing monthly fees for units.
   * This function retrieves all units, calculates the monthly fees balance,
   * adds any overdue fees, and updates the unit's monthly fees balance.
   * If the unit has an owner, the function saves the updated unit.
   */
  async processMonthlyUnitFees() {
    const units = await this.unitModel.find();
    units.forEach(async (unit) => {
      if (unit.ownerId) {
        // Reset monthly fees balance and add balance to overdue

        const { parkings, storages } = await this.getUnitAmmunitites(
          unit._id.toString(),
        );

        const totalParkingFees = parkings.reduce((acc, current) => {
          return (acc += current.fees);
        }, 0);

        const totalStorageFees = storages.reduce((acc, current) => {
          return (acc += current.fees);
        }, 0);

        unit.overdueFees +=
          unit.monthlyFeesBalance +
          unit.monthlyFeesBalance * (unit.lateFeesInterestRate / 100);

        unit.monthlyFeesBalance =
          unit.fees + totalParkingFees + totalStorageFees;

        await unit.save();
      }
    });
  }
}
