import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Building } from './entities/building.entity';
import { Model } from 'mongoose';
import { CreateBuildingDto } from './dto/create-building.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from '../user/cloudinary/cloudinary.service';
import { CompanyService } from '../company/company.service';
import { updateBuildingDto } from './dto/update-building.dto';
import { UnitService } from '../unit/unit.service';
import { StorageService } from '../storage/storage.service';
import { ParkingService } from '../parking/parking.service';
import { UserService } from '../user/user.service';
import { ObjectId } from 'mongodb';

/**
 * Service class for managing buildings.
 */
@Injectable()
export class BuildingService {
  constructor(
    @InjectModel('Building')
    private readonly buildingModel: Model<Building>,
    private cloudinary: CloudinaryService,
    private companyService: CompanyService,
    @Inject(forwardRef(() => UnitService))
    private unitService: UnitService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private storageService: StorageService,
    private parkingService: ParkingService,
  ) {}

  /**
   * Uploads a file to Cloudinary.
   * @param file - The file to upload.
   * @returns The response from Cloudinary.
   * @throws BadRequestException if the file upload fails.
   */
  async uploadFileToCloudinary(file: Express.Multer.File) {
    try {
      const fileResponse = await this.cloudinary.uploadFile(file);
      return fileResponse;
    } catch (error) {
      throw new BadRequestException('Failed to upload file to Cloudinary.');
    }
  }

  /**
   * Creates a new building.
   * @param createBuildingDto - The data for creating the building.
   * @param file - The file associated with the building.
   * @param companyId - The ID of the company the building belongs to.
   * @returns The created building.
   * @throws HttpException if the company doesn't exist or the building name is already taken.
   */
  public async createBuilding(
    createBuildingDto: CreateBuildingDto,
    file: Express.Multer.File,
    companyId: string,
  ) {
    const { name, address } = createBuildingDto;
    const companyExists = await this.companyService.findOne(companyId);
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
    const fileUrl = fileResponse.secure_url;
    const filePublicId = fileResponse.public_id;
    const fileAssetId = fileResponse.asset_id;
    const newBuilding = new this.buildingModel({
      companyId: companyExists.id,
      name,
      address,
      fileUrl,
      filePublicId,
      fileAssetId,
    });
    try {
      await newBuilding.save();
    } catch (e) {
      throw new HttpException(e?.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      companyId,
      name,
      address,
      fileUrl,
      filePublicId,
      fileAssetId,
    };
  }

  /**
   * Updates an existing building.
   * @param buildingId - The ID of the building to update.
   * @param updateBuildingDto - The data for updating the building.
   * @param file - The file associated with the building (optional).
   * @returns The updated building.
   * @throws HttpException if the building doesn't exist.
   */
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

  /**
   * Finds a building by ID.
   * @param buildingId - The ID of the building to find.
   * @returns The found building or null if not found.
   */
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

  /**
   * Finds all buildings belonging to a company.
   * @param companyId - The ID of the company.
   * @returns An array of buildings.
   */
  public async findAll(companyId: string): Promise<Building[]> {
    const buildings = await this.buildingModel
      .find({ companyId: new ObjectId(companyId) })
      .exec();
    return buildings.map((building) => ({
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
    }));
  }

  /**
   * Updates the unit count of a building.
   * @param buildingId - The ID of the building to update.
   * @param newUnitCount - The new unit count.
   * @returns The updated building or null if not found.
   */
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

  /**
   * Updates the parking count of a building.
   * @param buildingId - The ID of the building to update.
   * @param newParkingCount - The new parking count.
   * @returns The updated building or null if not found.
   */
  public async findByIdandUpdateParkingCount(
    buildingId: string,
    newParkingCount: number,
  ) {
    const building = await this.buildingModel.findByIdAndUpdate(
      buildingId,
      { parkingCount: newParkingCount },
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

  /**
   * Updates the storage count of a building.
   * @param buildingId - The ID of the building to update.
   * @param newStorageCount - The new storage count.
   * @returns The updated building or null if not found.
   */
  public async findByIdandUpdateStorageCount(
    buildingId: string,
    newStorageCount: number,
  ) {
    const building = await this.buildingModel.findByIdAndUpdate(
      buildingId,
      { storageCount: newStorageCount },
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
  /**
   * Get all properties for a building.
   * @param buildingId - The ID of the building.
   * @returns The building info and arrays of building's properties.
   */
  public async findAllProperties(buildingId: string) {
    const building = await this.findOne(buildingId);
    const units = await this.unitService.findAll(buildingId);
    const parkings = await this.parkingService.findAll(buildingId);
    const storages = await this.storageService.findAll(buildingId);
    return { building, units, parkings, storages };
  }
}
