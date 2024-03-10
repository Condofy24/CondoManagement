import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../../user/models/user.model';

/**
 * Represents the model for signing in.
 */
export class SignInModel {
  /**
   * The authentication token.
   */
  @ApiProperty()
  token: string;

  /**
   * The user information.
   */
  @ApiProperty()
  user: UserModel;

  /**
   * Creates an instance of SignInModel.
   * @param token - The authentication token.
   * @param user - The user information.
   */
  constructor(token: string, user: UserModel) {
    this.token = token;
    this.user = user;
  }
}
