import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPhoneNumber } from '../user.validators';
import { Validate } from 'class-validator';
import { CreateCompanyDto } from '../../company/dto/create-company.dto';

/**
 * Data transfer object for creating a manager.
 */
export class CreateManagerDto extends CreateCompanyDto {
  /**
   * The email of the manager.
   */
  @IsEmail()
  email: string;

  /**
   * The name of the manager.
   */
  @IsNotEmpty()
  name: string;

  /**
   * The phone number of the manager.
   */
  @Validate(IsValidPhoneNumber)
  @IsNotEmpty()
  phoneNumber: string;

  /**
   * The password of the manager.
   */
  @IsNotEmpty()
  password: string;
}
