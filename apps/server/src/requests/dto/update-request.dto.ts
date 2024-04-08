import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CreateRequestDto } from './create-request.dto';
import { PartialType } from '@nestjs/swagger';
import { RequestStatus } from '../entities/request.entity';

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsString()
  resolutionContent?: string;
}
