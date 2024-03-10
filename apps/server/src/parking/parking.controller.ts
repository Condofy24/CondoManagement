import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateParkingDto } from './dto/create-parking.dto';
import { ParkingService } from './parking.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { ParkingModel } from './models/parking.model';

@ApiTags('Parking')
@ApiBearerAuth()
@Controller('parking')
/**
 * Controller class for managing parking operations.
 */
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post(':buildingId')
  @ApiCreatedResponse({ description: 'Parking created', type: ParkingModel })
  /**
   * Creates a new parking.
   *
   * @param buildingId - The ID of the building.
   * @param createParkingDto - The data for creating the parking.
   * @returns The created parking.
   */
  async create(
    @Param('buildingId') buildingId: string,
    @Body() createParkingDto: CreateParkingDto,
  ) {
    return new ParkingModel(
      await this.parkingService.createParking(buildingId, createParkingDto),
    );
  }

  @Patch('/link/:unitId/:parkingId')
  @ApiOkResponse({ description: 'Parking linked to unit' })
  /**
   * Links a parking to a unit.
   *
   * @param unitId - The ID of the unit.
   * @param parkingId - The ID of the parking.
   * @returns A Promise that resolves to the result of linking the parking to the unit.
   */
  linkParkingToUnit(
    @Param('unitId') unitId: string,
    @Param('parkingId') parkingId: string,
  ) {
    return this.parkingService.linkParkingToUnit(parkingId, unitId);
  }

  @Patch(':parkingId')
  @ApiOkResponse({ description: 'Parking updated', type: ParkingModel })
  /**
   * Updates a parking entry.
   * @param parkingId - The ID of the parking entry to update.
   * @param updateParkingDto - The data to update the parking entry with.
   * @returns The updated parking entry.
   */
  async updateParking(
    @Param('parkingId') parkingId: string,
    @Body() updateParkingDto: UpdateParkingDto,
  ) {
    return new ParkingModel(
      await this.parkingService.updateParking(parkingId, {
        ...updateParkingDto,
      }),
    );
  }

  @Get('/building/:buildingId')
  @ApiOkResponse({ description: 'Parkings retrieved', type: [ParkingModel] })
  /**
   * Retrieves all parkings for a specific building.
   *
   * @param buildingId - The ID of the building.
   * @returns An array of parkings for the specified building.
   */
  async findAllBuildingParkings(@Param('buildingId') buildingId: string) {
    return (await this.parkingService.findAllBuildingParkings(buildingId)).map(
      (e) => new ParkingModel(e),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Parking removed' })
  @ApiNotFoundResponse({ description: 'Parking not found' })
  /**
   * Removes a parking entry by its ID.
   * @param id - The ID of the parking entry to be removed.
   * @returns A Promise that resolves to the removed parking entry.
   */
  remove(@Param('id') id: string) {
    return this.parkingService.remove(id);
  }

  @Get('/unit/:unitId')
  @ApiOkResponse({ description: 'Parkings retrieved', type: [ParkingModel] })
  /**
   * Retrieves all parkings by unit ID.
   * @param unitId - The ID of the unit.
   * @returns An array of parkings associated with the unit ID.
   */
  async findAllByUnitId(@Param('unitId') unitId: string) {
    return (await this.parkingService.findParkingsByUnitId(unitId)).map(
      (e) => new ParkingModel(e),
    );
  }
}
