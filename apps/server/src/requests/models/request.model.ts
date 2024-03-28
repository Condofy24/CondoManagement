import { ApiProperty } from '@nestjs/swagger';
import {
  RequestEntity,
  RequestStatus,
  RequestType,
} from '../entities/request.entity';

export class RequestModel {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: RequestType })
  type: RequestType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: RequestStatus })
  status: RequestStatus;

  @ApiProperty({ type: 'string', format: 'date-time' })
  resolutionTime?: Date;

  @ApiProperty()
  resolutionContent?: string;

  @ApiProperty()
  owner: string;
  unitId: any;

  constructor(entity: RequestEntity) {
    this.id = entity._id.toString();
    this.type = entity.type;
    this.title = entity.title;
    this.description = entity.description;
    this.status = entity.status;
    this.resolutionTime = entity.resolutionTime;
    this.resolutionContent = entity.resolutionContent;
    this.owner = entity.owner.toString();
    this.unitId = entity.unit.toString();
  }
}
