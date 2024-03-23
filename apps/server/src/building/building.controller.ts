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
import { UpdateBuildingDto } from './dto/update-building.dto';
import { PrivilegeGuard } from '../auth/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { BuildingModel } from './models/building.model';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFacilityDto } from './dto/create-facility.dto';

/**
 * Controller for managing building-related operations.
 */
@ApiBearerAuth()
@ApiTags('Building')
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
  @ApiCreatedResponse({ description: 'Building created', type: BuildingModel })
  async create(
    @Param('companyId') companyId: string,
    @Body() createBuildingDto: CreateBuildingDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return new BuildingModel(
      await this.buildingService.createBuilding(
        createBuildingDto,
        file,
        companyId,
      ),
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
  @Patch('update/:buildingId')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
  @ApiOkResponse({ description: 'Building updated', type: BuildingModel })
  async update(
    @Param('buildingId') buildingId: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return new BuildingModel(
      await this.buildingService.updateBuilding(
        buildingId,
        { ...updateBuildingDto },
        file,
      ),
    );
  }

  /**
   * Get all buildings for a company.
   * @param companyId - The ID of the company.
   * @returns An array of buildings.
   */
  @Get(':companyId')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
  @ApiOkResponse({
    description: 'All company buildings',
    type: [BuildingModel],
  })
  async findAll(@Param('companyId') companyId: string) {
    const buildingEntities = await this.buildingService.findAll(companyId);

    return buildingEntities.map((entity) => new BuildingModel(entity));
  }

  /**
   * Create facility for a building.
   * @param buildingId - The ID of the building.
   */
  @Get(':buildingId')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
  async createFacility(
    @Param('buildingId') buildingId: string,
    @Body() createFacilityDto: CreateFacilityDto,
  ) {
    this.buildingService.createFacility(buildingId, createFacilityDto);
  }
}
