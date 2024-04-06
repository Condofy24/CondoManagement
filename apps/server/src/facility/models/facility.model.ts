import { ApiProperty } from '@nestjs/swagger';
import { FacilityEntity } from '../entities/facilities.entity';

export class FacilityModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  buildingId: string;

  @ApiProperty()
  fees: number;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  operationTimes: [];

  constructor(entity: FacilityEntity) {
    this.id = entity._id.toString();
    this.buildingId = entity.buildingId.toString();
    this.name = entity.name;
    this.fees = entity.fees;
    this.duration = entity.duration;
    this.operationTimes = entity.operationTimes;
  }
}
