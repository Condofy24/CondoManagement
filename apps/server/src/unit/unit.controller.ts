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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MakeNewPaymentDto } from './dto/make-new-payment.dto';
import { UnitModel } from './models/unit.model';

@ApiTags('Unit')
@ApiBearerAuth()
@Controller('unit')
/**
 * Controller class for managing units.
 */
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post(':buildingId')
  @ApiCreatedResponse({ description: 'Unit created', type: UnitModel })
  /**
   * Creates a new unit.
   *
   * @param buildingId - The ID of the building.
   * @param createUnitDto - The data for creating the unit.
   * @returns The created unit.
   */
  create(
    @Param('buildingId') buildingId: string,
    @Body() createUnitDto: CreateUnitDto,
  ) {
    return this.unitService.createUnit(buildingId, createUnitDto);
  }

  @Patch('update/:unitId')
  @ApiOkResponse({ description: 'Unit updated', type: UnitModel })
  /**
   * Updates a unit with the specified ID.
   * @param unitId - The ID of the unit to update.
   * @param updateUnitDto - The data to update the unit with.
   * @returns The updated unit.
   */
  async update(
    @Param('unitId') buildingId: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return new UnitModel(
      await this.unitService.updateUnit(buildingId, updateUnitDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Unit removed' })
  @ApiNotFoundResponse({ description: 'Unit not found' })
  /**
   * Removes a unit by its ID.
   * @param id The ID of the unit to remove.
   * @returns A promise that resolves to the removed unit.
   */
  async remove(@Param('id') id: string) {
    await this.unitService.remove(id);
  }

  @Get(':buildingId')
  /**
   * Retrieves all units for a given building.
   * @param buildingId - The ID of the building.
   * @returns An array of units belonging to the building.
   */
  async findBuildingUnits(@Param('buildingId') buildingId: string) {
    return await this.unitService.findAllBuildingUnits(buildingId);
  }

  @Get('/findAssociatedUnits/:userId')
  @ApiOkResponse({ description: 'Associated units', type: [UnitModel] })
  /**
   * Retrieves the units associated with a specific owner/tenant.
   *
   * @param userId - The ID of the owner.
   * @returns An array of units associated with the owner/tenant.
   */
  async findAssocitedUnits(@Param('userId') userId: string) {
    const entities = await this.unitService.findAssociatedUnits(userId);

    return entities.map((entity) => new UnitModel(entity));
  }

  @Post('/makeNewPayment/:unitId')
  /**
   * Makes a new payment for a unit.
   * @param unitId - The ID of the unit.
   * @param makeNewPaymentDto - The data for the new payment.
   * @returns The result of the new payment.
   */
  makeNewPayment(
    @Param('unitId') unitId: string,
    @Body() makeNewPaymentDto: MakeNewPaymentDto,
  ) {
    return this.unitService.makeNewPayment(unitId, makeNewPaymentDto);
  }

  @Get('/payments/:unitId')
  /**
   * Retrieves the payments for a specific unit.
   *
   * @param unitId - The ID of the unit.
   * @returns An array of payments for the unit.
   */
  getPayments(@Param('unitId') unitId: string) {
    return this.unitService.getUnitPayments(unitId);
  }
}
