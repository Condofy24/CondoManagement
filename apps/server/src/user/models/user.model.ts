import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: number;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  imageId: string;

  @ApiProperty()
  companyId?: string;

  constructor(entity: UserEntity) {
    this.id = entity._id;
    this.email = entity.email;
    this.name = entity.name;
    this.role = entity.role;
    this.phoneNumber = entity.phoneNumber;
    this.imageUrl = entity.imageUrl;
    this.imageId = entity.imageId;
    this.companyId = entity.companyId;
  }
}
