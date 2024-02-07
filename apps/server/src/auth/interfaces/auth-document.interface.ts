import { Document } from 'mongoose';

export interface AuthDoc extends Document {
  id: string;
  email: string;
  password: string;
  role: number;
  phoneNumber: string;
  imageUrl: string;
  imageId: string;
}