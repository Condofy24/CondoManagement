import mongoose, { Document } from 'mongoose';

export interface BuildingDocument extends Document {
  _id: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId | Record<string, unknown>;
  name: string;
  address: string;
  unitCount: number;
  parkingCount: number;
  storageCount: number;
  fileUrl: string;
  filePublicId: string;
  fileAssetId: string;
}

interface BuildingModel extends mongoose.Model<BuildingDocument> {}

/**
 * The Mongoose schema for a building.
 */
export const BuildingSchema = new mongoose.Schema<
  BuildingDocument,
  BuildingModel
>(
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

// Indexes for unique constraint
BuildingSchema.index(
  { address: 1, companyId: 1 },
  { unique: true, name: 'unique-address-index' },
);

BuildingSchema.index(
  { name: 1, companyId: 1 },
  { unique: true, name: 'unique-name-index' },
);

BuildingSchema.methods.toBuildingModel = function (this: BuildingDocument) {
  return {
    id: this._id.toString(),
    companyId: this.companyId.toString(),
    name: this.name,
    address: this.address,
    unitCount: this.unitCount,
    parkingCount: this.parkingCount,
    storageCount: this.storageCount,
    fileUrl: this.fileUrl,
    filePublicId: this.filePublicId,
    fileAssetId: this.fileAssetId,
  };
};

export default mongoose.model('Building', new mongoose.Schema(BuildingSchema));
