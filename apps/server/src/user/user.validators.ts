import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UserRolesEnum } from './user.model';
//This class is not working the methods are not called so it need to be checked again
@ValidatorConstraint({ name: 'IsValidRole', async: false })
export class IsValidRole implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    return Object.values(UserRolesEnum).includes(value);
  }
  defaultMessage() {
    return 'Not a valid role.';
  }
}

@ValidatorConstraint({ name: 'IsValidPhoneNumber', async: false })
export class IsValidPhoneNumber implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments) {
    // Check if the value is a number and its length is at least 10
    console.log('here2');
    if (!/^\d+$/.test(value) || value.length < 10) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return 'The phone number is invalid. It should be a numeric string of at least 10 characters.';
  }
}
