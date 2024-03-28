import { ApiProperty } from '@nestjs/swagger';
import {
  FacilityAvailabilityEntity,
  FacilityAvailabilityStatus,
} from '../entities/availability.entity';

export class AvailabilityModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  facilityId: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  status: FacilityAvailabilityStatus;

  constructor(entity: FacilityAvailabilityEntity) {
    this.id = entity._id.toString();
    this.facilityId = entity.facilityId.toString();
    this.startDate = entity.startDate;
    this.endDate = entity.endDate;
    this.status = entity.status;
  }
}
