import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for signing in.
 */
export class SignInDto {
  /**
   * The email address of the user.
   */
  @IsEmail()
  email: string;

  /**
   * The password of the user.
   */
  @IsNotEmpty()
  password: string;
}
