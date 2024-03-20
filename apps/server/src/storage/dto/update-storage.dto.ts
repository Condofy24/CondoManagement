import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStorageDto } from './create-storage.dto';

export class UpdateStorageDto extends PartialType(CreateStorageDto) {
  @ApiProperty()
  isOccupiedByRenter: boolean;
}
