import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  newPassword: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  image: Express.Multer.File;

  // Should we also be allowed to update the role of the user or no ?
}
