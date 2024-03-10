import * as mongoose from 'mongoose';

export interface UnitEntity extends Document {
  _id: mongoose.Types.ObjectId;
  buildingId: mongoose.Types.ObjectId | Record<string, unknown>;
  ownerId: mongoose.Types.ObjectId | Record<string, unknown>;
  renterId: mongoose.Types.ObjectId | Record<string, unknown>;
  unitNumber: number;
  size: number;
  isOccupiedByRenter: boolean;
  fees: number;
  overdueFees: number;
  monthlyFeesBalance: number;
}

interface UnitModel extends mongoose.Model<UnitEntity> {}

export const UnitSchema = new mongoose.Schema<UnitEntity, UnitModel>(
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
    overdueFees: { type: Number, required: true, default: 0 },
    monthlyFeesBalance: { type: Number, required: true, default: 0 },
    size: { type: Number, required: true },
    isOccupiedByRenter: { type: Boolean, required: true },
    fees: { type: Number, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

// Indexes
export const UnitUniqueNameIndex = 'unitNumber_1';

UnitSchema.index({ unitNumber: 1 }, { unique: true });

export default mongoose.model('Unit', new mongoose.Schema(UnitSchema));
