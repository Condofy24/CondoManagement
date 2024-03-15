import * as mongoose from 'mongoose';

export interface StorageEntity extends Document {
  _id: mongoose.Types.ObjectId;
  buildingId: mongoose.Types.ObjectId | Record<string, unknown>;
  unitId: mongoose.Types.ObjectId | Record<string, unknown>;
  storageNumber: number;
  isOccupiedByRenter: boolean;
  fees: number;
}

interface StorageModel extends mongoose.Model<StorageEntity> {}

export const StorageSchema = new mongoose.Schema<StorageEntity, StorageModel>(
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
    isOccupiedByRenter: { type: Boolean, required: true },
    fees: { type: Number, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export const StorageUniqueNameIndex = 'storageNumber_1_buildingId_1';
StorageSchema.index({ storageNumber: 1, buildingId: 1 }, { unique: true });

export default mongoose.model('Storage', new mongoose.Schema(StorageSchema));
