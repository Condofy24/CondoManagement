import { Body, Controller,Get,Post } from "@nestjs/common";
import { CreateBuildingDto } from "./dto/create-building.dto";
import { BuildingService } from "./building.service";

@Controller('building')
export class BuildingController {
    constructor(private readonly buildingService: BuildingService) {}

    @Get()
    getHello(): string {
    return this.buildingService.getHello();
  }
}