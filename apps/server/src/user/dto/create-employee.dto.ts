import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPhoneNumber, IsValidRole } from '../user.validators';
import { Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for creating an employee.
 */
export class CreateEmployeeDto {
  /**
   * The email of the employee.
   */
  @IsEmail()
  @ApiProperty()
  email: string;

  /**
   * The name of the employee.
   */
  @IsNotEmpty()
  name: string;

  /**
   * The role of the employee.
   */
  @ApiProperty()
  @Validate(IsValidRole)
  role: number;

  /**
   * The phone number of the employee.
   */
  @ApiProperty()
  @Validate(IsValidPhoneNumber)
  @IsNotEmpty()
  phoneNumber: string;

  /**
   * The ID of the company the employee belongs to.
   */
  @ApiProperty()
  @IsNotEmpty()
  companyId: string;
}
