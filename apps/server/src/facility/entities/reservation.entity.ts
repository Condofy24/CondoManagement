import mongoose, { Document } from 'mongoose';

export type ReservationStatus =
  | 'canceled'
  | 'active'
  | 'canceledByCompany'
  | 'complete';

export interface ReservationEntity extends Document {
  _id: mongoose.Types.ObjectId;
  facilityId: mongoose.Types.ObjectId | Record<string, unknown>;
  userId: mongoose.Types.ObjectId | Record<string, unknown>;
  status: ReservationStatus;
}

interface ReservationModel extends mongoose.Model<ReservationEntity> {}

/**
 * The Mongoose schema for a facility availability.
 */
export const ReservationSchema = new mongoose.Schema<
  ReservationEntity,
  ReservationModel
>(
  {
    facilityId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Facility',
    },
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: { type: String, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export default mongoose.model(
  'Reservation',
  new mongoose.Schema(ReservationSchema),
);
