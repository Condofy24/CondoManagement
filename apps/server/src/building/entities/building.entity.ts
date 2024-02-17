import * as mongoose from 'mongoose';
import { Unit } from 'src/unit/entities/unit.entity';

export const BuildingSchema = new mongoose.Schema(
  {
    companyId: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    unitCount: { type: Number, required: true },
    parkingCount: { type: Number, required: true },
    storageCount: { type: Number, required: true },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String, required: true },
    fileAssetId: { type: String, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export interface Building {
  companyId: string;
  name: string;
  address: string;
  unitCount: number;
  parkingCount: number;
  storageCount: number;
  fileUrl: string;
  filePublicId: string;
  fileAssetId: string;
}
