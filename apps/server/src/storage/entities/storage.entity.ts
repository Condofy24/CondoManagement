import * as mongoose from 'mongoose';

export const StorageSchema = new mongoose.Schema(
  {
    buildingId: {
      type: mongoose.Types.ObjectId,
      ref: 'Building',
      required: true,
    },
    storageNumber: { type: Number, required: true },
    isOccupied: { type: Boolean, required: true },
    fees: { type: Number, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export interface Storage {
  buildingId: mongoose.Types.ObjectId;
  storageNumber: number;
  isOccupied: boolean;
  fees: number;
}