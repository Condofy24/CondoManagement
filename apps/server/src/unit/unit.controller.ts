import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UnitService } from './unit.service';

@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post(':buildingId')
  create(
    @Param('buildingId') buildingId: string,
    @Body() createUnitDto: CreateUnitDto,
  ) {
    return this.unitService.createUnit(buildingId, createUnitDto);
  }
  @Get(':buildingId')
  findAll(@Param('buildingId') buildingId: string) {
    return this.unitService.findAll(buildingId);
  }
  @Get('/getUnit/:id')
  getUnit(@Param('id') id: string) {
    return this.unitService.findOne(id);
  }
}
