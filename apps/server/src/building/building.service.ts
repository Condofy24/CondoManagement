import { Injectable } from "@nestjs/common";
import { Building } from "./entities/building.entity";
import { Model } from "mongoose";
import { CreateBuildingDto } from "./dto/create-building.dto";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class BuildingService {
    constructor(
        @InjectModel('Building')
        private readonly buildingModel: Model<Building>
    ) {}

    public async createBuilding(createBuildingDto :CreateBuildingDto){
        const {name,address,unitCount,parkingCount,storageCount,fileUrl} = createBuildingDto;
        const newBuilding = new this.buildingModel({
            name,
            address,
            unitCount,
            parkingCount,
            storageCount,
            fileUrl,
        });
        const result = await newBuilding.save();
        return result;
    }
}