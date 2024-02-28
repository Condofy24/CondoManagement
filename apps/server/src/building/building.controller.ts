import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { BuildingService } from './building.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { updateBuildingDto } from './dto/update-building.dto';

/**
 * Controller for managing building-related operations.
 */
@Controller('building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  /**
   * Create a new building.
   * @param companyId - The ID of the company.
   * @param createBuildingDto - The data for creating a building.
   * @param file - The uploaded file.
   * @returns The created building.
   */
  @Post(':companyId')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Param('companyId') companyId: string,
    @Body() createBuildingDto: CreateBuildingDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.buildingService.createBuilding(
      createBuildingDto,
      file,
      companyId,
    );
  }

  /**
   * Update an existing building.
   * @param buildingId - The ID of the building to update.
   * @param updateBuildingDto - The data for updating the building.
   * @param file - The uploaded file.
   * @returns The updated building.
   */
  @Patch('update/:buildingId')
  update(
    @Param('buildingId') buildingId: string,
    @Body() updateBuildingDto: updateBuildingDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.buildingService.updateBuilding(
      buildingId,
      updateBuildingDto,
      file,
    );
  }

  /**
   * Get all buildings for a company.
   * @param companyId - The ID of the company.
   * @returns An array of buildings.
   */
  @Get(':companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.buildingService.findAll(companyId);
  }
  /**
   * Get all properties for a building.
   * @param buildingId - The ID of the building.
   * @returns The building info and arrays of building's properties.
   */
  @Get('allProperties/:buildingId')
  findAllProperties(@Param('buildingId') buildingId: string) {
    return this.buildingService.findAllProperties(buildingId);
  }
}
