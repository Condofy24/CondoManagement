import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @ApiProperty()
  companyName: string;

  @IsNotEmpty()
  @ApiProperty()
  companyLocation: string;
}
