import * as mongoose from 'mongoose';

export const CompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, unique: true },
    companyLocation: { type: String, required: true },
    companyId: { type: String, required: true, unique: true, index: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export interface Company {
  companyName: string;
  companyLocation: string;
  companyId: string;
}
