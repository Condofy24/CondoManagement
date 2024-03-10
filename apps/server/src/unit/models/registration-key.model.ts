import { ApiProperty } from '@nestjs/swagger';
import { RegistrationKeyEntity } from '../entities/registration-key.entity';

export class RegistrationKeyModel {
  @ApiProperty()
  key: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  isClaimed: boolean;

  constructor(entity: RegistrationKeyEntity) {
    this.key = entity.key;
    this.type = entity.type;
    this.isClaimed = !!entity.claimedBy;
  }
}
