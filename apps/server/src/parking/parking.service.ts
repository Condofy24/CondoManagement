import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ParkingEntity } from './entities/parking.entity';
import { Model } from 'mongoose';
import { CreateParkingDto } from './dto/create-parking.dto';
import { InjectModel } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';
import { UnitService } from '../unit/unit.service';
import { MongoServerError, ObjectId } from 'mongodb';

@Injectable()
/**
 * Service class for managing parking-related operations.
 */
export class ParkingService {
  constructor(
    @InjectModel('Parking')
    private readonly parkingModel: Model<ParkingEntity>,
    @Inject(forwardRef(() => UnitService))
    private readonly unitService: UnitService,
    @Inject(forwardRef(() => BuildingService))
    private readonly buildingService: BuildingService,
  ) {}

  /**
   * Creates a new parking space for a building.
   * @param buildingId - The ID of the building where the parking space will be created.
   * @param createParkingDto - The data required to create the parking space.
   * @returns The newly created parking entity.
   * @throws BadRequestException if the building ID is invalid or if a parking with the same storage parking already exists for the building.
   */
  public async createParking(
    buildingId: string,
    createParkingDto: CreateParkingDto,
  ) {
    const { parkingNumber, isOccupiedByRenter, fees } = createParkingDto;

    const building = await this.buildingService.findBuildingById(buildingId);

    if (!building)
      throw new BadRequestException({ message: 'Invalid building Id' });

    const newParking = new this.parkingModel({
      buildingId: buildingId,
      parkingNumber,
      isOccupiedByRenter,
      fees,
    });

    let parkingEntity;

    try {
      parkingEntity = await newParking.save();
    } catch (error) {
      let errorDescription = 'Parking could not be created';

      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'A parking with the same storage parking already exists for this building.';
      }

      throw new BadRequestException({
        error: error?.message,
        message: errorDescription,
      });
    }

    // update unit count of associted building
    this.buildingService.updateBuilding(buildingId, {
      parkingCount: building.parkingCount + 1,
    });

    return parkingEntity;
  }

  /**
   * Links a parking to a unit.
   *
   * @param parkingId - The ID of the parking.
   * @param unitId - The ID of the unit.
   * @throws {NotFoundException} If the unit or parking does not exist.
   * @throws {BadRequestException} If the parking is already linked to a unit.
   */
  public async linkParkingToUnit(
    parkingId: string,
    unitId: string,
  ): Promise<void> {
    const unit = await this.unitService.findUnitById(unitId);
    if (!unit) throw new NotFoundException({ message: 'Unit does not exist' });

    const parking = await this.parkingModel.findById(parkingId).exec();

    if (!parking)
      throw new NotFoundException({ message: 'Parking does not exist' });
    if (parking.unitId)
      throw new BadRequestException({
        message: 'Parking is already linked to a unit',
      });

    await this.parkingModel.findOneAndUpdate(
      { _id: new ObjectId(parkingId) },
      {
        unitId: unitId,
      },
    );
  }

  /**
   * Finds parkings by unit ID.
   * @param unitId - The ID of the unit.
   * @returns A promise that resolves to an array of ParkingEntity objects.
   */
  public async findParkingsByUnitId(unitId: string): Promise<ParkingEntity[]> {
    return this.parkingModel.find({ unitId }).exec();
  }

  /**
   * Retrieves all parkings for a specific building.
   * @param buildingId - The ID of the building.
   * @returns A promise that resolves to an array of ParkingEntity objects.
   */
  public async findAllBuildingParkings(
    buildingId: string,
  ): Promise<ParkingEntity[]> {
    return await this.parkingModel.find({ buildingId }).exec();
  }

  /**
   * Updates a parking entity with the specified ID.
   * @param parkingId - The ID of the parking entity to update.
   * @param updatedFields - The fields to update in the parking entity.
   * @returns The updated parking entity.
   * @throws NotFoundException if the parking entity with the specified ID is not found.
   * @throws BadRequestException if there is an error updating the parking entity.
   */
  public async updateParking(
    parkingId: string,
    updatedFields: Partial<ParkingEntity>,
  ) {
    try {
      const updatedParking = await this.parkingModel.findByIdAndUpdate(
        new ObjectId(parkingId),
        {
          $set: updatedFields,
        },
      );

      if (!updatedParking)
        throw new NotFoundException({ message: 'Parking not found' });

      return updatedParking;
    } catch (error) {
      let errorDescription = 'Parking could not be updated';

      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'A parking with the same parking number already exists for this building.';
      }

      throw new BadRequestException({
        error: error?.message,
        message: errorDescription,
      });
    }
  }

  /**
   * Removes a parking by its ID.
   * @param id - The ID of the parking to be removed.
   * @returns A Promise that resolves to the removed parking.
   * @throws NotFoundException if the parking is not found.
   */
  public async remove(id: string): Promise<void> {
    const parking = await this.parkingModel
      .findOneAndRemove({ _id: id })
      .exec();

    if (!parking) throw new NotFoundException({ message: 'Parking not found' });

    const building = await this.buildingService.findBuildingById(
      parking.buildingId.toString(),
    );

    if (!building) return;

    await this.buildingService.updateBuilding(building._id.toString(), {
      parkingCount: building.parkingCount - 1,
    });
  }
}
