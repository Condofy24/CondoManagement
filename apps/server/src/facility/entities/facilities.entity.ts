import mongoose, { Document } from 'mongoose';

export interface FacilityEntity extends Document {
  _id: mongoose.Types.ObjectId;
  buildingId: mongoose.Types.ObjectId | Record<string, unknown>;
  name: string;
  fees: number;
  operationTimes: [];
  duration: number;
}

export enum WeekDay {
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6,
}

export interface OperationTimes {
  /**
   * Day of the week
   */
  weekDay: WeekDay;
  /**
   * Time in minutes from start of the day, e.g. 8am * 60min = 480
   */
  openingTime: number;
  /**
   * Time in minutes form start of the day, e.g. midnight = 0 * 60 = 0
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
    name: { type: String, required: true },
    fees: { type: Number, default: 0 },
    operationTimes: [],
    duration: { type: Number, required: true },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

export default mongoose.model('Facility', new mongoose.Schema(FacilitySchema));
