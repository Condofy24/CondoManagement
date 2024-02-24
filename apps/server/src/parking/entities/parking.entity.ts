import * as mongoose from 'mongoose';

export const ParkingSchema = new mongoose.Schema(
  {
    buildingId: {
      type: mongoose.Types.ObjectId,
      ref: 'Building',
      required: true,
    },
    unitId: {
      type: mongoose.Types.ObjectId,
      ref: 'Unit',
      required: false,
    },
    parkingNumber: { type: Number, required: true },
    isOccupied: { type: Boolean, required: true },
    fees: { type: Number, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export interface Parking {
  buildingId: mongoose.Types.ObjectId;
  unitId?: mongoose.Types.ObjectId
  parkingNumber: number;
  isOccupied: boolean;
  fees: number;
}