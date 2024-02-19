import { IsNotEmpty } from 'class-validator';
import { Double } from 'mongodb';

export class CreateUnitDto {
  @IsNotEmpty()
  parkingNumber: number;

  @IsNotEmpty()
  isOccupiedByRenter: boolean;

  @IsNotEmpty()
  fees: Double;
}
