import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { BuildingService } from './building.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { updateBuildingDto } from './dto/update-building.dto';
import { PrivilegeGuard } from '../auth/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

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
  @UseGuards(PrivilegeGuard)
  @Roles(0)
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
   * @param companyId - The ID of the company.
   * @param updateBuildingDto - The data for updating the building.
   * @param file - The uploaded file.
   * @returns The updated building.
   */
  @Patch('update/:companyId/:buildingId')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
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
  @Get(':id')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
  findAll(@Param('companyId') companyId: string) {
    return this.buildingService.findAll(companyId);
  }
  /**
   * Get all properties for a building.
   * @param buildingId - The ID of the building.
   * @param companyId - The ID of the company
   * @returns The building info and arrays of building's properties.
   */
  @Get('allProperties/:companyId/:buildingId')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
  findAllProperties(@Param('buildingId') buildingId: string) {
    return this.buildingService.findAllProperties(buildingId);
  }
}
