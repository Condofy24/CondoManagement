import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPhoneNumber } from '../user.validators';
import { Validate } from 'class-validator';

/**
 * Data transfer object for updating a user.
 */
export class UpdateUserDto {
  /**
   * The new password for the user.
   */
  @IsNotEmpty()
  newPassword: string;

  /**
   * The email address of the user.
   */
  @IsEmail()
  email: string;

  /**
   * The name of the user.
   */
  @IsNotEmpty()
  name: string;

  /**
   * The phone number of the user.
   */
  @Validate(IsValidPhoneNumber)
  @IsNotEmpty()
  phoneNumber: string;
}
