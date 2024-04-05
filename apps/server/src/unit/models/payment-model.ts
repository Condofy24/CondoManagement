import { ApiProperty } from '@nestjs/swagger';
import { IUnitPayment } from '../entities/payments.entity';

export class PaymentModel {
  @ApiProperty()
  date: Date;

  @ApiProperty()
  amount: number;

  constructor(entity: IUnitPayment) {
    this.date = entity.timeStamp;
    this.amount = entity.amount;
  }
}
