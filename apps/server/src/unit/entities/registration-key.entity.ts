import * as mongoose from 'mongoose';

export enum RegistrationRoles {
  OWNER = 0,
  RENTER = 1,
}

export type CondoRegistrationKeys = {
  ownerKey: string;
  renterKey: string;
};

export interface RegistrationKeyEntity extends Document {
  _id: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId | Record<string, unknown>;
  key: string;
  type: number;
  claimedBy: mongoose.Types.ObjectId | Record<string, unknown>;
}

interface RegistrationKeyModel extends mongoose.Model<RegistrationKeyEntity> {}

export const RegistrationKeySchema = new mongoose.Schema<
  RegistrationKeyEntity,
  RegistrationKeyModel
>(
  {
    unitId: {
      type: mongoose.Types.ObjectId,
      ref: 'Unit',
      required: true,
    },
    key: { type: String, required: true },
    type: { type: Number, required: true },
    claimedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
  },
  {
    timestamps: true, // This enables automatic createdAt and updatedAt fields
  },
);

/**
 * Represents the Registration Key model in the database.
 */
export default mongoose.model(
  'RegistrationKey',
  new mongoose.Schema(RegistrationKeySchema),
);
