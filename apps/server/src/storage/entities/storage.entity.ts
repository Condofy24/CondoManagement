import * as mongoose from 'mongoose';

export const StorageSchema = new mongoose.Schema(
  {
    buildingId: {
      type: mongoose.Types.ObjectId,
      ref: 'Building',
      required: true,
    },
    unitId: {
      type: mongoose.Types.ObjectId,
      ref: 'Unit',
      required: false,
    },
    storageNumber: { type: Number, required: true },
    isOccupied: { type: Boolean, required: true },
    fees: { type: Number, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export const StorageModel = mongoose.model(
  'Storage',
  new mongoose.Schema(StorageSchema),
);

export interface Storage {
  buildingId: mongoose.Types.ObjectId;
  unitId?: mongoose.Types.ObjectId;
  storageNumber: number;
  isOccupied: boolean;
  fees: number;
}
