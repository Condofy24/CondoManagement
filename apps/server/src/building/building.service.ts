import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Building } from './entities/building.entity';
import { Model } from 'mongoose';
import { CreateBuildingDto } from './dto/create-building.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from '../user/cloudinary/cloudinary.service';
import { Unit } from '../unit/entities/unit.entity';
import { CompanyService } from 'src/company/company.service';

//to download the files you can access Cloudinary's Admin API
@Injectable()
export class BuildingService {
  constructor(
    @InjectModel('Building')
    private readonly buildingModel: Model<Building>,
    private cloudinary: CloudinaryService,
    private companyService: CompanyService,
  ) {}
  async uploadFileToCloudinary(file: Express.Multer.File) {
    try {
      const fileResponse = await this.cloudinary.uploadFile(file);
      return fileResponse;
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      throw new BadRequestException('Failed to upload file to Cloudinary.');
    }
  }

  public async createBuilding(
    createBuildingDto: CreateBuildingDto,
    file: Express.Multer.File,
    companyId: string,
  ) {
    const { name, address, unitCount, parkingCount, storageCount } =
      createBuildingDto;
    const companyExists = await this.companyService.findByCompanyId(companyId);
    if (!companyExists) {
      throw new HttpException(
        { error: "Company doesn't exists", status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const building = await this.buildingModel.findOne({ name });
    if (building) {
      throw new HttpException(
        { error: 'Building already exists', status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    const addressInUse = await this.buildingModel.exists({ address: address });
    if (addressInUse?._id) {
      throw new HttpException(
        { error: 'Address already in use', status: HttpStatus.CONFLICT },
        HttpStatus.CONFLICT,
      );
    }
    const fileResponse = await this.uploadFileToCloudinary(file);
    let fileUrl = fileResponse.secure_url;
    let filePublicId = fileResponse.public_id;
    let fileAssetId = fileResponse.asset_id;
    const newBuilding = new this.buildingModel({
      companyId,
      name,
      address,
      unitCount,
      parkingCount,
      storageCount,
      fileUrl,
      filePublicId,
      fileAssetId,
    });
    const result = await newBuilding.save();
    if (result instanceof Error)
      return new HttpException(' ', HttpStatus.INTERNAL_SERVER_ERROR);

    return {
      companyId,
      name,
      address,
      unitCount,
      parkingCount,
      storageCount,
      fileUrl,
      filePublicId,
      fileAssetId,
    };
  }

  public async findOne(
    buildingId: string,
  ): Promise<Building | undefined | null> {
    return this.buildingModel.findOne({ _id: buildingId });
  }
}
