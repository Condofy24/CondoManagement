import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Building } from "./entities/building.entity";
import { Model } from "mongoose";
import { CreateBuildingDto } from "./dto/create-building.dto";
import { InjectModel } from "@nestjs/mongoose";
import { CloudinaryService } from "src/user/cloudinary/cloudinary.service";
//to download the files you can access Cloudinary's Admin API
@Injectable()
export class BuildingService {
    constructor(
        @InjectModel('Building')
        private readonly buildingModel: Model<Building>,
        private cloudinary: CloudinaryService,
    ) {}
    async uploadImageToCloudinary(file: Express.Multer.File) {
        try {
          const imageResponse = await this.cloudinary.uploadFile(file);
          return imageResponse;
        } catch (error) {
          console.error('Error uploading file to Cloudinary:', error);
          throw new BadRequestException('Failed to upload file to Cloudinary.');
        }
    }

    public async createBuilding(createBuildingDto :CreateBuildingDto, file: Express.Multer.File){
        const {name,address,unitCount,parkingCount,storageCount} = createBuildingDto;

        const building = await this.buildingModel.findOne({name});
        if(building){
            throw new HttpException(
                {error: 'Building already exists', status: HttpStatus.BAD_REQUEST},
                HttpStatus.BAD_REQUEST,
            );
        }
        const imageResponse = await this.uploadImageToCloudinary(file);
        let fileUrl = imageResponse.secure_url;
        let filePublicId = imageResponse.public_id;
        let fileAssetId = imageResponse.asset_id;
        const newBuilding = new this.buildingModel({
            name,
            address,
            unitCount,
            parkingCount,
            storageCount,
            fileUrl,
            filePublicId,
            fileAssetId
        });
        const result = await newBuilding.save();
        if (result instanceof Error)
            return new HttpException(' ', HttpStatus.INTERNAL_SERVER_ERROR);

        return {id:result._id,name,address,unitCount,parkingCount,storageCount,fileUrl,filePublicId,fileAssetId}
    }
}