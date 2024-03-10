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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Storage')
@ApiBearerAuth()
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post(':buildingId')
  create(
    @Param('buildingId') buildingId: string,
    @Body() createStorageDto: CreateStorageDto,
  ) {
    return this.storageService.createStorage(buildingId, createStorageDto);
  }

  @Patch('/link/:unitId/:storageId')
  linkStorageToUnit(
    @Param('unitId') unitId: string,
    @Param('storageId') storageId: string,
  ) {
    return this.storageService.linkStorageToUnit(storageId, unitId);
  }

  @Patch(':storageId')
  updateStorage(
    @Param('storageId') storageId: string,
    @Body() updateStorageDto: UpdateStorageDto,
  ) {
    return this.storageService.updateStorage(storageId, {
      ...updateStorageDto,
    });
  }

  @Get('/building/:buildingId')
  findAll(@Param('buildingId') buildingId: string) {
    return this.storageService.findAllBuildingStorages(buildingId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageService.remove(id);
  }

  @Get('/unit/:unitId')
  findAllByUnitId(@Param('unitId') unitId: string) {
    return this.storageService.findStorageByUnitId(unitId);
  }
}
