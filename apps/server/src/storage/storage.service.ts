import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { StorageEntity } from './entities/storage.entity';
import { Model } from 'mongoose';
import { CreateStorageDto } from './dto/create-storage.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';
import { UnitService } from '../unit/unit.service';
import { MongoServerError, ObjectId } from 'mongodb';

@Injectable()
export class StorageService {
  constructor(
    @InjectModel('Storage')
    private readonly storageModel: Model<StorageEntity>,
    @Inject(forwardRef(() => UnitService))
    private readonly unitService: UnitService,
    @Inject(forwardRef(() => BuildingService))
    private readonly buildingService: BuildingService,
  ) {}

  public async createStorage(
    buildingId: string,
    createStorageDto: CreateStorageDto,
  ) {
    const { storageNumber, isOccupiedByRenter, fees } = createStorageDto;

    const building = await this.buildingService.findBuildingById(buildingId);

    if (!building) throw new BadRequestException('Invalid building Id');

    const newStorage = new this.storageModel({
      buildingId: buildingId,
      storageNumber,
      isOccupiedByRenter,
      fees,
    });

    let storageEntity;

    try {
      storageEntity = await newStorage.save();
    } catch (error) {
      let errorDescription = 'Storage could not be created';

      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'A storage with the same storage number already exists for this building.';
      }

      throw new BadRequestException(error?.message, errorDescription);
    }

    // update unit count of associted building
    this.buildingService.updateBuilding(buildingId, {
      storageCount: building.storageCount + 1,
    });

    return storageEntity;
  }

  public async linkStorageToUnit(
    storageId: string,
    unitId: string,
  ): Promise<void> {
    const unit = await this.unitService.findUnitById(unitId);
    if (!unit) throw new NotFoundException('Unit does not exist');

    const storage = await this.storageModel.findById(storageId).exec();

    if (!storage) throw new NotFoundException('Storage does not exist');
    if (storage.unitId)
      throw new BadRequestException('Storage is already linked to a unit');

    await this.storageModel.findOneAndUpdate(
      { _id: new ObjectId(storageId) },
      {
        unitId: unitId,
      },
    );
  }

  public async findAllBuildingStorages(
    buildingId: string,
  ): Promise<StorageEntity[]> {
    return await this.storageModel.find({ buildingId }).exec();
  }

  public async updateStorage(
    storageId: string,
    updatedFields: Partial<StorageEntity>,
  ) {
    try {
      const updatedStorage = await this.storageModel.findByIdAndUpdate(
        new ObjectId(storageId),
        {
          $set: updatedFields,
        },
      );

      if (!updatedStorage) throw new NotFoundException('Storage not found');

      return updatedStorage;
    } catch (error) {
      let errorDescription = 'Storage could not be updated';

      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'A storage with the same storage number already exists for this building.';
      }

      throw new BadRequestException(error?.message, errorDescription);
    }
  }

  public async remove(id: string): Promise<void> {
    const storage = await this.storageModel
      .findOneAndRemove({ _id: id })
      .exec();

    if (!storage) throw new NotFoundException('Storage not found');

    const building = await this.buildingService.findBuildingById(
      storage.buildingId.toString(),
    );

    if (!building) return;

    await this.buildingService.updateBuilding(building._id.toString(), {
      storageCount: building.storageCount - 1,
    });
  }

  public async findStorageByUnitId(unitId: string): Promise<StorageEntity[]> {
    return this.storageModel.find({ unitId }).exec();
  }
}
