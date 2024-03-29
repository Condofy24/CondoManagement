import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { error } from 'console';

import { CreateFacilityDto } from '../facility/dto/create-facility.dto';
import {
  FacilityEntity,
  OperationTimes,
} from '../facility/entities/facilities.entity';
import { MongoServerError } from 'mongodb';
import { BuildingService } from '../building/building.service';
import { FacilityModel } from './models/facility.model';
import { FacilityAvailabilityEntity } from './entities/availability.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FacilityAvailabilityModel } from './models/availability.model';
import {
  ReservationEntity,
  ReservationStatus,
} from './entities/reservation.entity';
import { ReservationModel } from './models/reservation.model';

/**
 * Service class for managing buildings.
 */
@Injectable()
export class FacilityService {
  constructor(
    private readonly buildingService: BuildingService,
    @InjectModel('Facility')
    private readonly facilityModel: Model<FacilityEntity>,
    @InjectModel('FacilityAvailability')
    private readonly facilityAvailabilityModel: Model<FacilityAvailabilityEntity>,
    @InjectModel('Reservation')
    private readonly reservationModel: Model<ReservationEntity>,
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
      this.generateAvailabilities(entity._id.toString());
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

  async createAvailabilities(
    days: number,
    duration: number,
    operationTimes: OperationTimes[],
    facilityId: string,
  ) {
    try {
      const currentDate = new Date();

      for (let i = 0; i <= days; i++) {
        const dailyHours = operationTimes.find((day) => day.weekDay === i % 7);
        if (dailyHours) {
          const startingHours = dailyHours.openingTime / 60;
          let closingHours = dailyHours.closingTime / 60;

          if (closingHours < startingHours) {
            // Past Midnight - 12am
            closingHours += 24;
          }

          const numberBlocks = Math.floor(
            Math.abs(closingHours - startingHours) / (duration / 60),
          );

          for (let j = 0; j < numberBlocks; j++) {
            const startDate = new Date();
            startDate.setDate(currentDate.getDate() + i);
            startDate.setHours(startingHours + j * Math.floor(duration / 60));
            startDate.setMinutes(
              (startingHours - Math.floor(startingHours)) * 60,
            );
            startDate.setSeconds(0);

            const endDate = new Date();
            endDate.setDate(currentDate.getDate() + i);
            endDate.setHours(
              startingHours +
                j * Math.floor(duration / 60) +
                Math.floor(duration / 60),
            );
            endDate.setMinutes(
              (startingHours - Math.floor(startingHours)) * 60 +
                (startingHours - Math.floor(startingHours)) * 60,
            );
            endDate.setSeconds(0);

            const newFacilityAvail = new this.facilityAvailabilityModel({
              facilityId,
              endDate,
              startDate,
              status: 'available',
            });

            await newFacilityAvail.save();
          }
        }
      }
    } catch (e) {}
  }

  async generateAvailabilities(facilityId?: string) {
    if (facilityId) {
      try {
        const facility = await this.facilityModel.findById(facilityId);
        const operationTimes = facility?.operationTimes as OperationTimes[];
        const duration = facility?.duration;

        if (duration) {
          const date = new Date();
          const daysRemainingInMonth =
            new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() -
            date.getDate();

          await this.createAvailabilities(
            daysRemainingInMonth,
            duration,
            operationTimes,
            facilityId,
          );
        }
      } catch (e) {}
    } else {
      const facilities = await this.facilityModel.find(); // Get all facilities
      facilities.forEach(async ({ duration, operationTimes, id }) => {
        const date = new Date();
        await this.createAvailabilities(
          new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
          duration,
          operationTimes,
          id,
        );
      });
    }
  }

  async viewAvailabilities(facilityId: String) {
    try {
      const availabilities = await this.facilityAvailabilityModel.find({
        facilityId: facilityId,
        status: 'available',
      });
      return (
        availabilities?.map(
          (availability) => new FacilityAvailabilityModel(availability),
        ) || []
      );
    } catch (e) {
      throw new BadRequestException({
        message: "Facility's availabilities could not be fetched",
        error: e?.message,
      });
    }
  }

  /**
   * Make a reservation for an availability.
   * @param availabilityId - The ID of the availability
   * @param userId - The ID of the user
   */
  public async makeReservation(availabilityId: string, userId: string) {
    const availabilityExist =
      await this.facilityAvailabilityModel.findById(availabilityId); // Get Availability by Id

    if (!availabilityExist) {
      throw new BadRequestException({ message: 'Invalid availability Id' });
    }
    console.log("hereeeeeeeeeee")
    const newReservation = new this.reservationModel({
      facilityId: availabilityExist.facilityId,
      availabilityId: availabilityExist.id,
      userId: userId,
      status: ReservationStatus.ACTIVE,
    });
    try {
      const entity = await newReservation.save();
      await this.facilityAvailabilityModel.findByIdAndUpdate(availabilityId, {
        status: 'reserved',
      });
      return new ReservationModel(entity as ReservationEntity);
    } catch (e) {
      let errorDescription = 'Reservation could not be made';
      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'Reservation could not be made due to unique constraint violation';
      }

      throw new BadRequestException({
        message: errorDescription,
        error: e?.message,
      });
    }
  }
  public async getReservations(userId: string) {
    try {
      const reservations = await this.reservationModel.find({ userId });
      return (
        reservations?.map((reservation) => new ReservationModel(reservation)) ||
        []
      );
    } catch (e) {
      throw new BadRequestException({
        message: 'Reservations could not be fetched',
        error: e?.message,
      });
    }
  }
  // Do we need to diff methods to cancel reservation or one with two diff if according to the type of the user ?
  /**
   * Cancel a reservation by the user
   * @param reservationId - The ID of the availability
   * @param userId - The ID of the user
   */
  public async cancelReservation(reservationId: string, userId: string) {
    const reservationExist =
      await this.reservationModel.findById(reservationId); // Get reservation by Id

    if (!reservationExist) {
      throw new NotFoundException({ message: 'Reservation not found' });
    }
    if (reservationExist.userId.toString() != userId) {
      throw new BadRequestException({
        message: 'Must be the user who reserved to cancel the reservation',
      });
    }
    if (reservationExist.status != ReservationStatus.ACTIVE) {
      throw new BadRequestException({
        message: 'Must be active to cancel',
      });
    }
    const availabilityExist = await this.facilityAvailabilityModel.findById(
      reservationExist.availabilityId,
    );
    if (!availabilityExist) {
      throw new NotFoundException({ message: 'Availability not found' });
    }

    try {
      const reservation = await this.reservationModel.findByIdAndUpdate(
        reservationId,
        {
          status: ReservationStatus.CANCELED,
        },
        { new: true },
      );
      await this.facilityAvailabilityModel.findByIdAndUpdate(
        availabilityExist.id,
        {
          status: 'available',
        },
      );
      return new ReservationModel(reservation as ReservationEntity);
    } catch (e) {
      let errorDescription = 'Reservation could not be canceled';
      if (error instanceof MongoServerError && error.code === 11000) {
        errorDescription =
          'Reservation could not be canceled due to unique constraint violation';
      }

      throw new BadRequestException({
        message: errorDescription,
        error: e?.message,
      });
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  /**
   * Handles the cron job for generating 4 week availabilities
   * of all facilities.
   */
  async handleCron() {
    await this.generateAvailabilities();
  }
}
