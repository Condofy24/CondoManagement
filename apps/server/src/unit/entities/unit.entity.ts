import { Double } from 'mongodb';
import * as mongoose from 'mongoose';

export const UnitSchema = new mongoose.Schema(
  {
    buildingId: { type: String, required: true },
    unitNumber: { type: Number, required: true },
    size: { type: Number, required: true },
    isOccupiedByRenter: { type: Boolean, required: true },
    fees: { type: Number, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export interface Unit {
  buildingId: string;
  unitNumber: number;
  size: number;
  isOccupiedByRenter: boolean;
  fees: number;
}
