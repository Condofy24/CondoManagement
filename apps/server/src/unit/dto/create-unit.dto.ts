import { IsNotEmpty } from 'class-validator';
import { Double } from 'mongodb';

export class CreateParkingDto {
  @IsNotEmpty()
  unitNumber: number;

  @IsNotEmpty()
  size: Double;

  @IsNotEmpty()
  isOccupiedByRenter: boolean;

  @IsNotEmpty()
  fees: Double;
}
