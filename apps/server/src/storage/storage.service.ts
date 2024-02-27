import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Storage } from './entities/storage.entity';
import { Model } from 'mongoose';
import { CreateStorageDto } from './dto/create-storage.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';
import { LinkStorageToUnitDto } from './dto/link-storage-to-unit.dto';
import { UnitService } from '../unit/unit.service';
import { response } from 'express';
import { UpdateStorageDto } from './dto/update-storage.dto';

@Injectable()
export class StorageService {
  constructor(
    @InjectModel('Storage')
    private readonly storageModel: Model<Storage>,
    private readonly buildingService: BuildingService,
    private readonly unitService: UnitService,
  ) {}

  public async createStorage(
    buildingId: string,
    createStorageDto: CreateStorageDto,
  ) {
    const { storageNumber, isOccupied, fees } = createStorageDto;
    const buildingExists = await this.buildingService.findOne(buildingId);
    if (!buildingExists) {
      throw new HttpException(
        { error: "Building doesn't exists", status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const storage = await this.storageModel.findOne({
      storageNumber,
      buildingId: buildingExists.id,
    });
    if (storage) {
      if (storage.buildingId.equals(buildingExists.id)) {
        throw new HttpException(
          { error: 'Storage already exists', status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    let storageCount = buildingExists.storageCount;

    const newStorage = new this.storageModel({
      buildingId: buildingExists.id,
      storageNumber,
      isOccupied,
      fees,
    });
    storageCount++;
    this.buildingService.findByIdandUpdateStorageCount(
      buildingExists.id,
      storageCount,
    );
    const result = await newStorage.save();
    return result;
  }

  public async linkStorageToUnit(
    buildingId: string,
    unitId: string,
    linkStorageToUnitDto: LinkStorageToUnitDto,
  ) {
    const { storageNumber } = linkStorageToUnitDto;
    const unitExsits = await this.unitService.findOne(unitId);
    if (!unitExsits) {
      throw new HttpException(
        { error: 'Unit does not exist', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const storageExists = await this.storageModel.findOne({
      storageNumber: storageNumber,
      buildingId: buildingId,
    });
    if (!storageExists) {
      throw new HttpException(
        { error: 'Storage does not exist', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }

    let result = await this.storageModel.findOneAndUpdate(
      { storageNumber, buildingId },
      {
        unitId: unitId,
        isOccupied: true,
      },
    );
    return result;
  }

  public async findAll(buildingId: string): Promise<Storage[]> {
    const storage = await this.storageModel.find({ buildingId }).exec();
    return storage.map(
      (storage: Storage) =>
        ({
          buildingId: storage.buildingId,
          storageNumber: storage.storageNumber,
          isOccupied: storage.isOccupied,
          fees: storage.fees,
        }) as Storage,
    );
  }

  public async updateStorage(
    storageId: string,
    updateStorageDto: UpdateStorageDto,
  ) {
    const { storageNumber, isOccupied, fees } = updateStorageDto;
    const storage = await this.storageModel.findById(storageId);
    //FindOne by the storage number and the building id
    if (!storage) {
      throw new HttpException(
        { error: "Storage doesn't exists", status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (storage.storageNumber != storageNumber) {
      const duplicateStorageNumber = await this.storageModel.findOne({
        buildingId: storage.buildingId,
        storageNumber: storageNumber,
      });
      if (duplicateStorageNumber) {
        throw new HttpException(
          {
            error: 'Storage number already taken',
            status: HttpStatus.BAD_REQUEST,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const result = await this.storageModel.findByIdAndUpdate(storageId, {
      storageNumber: storageNumber,
      isOccupied: isOccupied,
      fees: fees,
    }); // To return the updated document)
    if (result instanceof Error)
      return new HttpException(' ', HttpStatus.INTERNAL_SERVER_ERROR);
    return {
      storageNumber,
      isOccupied,
      fees,
    };
  }

  public async remove(id: string): Promise<any> {
    const storage = await this.storageModel.findById(id).exec();
    if (!storage) {
      throw new HttpException('Storage not found', HttpStatus.BAD_REQUEST);
    }
    const buildingId = storage.buildingId.toString();
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
    let storageCount = building.storageCount;

    await this.storageModel.remove(storage);
    storageCount--;
    this.buildingService.findByIdandUpdateStorageCount(
      buildingId,
      storageCount,
    );

    return response.status(HttpStatus.NO_CONTENT);
  }

  public async findByUnitId(unitId: string): Promise<Storage[]> {
    const unit = await this.unitService.findOne(unitId);
    if (unit) {
      return this.storageModel.find({ unitId: unitId });
    }
    throw new HttpException('Unit does not exist', HttpStatus.NOT_FOUND);
  }
}
