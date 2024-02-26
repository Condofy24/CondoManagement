import { IsNotEmpty } from 'class-validator';

export class CreateParkingDto {
  @IsNotEmpty()
  parkingNumber: number;

  @IsNotEmpty()
  isOccupied: boolean;

  @IsNotEmpty()
  fees: Number;
}
