import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { OperationTimes } from '../entities/facilities.entity';
import { AreValidOperationTimes } from '../validations';

/**
 * Data transfer object for creating a facility.
 */
export class CreateFacilityDto {
  /**
   * The name of the facility.
   */
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  /**
   * The price of the facility block.
   */
  @ApiProperty()
  price: number;

  /**
   * The operation times of the facility block.
   */
  @ApiProperty()
  @Validate(AreValidOperationTimes)
  operationTimes: OperationTimes[];

  /**
   * The duration of the facility block.
   */
  @IsNotEmpty()
  @ApiProperty()
  duration: number;
}
