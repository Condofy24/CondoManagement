import { IsNotEmpty } from 'class-validator';

export class LinkStorageToUnitDto {
  @IsNotEmpty()
  storageNumber: number;
}
