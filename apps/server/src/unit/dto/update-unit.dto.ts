import { IsNotEmpty } from 'class-validator';
import { Double } from 'mongodb';

export class UpdateUnitDto {
  @IsNotEmpty()
  unitNumber: number;

  @IsNotEmpty()
  size: Double;

  @IsNotEmpty()
  isOccupiedByRenter: boolean;

  @IsNotEmpty()
  fees: Double;
}
