import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for creating a building.
 */
export class CreateBuildingDto {
  /**
   * The name of the building.
   */
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  /**
   * The address of the building.
   */
  @IsNotEmpty()
  @ApiProperty()
  address: string;
}
