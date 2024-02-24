import { Body, Controller, Get, Param, Post, Patch, Delete } from '@nestjs/common';
import { CreateParkingDto } from './dto/create-parking.dto';
import { ParkingService } from './parking.service';
import { LinkParkingToUnitDto } from './dto/link-parking-to-unit.dtp';

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
     @Param('buildingId') buildingId:string,
     @Param('unitId') unitId:string,
     @Body() linkParkingToUnitDto:LinkParkingToUnitDto
   ){
     return this.parkingService.linkParkingToUnit(buildingId,unitId,linkParkingToUnitDto);
   }

   @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parkingService.removeParking(id);
  }

   @Get(':companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.parkingService.findAll();
  }
}
