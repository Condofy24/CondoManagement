import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ClaimOwnerUnitDto {
  @ApiProperty()
  @IsNotEmpty()
  key: string;
}
