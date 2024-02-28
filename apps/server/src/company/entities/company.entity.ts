import * as mongoose from 'mongoose';

export const CompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, unique: true },
    companyLocation: { type: String, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export interface Company {
  companyName: string;
  companyLocation: string;
}

export const CompanyModel = mongoose.model(
  'Company',
  new mongoose.Schema(CompanySchema),
);
