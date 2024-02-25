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
import { LinkParkingToUnitDto } from './dto/link-parking-to-unit.dtp';
import { UpdateParkingDto } from './dto/update-parking.dto';

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

  @Patch('/update/link/:buildingId/:unitId')
  linkParkingToUnit(
    @Param('buildingId') buildingId: string,
    @Param('unitId') unitId: string,
    @Body() linkParkingToUnitDto: LinkParkingToUnitDto,
  ) {
    return this.parkingService.linkParkingToUnit(
      buildingId,
      unitId,
      linkParkingToUnitDto,
    );
  }

  @Patch('update/:parkingId')
  updateParking(
    @Param('parkingId') parkingId: string,
    @Body() updateParkingDto: UpdateParkingDto,
  ) {
    return this.parkingService.updateParking(parkingId, updateParkingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingService.removeParking(id);
  }

  @Get(':buildingId')
  findAll(@Param('buildingId') buildingId: string) {
    return this.parkingService.findAll(buildingId);
  }

  @Get('unit/:unitId')
  findAllByUnitId(@Param('unitId') unitId: string) {
    return this.parkingService.findByUnitId(unitId);
  }
}
