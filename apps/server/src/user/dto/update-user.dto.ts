import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  newPassword: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  name: string;
}
