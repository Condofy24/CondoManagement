import { IsNotEmpty } from 'class-validator';
import { Double } from 'mongodb';

export class CreateParkingDto {
  @IsNotEmpty()
  parkingNumber: number;

  @IsNotEmpty()
  isOccupiedByRenter: boolean;

  @IsNotEmpty()
  fees: Double;
}
