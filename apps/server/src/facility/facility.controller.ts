import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { PrivilegeGuard } from '../auth/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FacilityModel } from './models/facility.model';
import { FacilityAvailabilityModel } from './models/availability.model';
import { ReservationModel } from './models/reservation.model';

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
  @ApiCreatedResponse({ description: 'Facility created', type: FacilityModel })
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
   * View all availabilites under a given facility id
   * @param facilityId - The ID of the facility.
   * Role needs to be added
   */
  @Get('availability/:facilityId')
  // @UseGuards(PrivilegeGuard)
  // @Roles(0)
  @ApiCreatedResponse({
    description: 'All Availabilites viewed by facilityId',
    type: [FacilityAvailabilityModel],
  })
  async viewAvailabilites(@Param('facilityId') facilityId: string) {
    return await this.facilityService.viewAvailabilities(facilityId);
  }

  /**
   * Delete a facility
   * @param facilityId - The ID of the facility.
   */
  @Delete(':facilityId')
  @UseGuards(PrivilegeGuard)
  @Roles(0)
  @ApiCreatedResponse({ description: 'Facility deleted' })
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
  @ApiOkResponse({
    description: 'All facilities in a building',
    type: [FacilityModel],
  })
  async getFacilities(@Param('buildingId') buildingId: string) {
    return await this.facilityService.getFacilities(buildingId);
  }
  /**
   * Make a reservation for an availability.
   * @param availabilityId - The ID of the availability
   * @param userId - The ID of the user
   */
  @Post('reservation/:availabilityId/:userId')
  // @UseGuards(PrivilegeGuard)
  // @Roles(0)
  @ApiCreatedResponse({
    description: 'Reservation made',
    type: ReservationModel,
  })
  async makeReservation(
    @Param('availabilityId') availabilityId: string,
    @Param('userId') userId: string,
  ) {
    return await this.facilityService.makeReservation(availabilityId, userId);
  }
}
