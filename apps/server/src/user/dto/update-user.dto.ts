import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPhoneNumber } from '../user.validators';
import { Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for updating a user.
 */
export class UpdateUserDto {
  /**
   * The new password for the user.
   */
  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;

  /**
   * The email address of the user.
   */
  @IsEmail()
  @ApiProperty()
  email: string;

  /**
   * The name of the user.
   */
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  /**
   * The phone number of the user.
   */
  @Validate(IsValidPhoneNumber)
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;
}
