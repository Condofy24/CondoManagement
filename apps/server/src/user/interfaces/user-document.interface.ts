import { Document } from 'mongoose';

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
