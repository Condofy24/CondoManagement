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
import { LinkStorageToUnitDto } from './dto/link-storage-to-unit.dto';
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

  @Patch('/update/link/:buildingId/:unitId')
  linkStorageToUnit(
    @Param('buildingId') buildingId: string,
    @Param('unitId') unitId: string,
    @Body() linkStorageToUnitDto: LinkStorageToUnitDto,
  ) {
    return this.storageService.linkStorageToUnit(
      buildingId,
      unitId,
      linkStorageToUnitDto,
    );
  }

  @Patch('update/:storageId')
  updateStorage(
    @Param('storageId') storageId: string,
    @Body() updateStorageDto: UpdateStorageDto,
  ) {
    return this.storageService.updateStorage(storageId, updateStorageDto);
  }

  @Get(':buildingId')
  findAll(@Param('buildingId') buildingId: string) {
    return this.storageService.findAll(buildingId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageService.remove(id);
  }

  @Get('unit/:unitId')
  findAllByUnitId(@Param('unitId') unitId: string) {
    return this.storageService.findByUnitId(unitId);
  }
}
