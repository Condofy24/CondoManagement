import * as mongoose from 'mongoose';

export interface IUnitPayment {
  timeStamp: Date;
  amount: number;
  monthBalance: number;
  overdueFees: number;
  previousMonthBalance: number;
  previousOverdueFees: number;
}

export interface PaymentsEntity extends Document {
  _id: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId | Record<string, unknown>;
  record: mongoose.Types.Array<IUnitPayment>;
}

interface PaymentsModel extends mongoose.Model<PaymentsEntity> {}

export const PaymentsSchema = new mongoose.Schema<
  PaymentsEntity,
  PaymentsModel
>({
  unitId: {
    type: mongoose.Types.ObjectId,
    ref: 'Unit',
    required: true,
  },
  record: { type: [], default: [] },
});

export default mongoose.model('Payments', new mongoose.Schema(PaymentsSchema));
