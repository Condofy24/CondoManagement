import { IsNotEmpty } from 'class-validator';

export class LinkUnitToBuidlingDto {
  @IsNotEmpty()
  unitNumber: number;
}
