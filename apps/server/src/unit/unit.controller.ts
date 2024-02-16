import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UnitService } from './unit.service';

@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitService.createUnit(createUnitDto);
  }
}
