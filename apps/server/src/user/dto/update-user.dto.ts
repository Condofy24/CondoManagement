import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPhoneNumber } from '../user.validators';
import { Validate } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  newPassword: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @Validate(IsValidPhoneNumber)
  @IsNotEmpty()
  phoneNumber: string;
}
