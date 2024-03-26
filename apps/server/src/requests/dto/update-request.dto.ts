import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CreateRequestDto } from './create-request.dto';
import { PartialType } from '@nestjs/swagger';

enum RequestStatus {
  SUBMITTED = 'Submitted',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
}

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsString()
  resolutionContent?: string;
}
