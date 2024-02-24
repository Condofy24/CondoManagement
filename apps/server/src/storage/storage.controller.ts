import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { StorageService } from './storage.service';
import { LinkStorageToUnitDto } from './dto/link-storage-to-unit.dto';

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
     @Param('buildingId') buildingId:string,
     @Param('unitId') unitId:string,
     @Body() linkStorageToUnitDto:LinkStorageToUnitDto
   ){
     return this.storageService.linkStorageToUnit(buildingId,unitId,linkStorageToUnitDto);
   }

  @Get(':companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.storageService.findAll();
  }

   @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageService.remove(id);
  }
}
