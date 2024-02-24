import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UnitService } from './unit.service';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { LinkUnitToBuidlingDto } from './dto/link-unit-to-building.dto';

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
  @Patch('/update/link/:buildingId/:userId')
  linkUnitToBuilding(
    @Param('buildingId') buildingId:string,
    @Param('userId') userId:string,
    @Body() linkUnitToBuildingDto:LinkUnitToBuidlingDto
  ){
    return this.unitService.linkUnitToBuilding(buildingId,userId,linkUnitToBuildingDto);
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
