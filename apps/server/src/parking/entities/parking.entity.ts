import * as mongoose from 'mongoose';

export interface ParkingEntity extends Document {
  _id: mongoose.Types.ObjectId;
  buildingId: mongoose.Types.ObjectId | Record<string, unknown>;
  unitId: mongoose.Types.ObjectId | Record<string, unknown>;
  parkingNumber: number;
  isOccupiedByRenter: boolean;
  fees: number;
}

interface ParkingModel extends mongoose.Model<ParkingEntity> {}

export const ParkingSchema = new mongoose.Schema<ParkingEntity, ParkingModel>(
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
    isOccupiedByRenter: { type: Boolean, required: true },
    fees: { type: Number, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export const ParkingUniqueNameIndex = 'parkingNumber_1_buildingId_1';
ParkingSchema.index({ parkingNumber: 1, buildingId: 1 }, { unique: true });

export default mongoose.model('Parking', new mongoose.Schema(ParkingSchema));
