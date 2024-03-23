import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';

import { CreateFacilityDto } from '../facilities/dto/create-facility.dto';
import { FacilityEntity } from '../facilities/entities/facilities.entity';
import { MongoServerError } from 'mongodb';
import { BuildingService } from 'src/building/building.service';

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
      return entity as FacilityEntity;
    } catch (e) {
      let errorDescription = 'Facility could not be created';
      console.log(e);
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
}
