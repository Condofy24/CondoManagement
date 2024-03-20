import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateStorageDto {
  @IsNotEmpty()
  @ApiProperty()
  storageNumber: number;

  @IsNotEmpty()
  @ApiProperty()
  fees: number;
}
