import { IsNotEmpty } from 'class-validator';
export class UpdateUnitDto {
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
