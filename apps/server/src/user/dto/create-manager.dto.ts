import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsValidPhoneNumber } from '../user.validators';
import { Validate } from 'class-validator';
import { CreateCompanyDto } from '../../company/dto/create-company.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data transfer object for creating a manager.
 */
export class CreateManagerDto extends CreateCompanyDto {
  /**
   * The email of the manager.
   */
  @ApiProperty()
  @IsEmail()
  email: string;

  /**
   * The name of the manager.
   */
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  /**
   * The phone number of the manager.
   */
  @Validate(IsValidPhoneNumber)
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  /**
   * The password of the manager.
   */
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
