import mongoose, { Document } from 'mongoose';

export interface FacilityEntity extends Document {
  _id: mongoose.Types.ObjectId;
  buildingId: mongoose.Types.ObjectId | Record<string, unknown>;
  name: string;
  price: number;
  operationTimes: [{ type: mongoose.Schema.Types.ObjectId }];
  duration: number;
}

export interface OperationTimes {
  /**
   * Time in minutes from start of the day, e.g. 8am * 60min = 480
   */
  openingTime: number;
  /**
   * // Time in minutes form start of the day, e.g. midnight = 0 * 60 = 0
   */
  closingTime: number;
}

/**
 * Operation Times - Array of object {openingTime:number; closingTime:number}:
 * [
 *  { openingTime: 480 // Time in minutes from start of the day 8am * 60min = 480
 *    closingTime: 0 // Midnight, frontend will need to recognize that 0 comes after 480
 *  }
 * ]
 */

interface FacilityModel extends mongoose.Model<FacilityEntity> {}

/**
 * The Mongoose schema for a facility.
 */
export const FacilitySchema = new mongoose.Schema<
  FacilityEntity,
  FacilityModel
>(
  {
    buildingId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Building',
    },
    name: { type: String, unique: true, required: true },
    price: { type: Number, default: 0 },
    operationTimes: [],
    duration: { type: Number, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);
