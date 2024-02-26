import { IsNotEmpty } from 'class-validator';

/**
 * Data transfer object for updating a building.
 */
export class updateBuildingDto {
  /**
   * The name of the building.
   */
  @IsNotEmpty()
  name: string;

  /**
   * The address of the building.
   */
  @IsNotEmpty()
  address: string;
}
