import { IsNotEmpty } from 'class-validator';
import { Double } from 'mongodb';

export class UpdateParkingDto {
  @IsNotEmpty()
  parkingNumber: number;

  @IsNotEmpty()
  isOccupied: boolean;

  @IsNotEmpty()
  fees: Double;
}