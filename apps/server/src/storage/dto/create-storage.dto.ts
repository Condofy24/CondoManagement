import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateStorageDto {
  @IsNotEmpty()
  @ApiProperty()
  storageNumber: number;

  @ApiProperty()
  @IsNotEmpty()
  isOccupiedByRenter: boolean;

  @IsNotEmpty()
  @ApiProperty()
  fees: number;
}
