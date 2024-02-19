import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Storage } from './entities/storage.entity';
import { Model } from 'mongoose';
import { CreateStorageDto } from './dto/create-storage.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';


@Injectable()
export class StorageService {
  constructor(
    @InjectModel('Storage')
    private readonly storageModel: Model<Storage>,
    private readonly buildingService: BuildingService,
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
  let storageAvailability = buildingExists.storageCount;
  
   if(storageAvailability==0){
    throw new HttpException(
        { error: 'No more available storages', status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
  }
    const newStorage = new this.storageModel({
      buildingId: buildingExists.id,
      storageNumber,
      isOccupied,
      fees,
    });
    storageAvailability--;
    this.buildingService.findByIdandUpdateStorageCount(buildingExists.id,storageAvailability);
    const result = await newStorage.save();
    return result;
 } 
}
