import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { PrivilegeGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FacilityModel } from './models/facility.model';

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
    return new FacilityModel(
      await this.facilityService.createFacility(buildingId, createFacilityDto),
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
}
