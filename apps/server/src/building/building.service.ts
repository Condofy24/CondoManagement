import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateBuildingDto } from './dto/create-building.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CompanyService } from '../company/company.service';
import { MongoServerError, ObjectId } from 'mongodb';
import { error } from 'console';

import { BuildingEntity } from './entities/building.entity';
import { UnitService } from '../unit/unit.service';

/**
 * Service class for managing buildings.
 */
@Injectable()
export class BuildingService {
  constructor(
    @InjectModel('Building')
    private readonly buildingModel: Model<BuildingEntity>,
    private cloudinary: CloudinaryService,
    private companyService: CompanyService,
    @Inject(forwardRef(() => UnitService))
    private unitService: UnitService,
  ) {}

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
    if (!file)
      throw new BadRequestException({ message: 'Building file is required' });

    const { name, address } = createBuildingDto;

    const companyExists = await this.companyService.findCompanyById(companyId);

    if (!companyExists)
      throw new BadRequestException({ message: 'Invalid company Id' });

    const {
      secure_url: fileUrl,
      public_id: filePublicId,
      asset_id: fileAssetId,
    } = await this.cloudinary.uploadFile(file);

    const newBuilding = new this.buildingModel({
      companyId: companyExists.id,
      name,
      address,
      fileUrl,
      filePublicId,
      fileAssetId,
    });

    try {
      const entity = await newBuilding.save();

      return entity;
    } catch (e) {
      let errorDescription = 'Building could not be created';

      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'Building could not be created due to unique constraint violation';
      }

      throw new BadRequestException({
        message: errorDescription,
        error: e?.message,
      });
    }
  }

  /**
   * Updates an existing building.
   * @param buildingId - The ID of the building to update.
   * @param updateBuildingDto - The data for updating the building.
   * @param file - The file associated with the building (optional).
   * @returns The updated building.
   * @throws BadRequestException if the building doesn't exist.
   */
  public async updateBuilding(
    buildingId: string,
    updatedFields: Partial<BuildingEntity>,
    file?: Express.Multer.File,
  ): Promise<BuildingEntity> {
    const building = await this.buildingModel.findById(buildingId);

    if (!building)
      throw new BadRequestException({ message: "Building doesn't exists" });

    if (file) {
      const {
        secure_url: fileUrl,
        public_id: filePublicId,
        asset_id: fileAssetId,
      } = await this.cloudinary.uploadFile(file);

      updatedFields = {
        ...updatedFields,
        fileUrl,
        filePublicId,
        fileAssetId,
      };
    }

    try {
      const updatedEntity = await this.buildingModel.findByIdAndUpdate(
        new ObjectId(buildingId),
        {
          $set: updatedFields,
        },
      );

      return updatedEntity as BuildingEntity;
    } catch (error) {
      let errorDescription = 'Building could not be updated';

      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription = 'Building with the same name already exists';
      }

      throw new BadRequestException({
        message: errorDescription,
        error: error?.message,
      });
    }
  }

  /**
   * Finds a building by ID.
   * @param buildingId - The ID of the building to find.
   * @returns The found building or null if not found.
   */
  public async findBuildingById(buildingId: string) {
    return await this.buildingModel.findById(buildingId);
  }

  /**
   * Finds all buildings belonging to a company.
   * @param companyId - The ID of the company.
   * @returns An array of buildings.
   */
  public async findAll(companyId: string) {
    const buildings = await this.buildingModel
      .find({ companyId: new ObjectId(companyId) })
      .exec();

    return buildings;
  }
}
