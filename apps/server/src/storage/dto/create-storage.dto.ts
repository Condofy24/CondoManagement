import { IsNotEmpty } from 'class-validator';
import { Double } from 'mongodb';

export class CreateStorageDto {
  @IsNotEmpty()
  storageNumber: number;

  @IsNotEmpty()
  isOccupied: boolean;

  @IsNotEmpty()
  fees: Double;
}