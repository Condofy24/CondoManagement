import { Double } from 'mongodb';
import * as mongoose from 'mongoose';

export const VerificationKeySchema = new mongoose.Schema(
  {
    unitId: { type: String, required: true },
    key: { type: String, required: true },
    type: { type: String, required: true },
    claimedBy: { type: String, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export interface Unit {
    unitId:string,
    key:string,
    type:string,
    claimedBy:string,
}
