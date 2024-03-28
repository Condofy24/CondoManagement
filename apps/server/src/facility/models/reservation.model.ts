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
  userId: string;

  @ApiProperty()
  status: ReservationStatus;

  constructor(entity: ReservationEntity) {
    this.id = entity._id.toString();
    this.facilityId = entity.facilityId.toString();
    this.userId = entity.userId.toString();
    this.status = entity.status;
  }
}
