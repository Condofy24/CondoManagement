import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPhoneNumber } from '../user.validators';
import { Validate } from 'class-validator';
import { CreateCompanyDto } from '../../company/dto/create-company.dto';

export class CreateManagerDto extends CreateCompanyDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @Validate(IsValidPhoneNumber)
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}
