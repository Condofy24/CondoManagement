import { Document } from 'mongoose';

export interface CompanyDoc extends Document {
  companyName: string;
  companyLocation: string;
  companyId: string;
}
