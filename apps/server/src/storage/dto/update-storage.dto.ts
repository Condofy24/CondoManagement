import { IsNotEmpty } from 'class-validator';

export class UpdateStorageDto {
  @IsNotEmpty()
  storageNumber: number;

  @IsNotEmpty()
  isOccupied: boolean;

  @IsNotEmpty()
  fees: Number;
}
