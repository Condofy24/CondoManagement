import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPhoneNumber, IsValidRole } from '../user.validators';
import { Validate } from 'class-validator';

/**
 * Data transfer object for creating an employee.
 */
export class CreateEmployeeDto {
  /**
   * The email of the employee.
   */
  @IsEmail()
  email: string;

  /**
   * The name of the employee.
   */
  @IsNotEmpty()
  name: string;

  /**
   * The role of the employee.
   */
  @Validate(IsValidRole)
  role: number;

  /**
   * The phone number of the employee.
   */
  @Validate(IsValidPhoneNumber)
  @IsNotEmpty()
  phoneNumber: string;

  /**
   * The ID of the company the employee belongs to.
   */
  @IsNotEmpty()
  companyId: string;
}
