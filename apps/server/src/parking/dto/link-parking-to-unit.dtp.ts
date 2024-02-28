import { IsNotEmpty } from 'class-validator';

export class LinkParkingToUnitDto {
  @IsNotEmpty()
  parkingNumber: number;
}
