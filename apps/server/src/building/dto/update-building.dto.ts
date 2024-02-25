import { IsNotEmpty } from 'class-validator';

export class updateBuildingDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;


}
