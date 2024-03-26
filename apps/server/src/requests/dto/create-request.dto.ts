import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum RequestType {
  FINANCIAL = 'Financial issue',
  STAFF = 'Staff (general)',
  ADMIN = 'Admin',
}
export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(RequestType)
  type: RequestType;
}
