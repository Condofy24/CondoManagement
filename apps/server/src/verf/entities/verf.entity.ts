import * as mongoose from 'mongoose';
export enum VerfRolesEnum {
  OWNER = 0,
  RENTER = 1,
}
export const VerificationKeySchema = new mongoose.Schema(
  {
    unitId: { type: String, required: true },
    key: { type: String, required: true },
    type: { type: Number, required: true },
    claimedBy: { type: String, required: false },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

/**
 * Represents the Verification model in the database.
 */
export const VerfModel = mongoose.model(
  'Verification',
  new mongoose.Schema(VerificationKeySchema),
);

export interface VerificationKey {
  unitId: string;
  key: string;
  type: number;
  claimedBy: string;
}
