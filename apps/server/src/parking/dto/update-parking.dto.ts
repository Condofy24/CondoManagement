import { IsNotEmpty } from 'class-validator';

export class UpdateParkingDto {
  @IsNotEmpty()
  parkingNumber: number;

  @IsNotEmpty()
  isOccupied: boolean;

  @IsNotEmpty()
  fees: Number;
}
