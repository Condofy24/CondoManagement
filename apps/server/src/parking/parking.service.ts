import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Parking } from './entities/parking.entity';
import { Model } from 'mongoose';
import { CreateParkingDto } from './dto/create-parking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';


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
}
