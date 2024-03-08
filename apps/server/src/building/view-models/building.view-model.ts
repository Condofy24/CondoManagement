import { BuildingDocument } from '../entities/building.entity';

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

export const toBuilding = (buildingDocument: BuildingDocument): Building => {
  return {
    id: buildingDocument._id.toString(),
    companyId: buildingDocument.companyId.toString(),
    address: buildingDocument.address,
    unitCount: buildingDocument.unitCount,
    parkingCount: buildingDocument.parkingCount,
    storageCount: buildingDocument.storageCount,
    fileUrl: buildingDocument.fileUrl,
    filePublicId: buildingDocument.filePublicId,
    fileAssetId: buildingDocument.fileAssetId,
  };
};
