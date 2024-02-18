import * as mongoose from 'mongoose';
import { Unit } from 'src/unit/entities/unit.entity';

export const BuildingSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Company',
    },
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
  companyId: mongoose.Schema.Types.ObjectId;
  name: string;
  address: string;
  unitCount: number;
  parkingCount: number;
  storageCount: number;
  fileUrl: string;
  filePublicId: string;
  fileAssetId: string;
}
