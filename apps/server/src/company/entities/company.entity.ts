import mongoose, { Document } from 'mongoose';

export interface CompanyEntity extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  location: string;
}

export interface CompanyModel extends mongoose.Model<CompanyEntity> {}

export const CompanySchema = new mongoose.Schema<CompanyEntity, CompanyModel>(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

/**
 * Indices
 */
export const CompanyUniqueNameIndex = 'company-unique-name-index';
CompanySchema.index(
  { name: 1 },
  { unique: true, name: CompanyUniqueNameIndex },
);

export const CompanyUniqueLocationIndex = 'company-unique-location-index';
CompanySchema.index(
  { location: 1 },
  { unique: true, name: CompanyUniqueLocationIndex },
);

export default mongoose.model('Company', new mongoose.Schema(CompanySchema));
