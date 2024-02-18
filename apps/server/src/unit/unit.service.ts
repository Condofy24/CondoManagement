import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Unit } from './entities/unit.entity';
import mongoose, { Model } from 'mongoose';
import { CreateUnitDto } from './dto/create-unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { VerfService } from '../verf/verf.service';
import { BuildingService } from '../building/building.service';
import { VerfRolesEnum } from 'src/verf/entities/verf.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UnitService {
  constructor(
    @InjectModel('Unit')
    private readonly unitModel: Model<Unit>,
    private readonly verfService: VerfService,
    private readonly buildingService: BuildingService,
  ) {}

  public async createUnit(buildingId: string, createUnitDto: CreateUnitDto) {
    const { unitNumber, size, isOccupiedByRenter, fees } = createUnitDto;
    const buildingExists = await this.buildingService.findOne(buildingId);
    if (!buildingExists) {
      throw new HttpException(
        { error: "Building doesn't exists", status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const unit = await this.unitModel.findOne({
      unitNumber,
      buildingId: buildingExists.id,
    });
    if (unit) {
      if (unit.buildingId.equals(buildingExists.id)) {
        throw new HttpException(
          { error: 'Unit already exists', status: HttpStatus.BAD_REQUEST },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const newUnit = new this.unitModel({
      buildingId: buildingExists.id,
      unitNumber,
      size,
      isOccupiedByRenter,
      fees,
    });
    const result = await newUnit.save();
    const verfKeyOwner = this.verfService.createVerfKey(
      result.id,
      VerfRolesEnum.OWNER,
      '',
    );
    const verKeyRenter = this.verfService.createVerfKey(
      result.id,
      VerfRolesEnum.RENTER,
      '',
    );
    return result;
  }
}
