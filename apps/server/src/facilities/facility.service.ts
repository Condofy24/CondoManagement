import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';

import { CreateFacilityDto } from '../facilities/dto/create-facility.dto';
import { FacilityEntity } from '../facilities/entities/facilities.entity';
import { MongoServerError } from 'mongodb';
import { BuildingService } from '../building/building.service';
import { FacilityModel } from './models/facility.model';

/**
 * Service class for managing buildings.
 */
@Injectable()
export class FacilityService {
  constructor(
    private readonly buildingService: BuildingService,
    @InjectModel('Facility')
    private readonly facilityModel: Model<FacilityEntity>,
  ) {}

  /**
   * Create a new facility for a building.
   * @param buildingId - The ID of the building
   */
  public async createFacility(
    buildingId: string,
    createFacilityDto: CreateFacilityDto,
  ) {
    const buildingExists =
      await this.buildingService.findBuildingById(buildingId);

    if (!buildingExists) {
      throw new BadRequestException({ message: 'Invalid building Id' });
    }

    const newFacility = new this.facilityModel({
      buildingId: buildingExists.id,
      ...createFacilityDto,
    });

    try {
      const entity = await newFacility.save();
      return new FacilityModel(entity as FacilityEntity);
    } catch (e) {
      let errorDescription = 'Facility could not be created';
      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'Facility could not be created due to unique constraint violation';
      }

      throw new BadRequestException({
        message: errorDescription,
        error: e?.message,
      });
    }
  }

  /**
   * Delete a facility
   * @param facilityId - The ID of the facility
   */
  public async deleteFacility(facilityId: string) {
    try {
      await this.facilityModel.findByIdAndDelete(facilityId);
    } catch (e) {
      throw new BadRequestException({
        message: 'Facility could not be deleted',
        error: e?.message,
      });
    }
  }

  public async getFacilities(buildingId: string) {
    try {
      const facilities = await this.facilityModel.find({ buildingId });
      return facilities?.map((facility) => new FacilityModel(facility)) || [];
    } catch (e) {
      throw new BadRequestException({
        message: 'Facilities could not be fetched',
        error: e?.message,
      });
    }
  }
}
