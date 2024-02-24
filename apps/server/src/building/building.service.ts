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
import { updateBuildingDto } from './dto/update-building.dto';

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
    const building = await this.buildingModel.findOne({
      name,
      companyId: companyExists.id,
    });
    if (building) {
      if (building.companyId.equals(companyExists.id)) {
        throw new HttpException(
          {
            error: 'Building name already exists for the company',
            status: HttpStatus.BAD_REQUEST,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    //TODO: We should change address to an object instead of string and validate the attributes of the object
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
      companyId: companyExists.id,
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

  public async updateBuilding(
    buildingId: string,
    updateBuildingDto: updateBuildingDto,
    file?: Express.Multer.File,
  ) {
    const { name, address } = updateBuildingDto;
    const building = await this.buildingModel.findById(buildingId);
    if (!building) {
      throw new HttpException(
        { error: "Building doesn't exists", status: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    let fileResponse;
    let fileUrl = building.fileUrl;
    let fileAssetId = building.fileAssetId;
    let filePublicId = building.filePublicId;
    if (file) {
      fileResponse = await this.uploadFileToCloudinary(file);
      fileUrl = fileResponse.secure_url;
      filePublicId = fileResponse.public_id;
      fileAssetId = fileResponse.asset_id;
    }
    const result = await this.buildingModel.findByIdAndUpdate(buildingId, {
      name: name,
      address: address,
      fileUrl: fileUrl,
      filePublicId: filePublicId,
      fileAssetId: fileAssetId,
    }); // To return the updated document)
    console.log(result);
    if (result instanceof Error)
      return new HttpException(' ', HttpStatus.INTERNAL_SERVER_ERROR);
    return {
      name,
      address,
      fileUrl,
      filePublicId,
      fileAssetId,
    };
  }

  public async findOne(buildingId: string) {
    const building = await this.buildingModel.findById(buildingId);
    if (!building) {
      return null;
    }
    return {
      id: building.id,
      companyId: building.companyId,
      name: building.name,
      address: building.address,
      unitCount: building.unitCount,
      parkingCount: building.parkingCount,
      storageCount: building.storageCount,
      fileUrl: building.fileUrl,
      filePublicId: building.filePublicId,
      fileAssetId: building.fileAssetId,
    };
  }
  public async findAll(companyId: string): Promise<Building[]> {
    const buildings = await this.buildingModel.find({ companyId }).exec();
    return buildings.map(
      (building: Building) =>
        ({
          companyId: building.companyId,
          name: building.name,
          address: building.address,
          unitCount: building.unitCount,
          parkingCount: building.parkingCount,
          storageCount: building.storageCount,
          fileUrl: building.fileUrl,
          filePublicId: building.filePublicId,
          fileAssetId: building.fileAssetId,
        }) as Building,
    );
  }

  public async findByIdandUpdateUnitCount(
    buildingId: string,
    newUnitCount: number,
  ) {
    const building = await this.buildingModel.findByIdAndUpdate(
      buildingId,
      { unitCount: newUnitCount },
      { new: true },
    );
    if (!building) {
      return null;
    }
    return {
      id: building.id,
      companyId: building.companyId,
      name: building.name,
      address: building.address,
      unitCount: building.unitCount,
      parkingCount: building.parkingCount,
      storageCount: building.storageCount,
      fileUrl: building.fileUrl,
      filePublicId: building.filePublicId,
      fileAssetId: building.fileAssetId,
    };
  }
}
