import { IsNotEmpty } from 'class-validator';
import { Double } from 'mongodb';

export class CreateUnitDto {
  @IsNotEmpty()
  unitNumber: number;

  @IsNotEmpty()
  size: Double;

  @IsNotEmpty()
  isOccupiedByRenter: boolean;

  @IsNotEmpty()
  fees: Double;
}
