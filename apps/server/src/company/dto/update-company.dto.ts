import { IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto {
  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  companyLocation: string;
}
