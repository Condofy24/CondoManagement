import { ApiProperty } from '@nestjs/swagger';
import { BuildingEntity } from '../entities/building.entity';

export class BuildingModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  unitCount: number;

  @ApiProperty()
  parkingCount: number;

  @ApiProperty()
  storageCount: number;

  @ApiProperty()
  fileUrl: string;

  @ApiProperty()
  filePublicId: string;

  @ApiProperty()
  fileAssetId: string;

  constructor(entity: BuildingEntity) {
    this.id = entity._id.toString();
    this.companyId = entity.companyId.toString();
    this.address = entity.address;
    this.unitCount = entity.unitCount;
    this.parkingCount = entity.parkingCount;
    this.storageCount = entity.storageCount;
    this.fileUrl = entity.fileUrl;
    this.filePublicId = entity.filePublicId;
    this.fileAssetId = entity.fileAssetId;
  }
}
