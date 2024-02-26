import { IsNotEmpty } from 'class-validator';

export class CreateStorageDto {
  @IsNotEmpty()
  storageNumber: number;

  @IsNotEmpty()
  isOccupied: boolean;

  @IsNotEmpty()
  fees: Number;
}