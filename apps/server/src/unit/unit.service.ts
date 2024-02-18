import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Unit } from './entities/unit.entity';
import { Model } from 'mongoose';
import { CreateUnitDto } from './dto/create-unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { VerfService } from '../verf/verf.service';
import { BuildingService } from '../building/building.service';
import { VerfRolesEnum } from 'src/verf/entities/verf.entity';

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
    const unit = await this.unitModel.findOne({ unitNumber });
    const buildingExists = await this.buildingService.findOne(buildingId);
    if (!buildingExists) {
      throw new HttpException(
        { error: "Building doesn't exists", status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (unit) {
      throw new HttpException(
        { error: 'Unit already exists', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUnit = new this.unitModel({
      buildingId,
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
