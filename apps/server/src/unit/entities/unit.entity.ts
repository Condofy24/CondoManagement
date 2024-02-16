import { Double } from 'mongodb';
import * as mongoose from 'mongoose';

export const UnitSchema = new mongoose.Schema(
  {
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
  unitNumber: number;
  size: number;
  isOccupiedByRenter: boolean;
  fees: number;
}
