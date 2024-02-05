import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPhoneNumber, IsValidRole } from '../user.validators';
import { Validate } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @Validate(IsValidRole)
  role: string;

  @Validate(IsValidPhoneNumber)
  @IsNotEmpty()
  phoneNumber: string;
}
