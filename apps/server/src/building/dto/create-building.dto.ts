import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBuildingDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  unitCount: number;

  @IsNotEmpty()
  parkingCount: number;

  @IsNotEmpty()
  storageCount: number;

}
