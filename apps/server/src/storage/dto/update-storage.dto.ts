import { IsNotEmpty } from 'class-validator';
import { Double } from 'mongodb';

export class UpdateStorageDto {
  @IsNotEmpty()
  storageNumber: number;

  @IsNotEmpty()
  isOccupied: boolean;

  @IsNotEmpty()
  fees: Number;
}
