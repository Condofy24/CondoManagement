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
    const validValues = Object.keys(UserRolesEnum).filter((item) => {
      return !isNaN(Number(item));
    });
    return validValues.includes(value);
  }
  defaultMessage() {
    return 'Not a valid role.';
  }
}

@ValidatorConstraint({ name: 'IsValidPhoneNumber', async: false })
export class IsValidPhoneNumber implements ValidatorConstraintInterface {
  validate(value: string, _args: ValidationArguments) {
 
    return !(!/^\d+$/.test(value) || value.length > 10 || value.length < 10);
  }
  defaultMessage() {
    return 'Not a valid phone number';
  }
}
