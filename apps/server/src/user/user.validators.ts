import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UserRolesEnum } from './user.model';

@ValidatorConstraint({ name: 'IsValidRole', async: false })
export class IsValidRole implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    return Object.values(UserRolesEnum).includes(value);
  }
  defaultMessage() {
    return 'Not a valid role.';
  }
}
