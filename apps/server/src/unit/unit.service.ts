import { Injectable } from '@nestjs/common';
import { Unit } from './entities/unit.entity';
import { Model } from 'mongoose';
import { CreateUnitDto } from './dto/create-unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { VerfService } from 'src/verf/verf.service';

@Injectable()
export class UnitService {
  constructor(
    @InjectModel('Unit')
    private readonly unitModel: Model<Unit>,
    private readonly verfService: VerfService,
  ) {}

  public async createUnit(createUnitDto: CreateUnitDto) {
    const { unitNumber, size, isOccupiedByRenter, fees } = createUnitDto;
    const key = this.verfService.createVerfKey('s', 'owner', '222');
    console.log(key);

    const newUnit = new this.unitModel({
      unitNumber,
      size,
      isOccupiedByRenter,
      fees,
    });
    const result = await newUnit.save();
    return result;
  }
}
