import { ApiProperty } from '@nestjs/swagger';
import { FacilityEntity } from '../entities/facilities.entity';
import { ObjectId } from 'mongoose';

export class FacilityModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  buildingId: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  operationTimes: [{ type: ObjectId }];

  constructor(entity: FacilityEntity) {
    this.id = entity._id.toString();
    this.buildingId = entity.buildingId.toString();
    this.name = entity.name;
    this.price = entity.price;
    this.duration = entity.duration;
    this.operationTimes = entity.operationTimes;
  }
}