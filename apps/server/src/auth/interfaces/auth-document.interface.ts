import { Document } from 'mongoose';

/**
 * Represents the authentication document interface.
 */
export interface AuthDoc extends Document {
  id: string;
  email: string;
  password: string;
  role: number;
  phoneNumber: string;
  imageUrl: string;
  imageId: string;
}
