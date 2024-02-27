import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPhoneNumber, IsValidRole } from '../user.validators';
import { Validate } from 'class-validator';

/**
 * Data transfer object for creating a user.
 */
export class CreateUserDto {
  /**
   * The email of the user.
   */
  @IsEmail()
  email: string;

  /**
   * The password of the user.
   */
  @IsNotEmpty()
  password: string;

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

  //To get the verfKey upon signup of a user and checking that its not empty
  @IsNotEmpty()
  verfKey: string;
}
