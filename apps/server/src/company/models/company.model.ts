import { ApiProperty } from '@nestjs/swagger';
import { CompanyEntity } from '../entities/company.entity';

export class CompanyModel {
  name: string;

  @ApiProperty()
  location: string;

  constructor(entity: CompanyEntity) {
    this.name = entity.name;
    this.location = entity.location;
  }
}
