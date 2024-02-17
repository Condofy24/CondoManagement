import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { BuildingService } from './building.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingService) {}

  @Post(':companyId')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Param('companyId') companyId: string,
    @Body() createBuildingDto: CreateBuildingDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.buildingService.createBuilding(
      createBuildingDto,
      file,
      companyId,
    );
  }
}
