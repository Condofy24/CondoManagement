import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  newPassword: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phoneNumber: string;

  // Should we also be allowed to update the role of the user or no ?
  // Take a look at this after
}
