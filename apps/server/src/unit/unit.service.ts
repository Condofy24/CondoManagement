import {
  BadRequestException,
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
import { UnitModel } from './models/unit.model';

@Injectable()
export class UnitService {
  constructor(
    @InjectModel('Unit')
    private readonly unitModel: Model<UnitEntity>,
    @InjectModel('RegistrationKey')
    private readonly registrationKeyModel: Model<RegistrationKeyEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => BuildingService))
    private readonly buildingService: BuildingService,
  ) {}

  public async createUnit(buildingId: string, createUnitDto: CreateUnitDto) {
    const { unitNumber, size, isOccupiedByRenter, fees } = createUnitDto;

    const building = await this.buildingService.findBuildingById(buildingId);

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
}
