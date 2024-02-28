import * as mongoose from 'mongoose';

export const UnitSchema = new mongoose.Schema(
  {
    buildingId: {
      type: mongoose.Types.ObjectId,
      ref: 'Building',
      required: true,
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    renterId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    unitNumber: { type: Number, required: true },
    size: { type: Number, required: true },
    isOccupiedByRenter: { type: Boolean, required: true },
    fees: { type: Number, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export const UnitModel = mongoose.model(
  'Unit',
  new mongoose.Schema(UnitSchema),
);

export interface Unit {
  buildingId: mongoose.Types.ObjectId;
  ownerId?: mongoose.Types.ObjectId;
  renterId?: mongoose.Types.ObjectId;
  unitNumber: number;
  size: number;
  isOccupiedByRenter: boolean;
  fees: number;
}
