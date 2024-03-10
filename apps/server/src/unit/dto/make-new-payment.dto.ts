import { IsNotEmpty } from 'class-validator';

export class MakeNewPaymentDto {
  @IsNotEmpty()
  amount: number;
}
