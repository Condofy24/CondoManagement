import * as mongoose from 'mongoose';

/**
 * The Mongoose schema for a building.
 */
export const BuildingSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Company',
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    unitCount: { type: Number, required: true, default: 0 },
    parkingCount: { type: Number, required: true, default: 0 },
    storageCount: { type: Number, required: true, default: 0 },
    fileUrl: { type: String, required: true },
    filePublicId: { type: String, required: true },
    fileAssetId: { type: String, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

/**
 * Represents a building
 */
export interface Building {
  companyId: mongoose.Types.ObjectId;
  name: string;
  address: string;
  unitCount: number;
  parkingCount: number;
  storageCount: number;
  fileUrl: string;
  filePublicId: string;
  fileAssetId: string;
}
