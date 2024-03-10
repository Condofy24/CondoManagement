import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for making a new payment.
 */
export class MakeNewPaymentDto {
  /**
   * The amount of the payment.
   */
  @ApiProperty()
  @IsNotEmpty()
  amount: number;
}
