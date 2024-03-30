import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservationDto {
  /**
   * The status of reservation
   */
  @IsNotEmpty()
  @IsEnum(ReservationStatus, {
    message: 'status must be one of the defined reservation statuses',
  })
  @ApiProperty()
  status: ReservationStatus;
}
