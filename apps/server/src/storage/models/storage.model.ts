import { ApiProperty } from '@nestjs/swagger';
import { StorageEntity } from '../entities/storage.entity';

export class StorageModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  buildingId: string;

  @ApiProperty()
  unitId?: string;

  @ApiProperty()
  storageNumber: number;

  @ApiProperty()
  isOccupiedByRenter: boolean;

  @ApiProperty()
  fees: number;

  constructor(entity: StorageEntity) {
    this.id = entity._id.toString();
    this.buildingId = entity.buildingId.toString();
    this.unitId = entity.unitId?.toString();
    this.storageNumber = entity.storageNumber;
    this.isOccupiedByRenter = entity.isOccupiedByRenter;
    this.fees = entity.fees;
  }
}
