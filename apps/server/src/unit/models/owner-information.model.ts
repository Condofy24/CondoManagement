import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';

export class OwnerInformationModel {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  constructor(owner: UserEntity) {
    this.name = owner.name;
    this.email = owner.email;
    this.phoneNumber = owner.phoneNumber;
  }
}
