import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Parking } from './entities/parking.entity';
import { Model } from 'mongoose';
import { CreateParkingDto } from './dto/create-parking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';
import { LinkParkingToUnitDto } from './dto/link-parking-to-unit.dtp';
import { UnitService } from 'src/unit/unit.service';
import { response } from 'express';


@Injectable()
export class ParkingService {
  constructor(
    @InjectModel('Parking')
    private readonly parkingModel: Model<Parking>,
    private readonly buildingService: BuildingService,
    private readonly unitService: UnitService
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
  let parkingCount = buildingExists.parkingCount;

    const newParking = new this.parkingModel({
      buildingId: buildingExists.id,
      parkingNumber,
      isOccupied,
      fees,
    });
    parkingCount++;
    this.buildingService.findByIdandUpdateParkingCount(buildingExists.id,parkingCount);
    const result = await newParking.save();
    return result;
 }
 
  public async linkParkingToUnit(buildingId: string, unitId: string,linkParkingToUnitDto:LinkParkingToUnitDto){
  const { parkingNumber } = linkParkingToUnitDto;
  const unitExsits = await this.unitService.findOne(unitId)
  if(!unitExsits){
  throw new HttpException(
          { error: 'Unit does not exist', status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
  }
  const parkingExists = await this.parkingModel.findOne({parkingNumber:parkingNumber, buildingId: buildingId})
  if(!parkingExists){
    throw new HttpException(
          { error: 'Parking does not exist', status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
  }

  let result = await this.parkingModel.findOneAndUpdate({parkingNumber, buildingId}, {
    unitId: unitId
  })
  return result
}

 public async findAll(): Promise<Parking[]> {
    const parkings = await this.parkingModel.find().exec();
    return parkings.map(
      (parking: Parking) =>
        ({
          buildingId: parking.buildingId,
          parkingNumber: parking.parkingNumber,
          isOccupied: parking.isOccupied,
          fees: parking.fees
        }) as Parking,
  )}


  public async removeParking(id: string): Promise<any> {
    const parkingExsits = await this.parkingModel.findById(id).exec();
    if (!parkingExsits) {
      throw new HttpException('Parking not found', HttpStatus.BAD_REQUEST);
    }
    const buildingId = parkingExsits.buildingId.toString();
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
    let parkingCount = building.parkingCount;

    await this.parkingModel.remove(parkingExsits);
    parkingCount--;
    this.buildingService.findByIdandUpdateParkingCount(buildingId, parkingCount);

    return response.status(HttpStatus.NO_CONTENT);
  }
}
