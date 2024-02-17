import * as mongoose from 'mongoose';

export const VerificationKeySchema = new mongoose.Schema(
  {
    unitId: { type: String, required: true },
    key: { type: String, required: true },
    type: { type: String, required: true },
    claimedBy: { type: String, required: false },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export interface VerificationKey {
  unitId: string;
  key: string;
  type: string;
  claimedBy: string;
}
