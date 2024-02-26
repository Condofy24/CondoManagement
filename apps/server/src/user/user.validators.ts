import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UserRolesEnum } from './user.model';

/**
 * Custom validator constraint for checking if a user role is valid.
 */
//This class is not working the methods are not called so it need to be checked again
@ValidatorConstraint({ name: 'IsValidRole', async: false })
export class IsValidRole implements ValidatorConstraintInterface {
  /**
   * Validates if the given value is a valid role.
   * @param value - The value to be validated.
   * @param _args - Additional validation arguments.
   * @returns A boolean indicating if the value is a valid role.
   */
  validate(value: any, _args: ValidationArguments) {
    const validValues = Object.keys(UserRolesEnum).filter((item) => {
      return !isNaN(Number(item));
    });
    return validValues.includes(value);
  }

  /**
   * Returns the default error message for invalid roles.
   * @returns The default error message.
   */
  defaultMessage() {
    return 'Not a valid role.';
  }
}

/**
 * Custom validator constraint for checking if a phone number is valid.
 */
@ValidatorConstraint({ name: 'IsValidPhoneNumber', async: false })
export class IsValidPhoneNumber implements ValidatorConstraintInterface {
  /**
   * Validates if the given value is a valid phone number.
   * @param value - The value to be validated.
   * @param _args - Additional validation arguments.
   * @returns A boolean indicating if the value is a valid phone number.
   */
  validate(value: string, _args: ValidationArguments) {
    return !(!/^\d+$/.test(value) || value.length > 10 || value.length < 10);
  }

  /**
   * Returns the default error message for invalid phone numbers.
   * @returns The default error message.
   */
  defaultMessage() {
    return 'Not a valid phone number';
  }
}
