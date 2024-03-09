import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../../user/models/user.model';

export class SignInModel {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: UserModel;

  constructor(token: string, user: UserModel) {
    this.token = token;
    this.user = user;
  }
}
