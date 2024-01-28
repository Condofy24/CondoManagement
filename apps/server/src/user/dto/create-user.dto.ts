import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidRole } from '../user.validators';
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
}
