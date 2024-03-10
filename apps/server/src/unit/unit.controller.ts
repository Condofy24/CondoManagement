import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UnitService } from './unit.service';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MakeNewPaymentDto } from './dto/make-new-payment.dto';
import { UnitModel } from './models/unit.model';

@ApiTags('Unit')
@ApiBearerAuth()
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
  async update(
    @Param('unitId') buildingId: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return new UnitModel(
      await this.unitService.updateUnit(buildingId, updateUnitDto),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitService.remove(id);
  }

  @Get(':buildingId')
  findAll(@Param('buildingId') buildingId: string) {
    return this.unitService.findAllBuildingUnits(buildingId);
  }

  @Get('/getUnit/:id')
  getUnit(@Param('id') id: string) {
    return this.unitService.findUnitById(id);
  }

  @Get('/findAssociatedUnits/:userId')
  findOwnerUnits(@Param('userId') userId: string) {
    return this.unitService.findAssociatedUnits(userId);
  }

  @Post('/makeNewPayment/:unitId')
  makeNewPayment(
    @Param('unitId') unitId: string,
    @Body() makeNewPaymentDto: MakeNewPaymentDto,
  ) {
    return this.unitService.makeNewPayment(unitId, makeNewPaymentDto);
  }

  @Get('/payments/:unitId')
  getPayments(@Param('unitId') unitId: string) {
    return this.unitService.getUnitPayments(unitId);
  }
}
