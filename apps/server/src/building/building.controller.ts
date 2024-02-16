import { Body, Controller,Get,Post } from "@nestjs/common";
import { CreateBuildingDto } from "./dto/create-building.dto";
import { BuildingService } from "./building.service";

@Controller('building')
export class BuildingController {
    constructor(private readonly buildingService: BuildingService) {}

    @Post()
    create(@Body() createBuildingDto: CreateBuildingDto){
        return this.buildingService.createBuilding(createBuildingDto);
    }
}