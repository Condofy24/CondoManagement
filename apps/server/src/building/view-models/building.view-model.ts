import { BuildingEntity } from '../entities/building.entity';

/**
 * Represents a building
 */
export type Building = {
  id: string;
  companyId: string;
  address: string;
  unitCount: number;
  parkingCount: number;
  storageCount: number;
  fileUrl: string;
  filePublicId: string;
  fileAssetId: string;
};

export const toBuilding = (entity: BuildingEntity): Building => {
  return {
    id: entity._id.toString(),
    companyId: entity.companyId.toString(),
    address: entity.address,
    unitCount: entity.unitCount,
    parkingCount: entity.parkingCount,
    storageCount: entity.storageCount,
    fileUrl: entity.fileUrl,
    filePublicId: entity.filePublicId,
    fileAssetId: entity.fileAssetId,
  };
};
