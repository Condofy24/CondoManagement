import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateParkingDto } from './dto/create-parking.dto';
import { ParkingService } from './parking.service';

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
}
