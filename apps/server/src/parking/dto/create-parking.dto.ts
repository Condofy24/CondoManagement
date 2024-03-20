import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateParkingDto {
  @IsNotEmpty()
  @ApiProperty()
  parkingNumber: number;

  @IsNotEmpty()
  @ApiProperty()
  fees: number;
}
