import { ApiProperty } from '@nestjs/swagger';
import {
  ReservationEntity,
  ReservationStatus,
} from '../entities/reservation.entity';

export class ReservationModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  facilityId: string;

  @ApiProperty()
  availabilityId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  status: ReservationStatus;

  constructor(entity: ReservationEntity) {
    this.id = entity._id.toString();
    this.facilityId = entity.facilityId.toString();
    this.availabilityId = entity.availabilityId.toString();
    this.userId = entity.userId.toString();
    this.status = entity.status;
  }
}
