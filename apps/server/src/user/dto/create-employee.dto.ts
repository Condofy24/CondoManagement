import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPhoneNumber, IsValidRole } from '../user.validators';
import { Validate } from 'class-validator';

export class CreateEmployeeDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @Validate(IsValidRole)
  role: string;

  @Validate(IsValidPhoneNumber)
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  companyId: string;
}
