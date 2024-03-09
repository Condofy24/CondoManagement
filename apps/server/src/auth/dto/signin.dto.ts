import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for signing in.
 */
export class SignInDto {
  /**
   * The email address of the user.
   */
  @IsEmail()
  @ApiProperty({ required: true })
  email: string;

  /**
   * The password of the user.
   */
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string;
}
