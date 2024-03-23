import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { PrivilegeGuard } from '../auth/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Controller for managing building-related operations.
 */
@ApiBearerAuth()
@ApiTags('Facility')
@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  /**
   * Create facility for a building.
   * @param buildingId - The ID of the building.
   */
  @Post(':buildingId')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
  async createFacility(
    @Param('buildingId') buildingId: string,
    @Body() createFacilityDto: CreateFacilityDto,
  ) {
    return await this.facilityService.createFacility(
      buildingId,
      createFacilityDto,
    );
  }

  /**
   * Delete a facility
   * @param facilityId - The ID of the facility.
   */
  @Delete(':facilityId')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
  async deleteFacility(@Param('facilityId') facilityId: string) {
    return await this.facilityService.deleteFacility(facilityId);
  }

  /**
   * Get all facilities for a building
   * @param buildingId - The ID of the building.
   */
  @Get(':buildingId')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
  async getFacilities(@Param('buildingId') buildingId: string) {
    return await this.facilityService.getFacilities(buildingId);
  }
}
