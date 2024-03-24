import mongoose, { Document } from 'mongoose';

export type FacilityAvailabilityStatus = 'available' | 'reserved';

export interface FacilityAvailabilityEntity extends Document {
  _id: mongoose.Types.ObjectId;
  facilityId: mongoose.Types.ObjectId | Record<string, unknown>;
  startDate: Date;
  endDate: Date;
  status: FacilityAvailabilityStatus;
}

interface FacilityAvailabilityModel
  extends mongoose.Model<FacilityAvailabilityEntity> {}

/**
 * The Mongoose schema for a facility availability.
 */
export const FacilityAvailabilitySchema = new mongoose.Schema<
  FacilityAvailabilityEntity,
  FacilityAvailabilityModel
>(
  {
    facilityId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Facility',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export default mongoose.model(
  'FacilityAvailability',
  new mongoose.Schema(FacilityAvailabilitySchema),
);
