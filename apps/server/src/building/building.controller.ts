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
import { updateBuildingDto } from './dto/update-building.dto';

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
  @Post('update/:buildingId')
  update(
    @Param('buildingId') buildingId:string,
    @Body() updateBuildingDto: updateBuildingDto,
    @UploadedFile() file:Express.Multer.File
    ){
      return this.buildingService.updateBuilding(
        buildingId,
        updateBuildingDto,
        file
      );
    }
  @Get(':companyId')
  findAll(@Param('companyId') companyId: string) {
    return this.buildingService.findAll(companyId);
  }
}
