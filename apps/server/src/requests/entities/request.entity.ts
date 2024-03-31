import * as mongoose from 'mongoose';

export enum RequestStatus {
  SUBMITTED = 'Submitted',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
}

export enum RequestType {
  FINANCIAL = 'Financial issue',
  STAFF = 'Staff (general)',
  ADMIN = 'Admin',
}

export interface RequestEntity extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: RequestType;
  status: RequestStatus;
  resolutionContent?: string;
  resolutionTime?: Date;
  owner: mongoose.Schema.Types.ObjectId;
  unit: mongoose.Schema.Types.ObjectId;
  companyId:mongoose.Schema.Types.ObjectId;
}

interface RequestModel extends mongoose.Model<RequestEntity> {}

export const RequestSchema = new mongoose.Schema<RequestEntity, RequestModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(RequestType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      required: true,
    },
    resolutionContent: { type: String, required: false },
    resolutionTime: { type: Date, required: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const RequestModel = mongoose.model<Request>(
  'Request',
  new mongoose.Schema(RequestSchema),
);
