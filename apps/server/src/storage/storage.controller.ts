import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { StorageService } from './storage.service';
import { UpdateStorageDto } from './dto/update-storage.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StorageModel } from './models/storage.model';
import { StorageEntity } from './entities/storage.entity';

@ApiTags('Storage')
@ApiBearerAuth()
@Controller('storage')
/**
 * Controller class for managing storage operations.
 */
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post(':buildingId')
  @ApiCreatedResponse({ description: 'Storage created', type: StorageModel })
  /**
   * Creates a new storage.
   *
   * @param buildingId - The ID of the building.
   * @param createStorageDto - The data for creating the storage.
   * @returns The created storage.
   */
  async create(
    @Param('buildingId') buildingId: string,
    @Body() createStorageDto: CreateStorageDto,
  ) {
    return new StorageModel(
      await this.storageService.createStorage(buildingId, createStorageDto),
    );
  }

  @Patch('/link/:unitId/:storageId')
  @ApiCreatedResponse({ description: 'Storage linked to unit' })
  /**
   * Links a storage to a unit.
   *
   * @param unitId - The ID of the unit.
   * @param storageId - The ID of the storage.
   * @returns A promise that resolves to the result of linking the storage to the unit.
   */
  linkStorageToUnit(
    @Param('unitId') unitId: string,
    @Param('storageId') storageId: string,
  ) {
    return this.storageService.linkStorageToUnit(storageId, unitId);
  }

  @Patch(':storageId')
  @ApiCreatedResponse({ description: 'Storage updated', type: StorageModel })
  /**
   * Updates a storage.
   * @param storageId - The ID of the storage to update.
   * @param updateStorageDto - The data to update the storage with.
   * @returns The updated storage.
   */
  async updateStorage(
    @Param('storageId') storageId: string,
    @Body() updateStorageDto: UpdateStorageDto,
  ) {
    return new StorageModel(
      await this.storageService.updateStorage(storageId, {
        ...updateStorageDto,
      }),
    );
  }

  @Get('/building/:buildingId')
  @ApiOkResponse({ description: 'Storages found', type: [StorageModel] })
  /**
   * Retrieves all storages for a given building.
   *
   * @param buildingId - The ID of the building.
   * @returns An array of storages belonging to the building.
   */
  async findAll(@Param('buildingId') buildingId: string) {
    return (await this.storageService.findAllBuildingStorages(buildingId)).map(
      (storage: StorageEntity) => new StorageModel(storage),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Storage removed' })
  /**
   * Removes an item from the storage.
   * @param id - The ID of the item to be removed.
   * @returns A Promise that resolves to the removed item.
   */
  remove(@Param('id') id: string) {
    return this.storageService.remove(id);
  }

  @Get('/unit/:unitId')
  @ApiOkResponse({ description: 'Storages found', type: [StorageModel] })
  /**
   * Retrieves all storage items by unit ID.
   * @param unitId - The ID of the unit.
   * @returns An array of storage items.
   */
  async findAllByUnitId(@Param('unitId') unitId: string) {
    return (await this.storageService.findStoragesByUnitId(unitId)).map(
      (e) => new StorageModel(e),
    );
  }
}
