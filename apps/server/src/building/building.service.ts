import { Injectable } from "@nestjs/common";
import { Building } from "./entities/building.entity";
import { Model } from "mongoose";
import { CreateBuildingDto } from "./dto/create-building.dto";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class BuildingService {

    getHello(): string {
        return 'Hello World!';
    }
}