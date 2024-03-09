import { PartialType } from '@nestjs/swagger';
import { CreateBuildingDto } from './create-building.dto';

/**
 * Data transfer object for updating a building.
 */
export class UpdateBuildingDto extends PartialType(CreateBuildingDto) {}
