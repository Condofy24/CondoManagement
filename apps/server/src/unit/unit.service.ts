import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Unit } from './entities/unit.entity';
import { Model } from 'mongoose';
import { CreateUnitDto } from './dto/create-unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { VerfService } from '../verf/verf.service';
import { BuildingService } from '../building/building.service';

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
    if (unit) {
      throw new HttpException(
        { error: 'Unit already exists', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUnit = new this.unitModel({
      unitNumber,
      size,
      isOccupiedByRenter,
      fees,
    });
    const result = await newUnit.save();
    const building = await this.buildingService.findOne(buildingId);
    building?.units.push(newUnit);
    const verfKeyOwner = this.verfService.createVerfKey(result.id, 'owner', '');
    const verKeyRenter = this.verfService.createVerfKey(
      result.id,
      'renter',
      '',
    );
    return result;
  }
}
