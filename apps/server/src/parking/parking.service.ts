import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Parking } from './entities/parking.entity';
import { Model } from 'mongoose';
import { CreateParkingDto } from './dto/create-parking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';
import { LinkParkingToUnitDto } from './dto/link-parking-to-unit.dtp';
import { UnitService } from 'src/unit/unit.service';
import { response } from 'express';
import { UpdateParkingDto } from './dto/update-parking.dto';

@Injectable()
export class ParkingService {
  constructor(
    @InjectModel('Parking')
    private readonly parkingModel: Model<Parking>,
    private readonly unitService: UnitService,
    @Inject(forwardRef(() => BuildingService))
    private readonly buildingService: BuildingService,
  ) {}

  public async createParking(
    buildingId: string,
    createParkingDto: CreateParkingDto,
  ) {
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
          {
            error: 'Parking number already exists',
            status: HttpStatus.BAD_REQUEST,
          },
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
    this.buildingService.findByIdandUpdateParkingCount(
      buildingExists.id,
      parkingCount,
    );
    const result = await newParking.save();
    return result;
  }

  public async linkParkingToUnit(
    buildingId: string,
    unitId: string,
    linkParkingToUnitDto: LinkParkingToUnitDto,
  ) {
    const { parkingNumber } = linkParkingToUnitDto;
    const unitExsits = await this.unitService.findOne(unitId);
    if (!unitExsits) {
      throw new HttpException(
        { error: 'Unit does not exist', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const parkingExists = await this.parkingModel.findOne({
      parkingNumber: parkingNumber,
      buildingId: buildingId,
    });
    if (!parkingExists) {
      throw new HttpException(
        { error: 'Parking does not exist', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }

    let result = await this.parkingModel.findOneAndUpdate(
      { parkingNumber, buildingId },
      {
        unitId: unitId,
        isOccupied: true,
      },
    );
    return result;
  }

  public async findByUnitId(unitId: string): Promise<Parking[]> {
    const unit = await this.unitService.findOne(unitId);
    if (unit) {
      return this.parkingModel.find({ unitId: unitId });
    }
    throw new HttpException('Unit does not exist', HttpStatus.NOT_FOUND);
  }

  public async findAll(buildingId: string): Promise<Parking[]> {
    const parking = await this.parkingModel.find({ buildingId }).exec();
    return parking.map(
      (parking: Parking) =>
        ({
          buildingId: parking.buildingId,
          parkingNumber: parking.parkingNumber,
          isOccupied: parking.isOccupied,
          fees: parking.fees,
        }) as Parking,
    );
  }
  public async updateParking(
    parkingId: string,
    updateParkingDto: UpdateParkingDto,
  ) {
    const { parkingNumber, isOccupied, fees } = updateParkingDto;

    const parking = await this.parkingModel.findById(parkingId);
    if (!parking) {
      throw new HttpException(
        { error: "Parking doesn't exists", status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (parking.parkingNumber != parkingNumber) {
      const duplicateParkingNumber = await this.parkingModel.findOne({
        buildingId: parking.buildingId,
        parkingNumber: parkingNumber,
      });
      if (duplicateParkingNumber) {
        throw new HttpException(
          {
            error: 'Parking number already taken',
            status: HttpStatus.BAD_REQUEST,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const result = await this.parkingModel.findByIdAndUpdate(parkingId, {
      parkingNumber: parkingNumber,
      isOccupied: isOccupied,
      fees: fees,
    });
    if (result instanceof Error)
      return new HttpException(' ', HttpStatus.INTERNAL_SERVER_ERROR);
    return {
      parkingNumber,
      isOccupied,
      fees,
    };
  }

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
    this.buildingService.findByIdandUpdateParkingCount(
      buildingId,
      parkingCount,
    );

    return response.status(HttpStatus.NO_CONTENT);
  }
}
