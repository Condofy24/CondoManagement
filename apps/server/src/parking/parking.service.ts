import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Parking } from './entities/parking.entity';
import mongoose, { Model } from 'mongoose';
import { CreateParkingDto } from './dto/create-parking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { VerfService } from '../verf/verf.service';
import { BuildingService } from '../building/building.service';
import { VerfRolesEnum } from 'src/verf/entities/verf.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParkingService {
  constructor(
    @InjectModel('Parking')
    private readonly parkingModel: Model<Parking>,
    private readonly buildingService: BuildingService,
  ) {}

  public async createParking(buildingId: string, createParkingDto: CreateParkingDto) {
    const { parkingNumber, isOccupied, fees } = createParkingDto;
    const buildingExists = await this.buildingService.findOne(buildingId);
    if (!buildingExists) {
      throw new HttpException(
        { error: "Building doesn't exists", status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const parking = await this.parkingModel.findOne({
      parkingNumber,
      buildingId: buildingExists.id,
    });
    if (parking) {
      if (parking.buildingId.equals(buildingExists.id)) {
        throw new HttpException(
          { error: 'Parking already occupied', status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  let parkingAvailability = buildingExists.parkingCount;
  
   if(parkingAvailability==0){
    throw new HttpException(
        { error: 'No more available parkings', status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
  }
    const newParking = new this.parkingModel({
      buildingId: buildingExists.id,
      parkingNumber,
      isOccupied,
      fees,
    });
    parkingAvailability--;
    this.buildingService.findByIdandUpdateParkingCount(buildingExists.id,parkingAvailability);
    const result = await newParking.save();
    return result;
 } 
}
