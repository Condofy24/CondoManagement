import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { OperationTimes, WeekDay } from './entities/facilities.entity';

@ValidatorConstraint({ name: 'AreValidOperationTimes', async: true })
@Injectable()
export class AreValidOperationTimes implements ValidatorConstraintInterface {
  async validate(value: OperationTimes[]): Promise<boolean> {
    if (!Array.isArray(value)) return false;

    return value.every((item: OperationTimes) => {
      return (
        typeof item === 'object' &&
        Object.keys(item).length === 3 &&
        Object.values(WeekDay).includes(item.weekDay) &&
        typeof item.openingTime === 'number' &&
        typeof item.closingTime === 'number'
      );
    });
  }

  /**
   * Returns the default error message for invalid operating times.
   * @returns The default error message.
   */
  defaultMessage() {
    return 'Invalid operating times.';
  }
}
