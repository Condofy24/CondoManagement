import { IsNotEmpty } from 'class-validator';

export class CreateUnitDto {
  @IsNotEmpty()
  unitNumber: number;

  @IsNotEmpty()
  size: number;

  @IsNotEmpty()
  isOccupiedByRenter: boolean;

  @IsNotEmpty()
  fees: number;

  lateFeesInterestRate?: number;
}
