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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateParkingDto } from './dto/update-parking.dto';

@ApiTags('Parking')
@ApiBearerAuth()
@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post(':buildingId')
  create(
    @Param('buildingId') buildingId: string,
    @Body() createParkingDto: CreateParkingDto,
  ) {
    return this.parkingService.createParking(buildingId, createParkingDto);
  }

  @Patch('/link/:unitId/:parkingId')
  linkParkingToUnit(
    @Param('unitId') unitId: string,
    @Param('parkingId') parkingId: string,
  ) {
    return this.parkingService.linkParkingToUnit(parkingId, unitId);
  }

  @Patch(':parkingId')
  updateParking(
    @Param('parkingId') parkingId: string,
    @Body() updateParkingDto: UpdateParkingDto,
  ) {
    return this.parkingService.updateParking(parkingId, {
      ...updateParkingDto,
    });
  }

  @Get('/building/:buildingId')
  findAll(@Param('buildingId') buildingId: string) {
    return this.parkingService.findAllBuildingParkings(buildingId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingService.remove(id);
  }

  @Get('/unit/:unitId')
  findAllByUnitId(@Param('unitId') unitId: string) {
    return this.parkingService.findParkingsByUnitId(unitId);
  }
}
