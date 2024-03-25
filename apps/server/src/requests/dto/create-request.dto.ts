import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

enum RequestType {
  FINANCIAL = 'Financial issue',
  STAFF = 'Staff (general)',
  ADMIN = 'Admin',
}

enum RequestStatus {
  SUBMITTED = 'Submitted',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
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

  @IsEnum(RequestStatus)
  status: RequestStatus;
}
