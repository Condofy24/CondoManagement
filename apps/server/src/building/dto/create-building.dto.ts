import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateBuildingDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsInt()
  unitCount: number;

  @IsNotEmpty()
  @IsInt()
  parkingCount: number;

  @IsNotEmpty()
  @IsInt()
  storageCount: number;

  @IsNotEmpty()
  fileUrl: string;
}
