import { CreateUserDto } from './create-user.dto';

export type CreateEmployeeDto = Omit<CreateUserDto, 'password'>;
