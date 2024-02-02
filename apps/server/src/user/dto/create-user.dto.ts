import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';
import { IsValidRole, IsValidPhoneNumber } from '../user.validators';
import { Validate } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  //Not working need to be checked 
  @Validate(IsValidRole)
  role: string;

  // @Validate(IsValidPhoneNumber). not working now need to be checked later 
  @IsNotEmpty()
  phoneNumber: string;
}
