import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { StorageService } from './storage.service';

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

  @Get(':companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.storageService.findAll();
  }
}
