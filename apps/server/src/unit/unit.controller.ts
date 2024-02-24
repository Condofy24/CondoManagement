import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UnitService } from './unit.service';
import { UpdateUnitDto } from './dto/update-unit.dto';

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
  @Patch('update/:unitId')
  update(
    @Param('unitId') buildingId: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return this.unitService.updateUnit(buildingId, updateUnitDto);
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
