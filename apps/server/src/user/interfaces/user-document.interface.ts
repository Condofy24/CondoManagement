import { Document } from 'mongoose';

/**
 * Represents a user document in the database.
 */
export interface UserDoc extends Document {
  id: string;
  email: string;
  //password: string;
  name: string;
  role: number;
  phoneNumber: string;
  imageUrl: string;
  imageId: string;
  companyId?: string;
}
