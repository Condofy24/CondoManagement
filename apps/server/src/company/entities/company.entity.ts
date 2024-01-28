import * as mongoose from 'mongoose';

export const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export interface Company {
  name: string;
  location: string;
}
