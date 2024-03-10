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
export class ParkingService {
  constructor(
    @InjectModel('Parking')
    private readonly parkingModel: Model<ParkingEntity>,
    @Inject(forwardRef(() => UnitService))
    private readonly unitService: UnitService,
    @Inject(forwardRef(() => BuildingService))
    private readonly buildingService: BuildingService,
  ) {}

  public async createParking(
    buildingId: string,
    createParkingDto: CreateParkingDto,
  ) {
    const { parkingNumber, isOccupiedByRenter, fees } = createParkingDto;

    const building = await this.buildingService.findBuildingById(buildingId);

    if (!building) throw new BadRequestException('Invalid building Id');

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

      throw new BadRequestException(error?.message, errorDescription);
    }

    // update unit count of associted building
    this.buildingService.updateBuilding(buildingId, {
      parkingCount: building.parkingCount + 1,
    });

    return parkingEntity;
  }
  public async linkParkingToUnit(
    parkingId: string,
    unitId: string,
  ): Promise<void> {
    const unit = await this.unitService.findUnitById(unitId);
    if (!unit) throw new NotFoundException('Unit does not exist');

    const parking = await this.parkingModel.findById(parkingId).exec();

    if (!parking) throw new NotFoundException('Parking does not exist');
    if (parking.unitId)
      throw new BadRequestException('Parking is already linked to a unit');

    await this.parkingModel.findOneAndUpdate(
      { _id: new ObjectId(parkingId) },
      {
        unitId: unitId,
      },
    );
  }

  public async findParkingsByUnitId(unitId: string): Promise<ParkingEntity[]> {
    return this.parkingModel.find({ unitId }).exec();
  }

  public async findAllBuildingParkings(
    buildingId: string,
  ): Promise<ParkingEntity[]> {
    return await this.parkingModel.find({ buildingId }).exec();
  }

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

      if (!updatedParking) throw new NotFoundException('Parking not found');

      return updatedParking;
    } catch (error) {
      let errorDescription = 'Parking could not be updated';

      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'A parking with the same parking number already exists for this building.';
      }

      throw new BadRequestException(error?.message, errorDescription);
    }
  }

  public async remove(id: string): Promise<any> {
    const parking = await this.parkingModel
      .findOneAndRemove({ _id: id })
      .exec();

    if (!parking) throw new NotFoundException('Parking not found');

    const building = await this.buildingService.findBuildingById(
      parking.buildingId.toString(),
    );

    if (!building) return;

    await this.buildingService.updateBuilding(building._id.toString(), {
      parkingCount: building.parkingCount - 1,
    });
  }
}
