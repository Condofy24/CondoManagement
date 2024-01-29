import * as mongoose from 'mongoose';

export const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    companyId: { type: String, required: true, unique: true, index: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export interface Company {
  name: string;
  location: string;
  companyId: string;
}
