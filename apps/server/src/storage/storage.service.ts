import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Storage } from './entities/storage.entity';
import { Model } from 'mongoose';
import { CreateStorageDto } from './dto/create-storage.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';
import { LinkStorageToUnitDto } from './dto/link-storage-to-unit.dto';
import { UnitService } from 'src/unit/unit.service';
import { response } from 'express';


@Injectable()
export class StorageService {
  constructor(
    @InjectModel('Storage')
    private readonly storageModel: Model<Storage>,
    private readonly buildingService: BuildingService,
    private readonly unitService: UnitService
  ) {}

  public async createStorage(buildingId: string, createStorageDto: CreateStorageDto) {
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
          { error: 'Storage already occupied', status: HttpStatus.BAD_REQUEST },
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
    this.buildingService.findByIdandUpdateStorageCount(buildingExists.id,storageCount);
    const result = await newStorage.save();
    return result;
 } 



  public async linkStorageToUnit(buildingId: string, unitId: string,linkStorageToUnitDto:LinkStorageToUnitDto){
  const { storageNumber } = linkStorageToUnitDto;
  const unitExsits = await this.unitService.findOne(unitId)
  if(!unitExsits){
  throw new HttpException(
          { error: 'Unit does not exist', status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
  }
  const storageExists = await this.storageModel.findOne({storageNumber:storageNumber, buildingId: buildingId})
  if(!storageExists){
    throw new HttpException(
          { error: 'Storage does not exist', status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
  }

  let result = await this.storageModel.findOneAndUpdate({storageNumber, buildingId}, {
    unitId: unitId
  })
  return result

  }

 public async findAll(): Promise<Storage[]> {
    const storages = await this.storageModel.find().exec();
    return storages.map(
      (storage: Storage) =>
        ({
          buildingId: storage.buildingId,
          storageNumber: storage.storageNumber,
          isOccupied: storage.isOccupied,
          fees: storage.fees
        }) as Storage,
  )}

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
    this.buildingService.findByIdandUpdateStorageCount(buildingId, storageCount);

    return response.status(HttpStatus.NO_CONTENT);
  }


}
