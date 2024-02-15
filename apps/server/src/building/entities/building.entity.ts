import * as mongoose from 'mongoose';

export const BuildingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    unitCount: { type: Number, required: true },
    parkingCount: { type: Number, required: true },
    storageCount: { type: Number, required: true },
    fileUrl: { type: String, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export interface Building {
  name: string;
  address: string;
  unitCount: number;
  parkingCount: number;
  storageCount: number;
  fileUrl: string;
}
