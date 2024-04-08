import { Test, TestingModule } from '@nestjs/testing';
import { FacilityService } from './facility.service';
import FacilityModel, { WeekDay } from './entities/facilities.entity';
import FacilityAvailabilityModel from './entities/availability.entity';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';
import { BuildingService } from '../building/building.service';
import { ObjectId } from 'mongodb';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import ReservationModel from './entities/reservation.entity';
import { ReservationStatus } from './entities/reservation.entity';

describe('FacilityService', () => {
  let service: FacilityService;

  const mockingoose = require('mockingoose');

  const userServiceMock = {
    findOne: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
  };

  const buildingServiceMock = {
    findBuildingById: jest.fn(),
  };

  const createFacilityDto = {
    buildingId: new ObjectId(),
    name: 'PEWPEWWW',
    fees: 0,
    duration: 60,
    operationTimes: [
      { weekDay: WeekDay.Monday, openingTime: 480, closingTime: 0 },
      { weekDay: WeekDay.Tuesday, openingTime: 480, closingTime: 0 },
      { weekDay: WeekDay.Wednesday, openingTime: 480, closingTime: 0 },
      { weekDay: WeekDay.Thursday, openingTime: 480, closingTime: 0 },
      { weekDay: WeekDay.Friday, openingTime: 480, closingTime: 0 },
    ],
  };

  const findMockResponse = {
    id: new ObjectId('65ff57c1f2e0bc27cede0b61'),
    buildingId: new ObjectId('65ff57c1f2e0bc27cede0b62'),
    name: 'PEWPEWWW',
    fees: 0,
    duration: 60,
    operationTimes: [
      { weekDay: WeekDay.Monday, openingTime: 480, closingTime: 0 },
      { weekDay: WeekDay.Tuesday, openingTime: 480, closingTime: 0 },
      { weekDay: WeekDay.Wednesday, openingTime: 480, closingTime: 0 },
      { weekDay: WeekDay.Thursday, openingTime: 480, closingTime: 0 },
      { weekDay: WeekDay.Friday, openingTime: 480, closingTime: 0 },
      { weekDay: WeekDay.Saturday, openingTime: 480, closingTime: 0 },
      { weekDay: WeekDay.Sunday, openingTime: 480, closingTime: 0 },
    ],
  };
  const availabilityFindMockResponse = [
    {
      _id: new ObjectId('65ff57c1f2e0bc27cede0b63'),
      facilityId: new ObjectId('65ff57c1f2e0bc27cede0b61'),
      startDate: new Date('2024-04-01T08:00:00.000Z'),
      endDate: new Date('2024-04-01T10:00:00.000Z'),
      status: 'available',
    },
    {
      _id: new ObjectId('65ff57c1f2e0bc27cede0b64'),
      facilityId: new ObjectId('65ff57c1f2e0bc27cede0b61'),
      startDate: new Date('2024-04-02T08:00:00.000Z'),
      endDate: new Date('2024-04-02T10:00:00.000Z'),
      status: 'available',
    },
  ];

  const availabilityFindMockResponse2 = {
    _id: new ObjectId('65ff57c1f2e0bc27cede0b73'),
    facilityId: new ObjectId('65ff57c1f2e0bc27cede0b61'),
    startDate: new Date('2024-04-01T08:00:00.000Z'),
    endDate: new Date('2024-04-01T10:00:00.000Z'),
    status: 'available',
  };

  const availabilityFindMockResponse3 = {
    _id: new ObjectId('65ff57c1f2e0bc27cede0b73'),
    facilityId: new ObjectId('65ff57c1f2e0bc27cede0b61'),
    startDate: new Date('2024-04-01T08:00:00.000Z'),
    endDate: new Date('2024-04-01T10:00:00.000Z'),
    status: 'passed',
  };

  const reservationFindMockResponse = {
    id: new ObjectId('65ff57c1f2e0bc27cede0b63'),
    facilityId: new ObjectId('65ff57c1f2e0bc27cede0b91'),
    availabilityId: new ObjectId('65ff57c1f2e0bc27cede0b92'),
    userId: new ObjectId('65ff57c1f2e0bc27cede0b93'),
    status: ReservationStatus.ACTIVE,
  };
  const reservationFindMockResponse2 = {
    id: new ObjectId('65ff57c1f2e0bc27cede0b63'),
    facilityId: new ObjectId('65ff57c1f2e0bc27cede0b91'),
    availabilityId: new ObjectId('65ff57c1f2e0bc27cede0b92'),
    userId: new ObjectId('65ff57c1f2e0bc27cede0b93'),
    status: ReservationStatus.COMPLETE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacilityService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: getModelToken('Facility'),
          useValue: FacilityModel,
        },
        {
          provide: getModelToken('FacilityAvailability'),
          useValue: FacilityAvailabilityModel,
        },
        {
          provide: getModelToken('Reservation'),
          useValue: ReservationModel,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: BuildingService,
          useValue: buildingServiceMock,
        },
      ],
    }).compile();
    service = module.get<FacilityService>(FacilityService);
  });

  afterEach(() => {
    mockingoose(FacilityModel).reset();
    jest.clearAllMocks();
  });

  describe('createFacility', () => {
    it('should create a facility successfully if information is valid', async () => {
      //Arrange
      const id = new ObjectId();

      buildingServiceMock.findBuildingById.mockResolvedValue({ id: id });

      //Act
      const result: any = await service.createFacility(
        id.toString(),
        createFacilityDto,
      );

      //Assert
      expect(result).toBeDefined();
    });

    it('should throw exception if building is non-existent', async () => {
      //Arrange
      const id = new ObjectId();

      buildingServiceMock.findBuildingById.mockResolvedValue(undefined);

      //Assert
      await expect(
        service.createFacility(id.toString(), createFacilityDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteFacility', () => {
    it('delete facility successfully', async () => {
      //Arrange
      const id = new ObjectId();
      mockingoose(ReservationModel).toReturn(
        [reservationFindMockResponse],
        'find',
      );
      mockingoose(ReservationModel).toReturn(
        reservationFindMockResponse,
        'findOneAndUpdate',
      );
      mockingoose(FacilityAvailabilityModel).toReturn(
        availabilityFindMockResponse[0],
        'findOne',
      );
      mockingoose(FacilityAvailabilityModel).toReturn(
        availabilityFindMockResponse[0],
        'findOneAndUpdate',
      );

      //Assert
      await expect(
        service.deleteFacility(id.toString()),
      ).resolves.toBeUndefined();
    });
  });

  describe('getFacilities', () => {
    it('get all facilities successfully', async () => {
      //Arrange
      const id = new ObjectId('65ff57c1f2e0bc27cede0b61');
      mockingoose(FacilityModel).toReturn([findMockResponse], 'find');

      const response = await service.getFacilities(id.toString());

      //Assert
      await expect({
        ...response[0],
        id: new ObjectId('65ff57c1f2e0bc27cede0b61'),
        buildingId: new ObjectId('65ff57c1f2e0bc27cede0b62'),
      }).toMatchObject(findMockResponse);
    });
  });

  describe('availabilities creation', () => {
    it('create availabilities', async () => {
      //Arrange
      mockingoose(FacilityModel).toReturn([findMockResponse], 'find');

      const response = await service.generateAvailabilities();

      //Assert
      await expect(response).toBeUndefined();
    });
  });
  describe('viewAvailabilities', () => {
    it('should return all available slots for a specific facility', async () => {
      // Arrange
      const facilityId = new ObjectId('65ff57c1f2e0bc27cede0b61').toString();

      jest
        .spyOn(FacilityAvailabilityModel, 'find')
        .mockResolvedValue(availabilityFindMockResponse);

      // Act
      const response = await service.viewAvailabilities(facilityId);

      // Construct the expected structure of the response
      const expectedResponse = availabilityFindMockResponse.map((avail) => ({
        id: avail._id.toString(),
        facilityId: avail.facilityId.toString(),
        startDate: avail.startDate,
        endDate: avail.endDate,
        status: avail.status,
      }));

      // Assert

      expectedResponse.forEach((expectedAvail, index) => {
        const actualAvail = response[index];
        expect(actualAvail.id).toEqual(expectedAvail.id);
        expect(actualAvail.facilityId).toEqual(expectedAvail.facilityId);
        expect(actualAvail.startDate).toEqual(expectedAvail.startDate);
        expect(actualAvail.endDate).toEqual(expectedAvail.endDate);
        expect(actualAvail.status).toEqual(expectedAvail.status);
      });
    });
  });
  describe('create reservation', () => {
    it('should return all reservations under a given user id that is appropriate', async () => {
      //Arrange
      const availabilityId = new ObjectId('65ff57c1f2e0bc27cede0b63');
      const userId = new ObjectId();

      mockingoose(FacilityAvailabilityModel).toReturn(
        availabilityFindMockResponse[0],
        'findOne',
      );

      //Act
      const result: any = await service.makeReservation(
        availabilityId.toString(),
        userId.toString(),
      );

      //Assert
      expect(result).toBeDefined();
    });
    it("should throw an exception if availability doesn't exist", async () => {
      //Arrange
      const availabilityId = new ObjectId('65ff57c1f2e0bc27cede0b63');
      const userId = new ObjectId();

      mockingoose(FacilityAvailabilityModel).toReturn(undefined, 'findOne');

      //Act and Assert
      await expect(
        service.makeReservation(availabilityId.toString(), userId.toString()),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('get Reservations by user id', () => {
    it('should return all reservations under a given user id that is appropriate', async () => {
      //Arrange
      const userid = reservationFindMockResponse.id;

      mockingoose(ReservationModel).toReturn(
        [reservationFindMockResponse],
        'find',
      );

      //Act
      const result: any = await service.getReservations(userid.toString());

      //Assert
      expect(result).toBeDefined();
    });
  });
  describe('get Reservations by facility id', () => {
    it('should return all reservations under a given facility id that is appropriate', async () => {
      //Arrange
      const facilityId = reservationFindMockResponse.facilityId;

      mockingoose(ReservationModel).toReturn(
        [reservationFindMockResponse],
        'find',
      );

      //Act
      const result: any = await service.getFacilityReservations(
        facilityId.toString(),
      );

      //Assert
      expect(result).toBeDefined();
    });
  });
  describe('update reservation', () => {
    it('should update the reservation to the given status given an appropriate status and reservation id', async () => {
      //Arrange
      const reservationId = reservationFindMockResponse.id;

      mockingoose(ReservationModel).toReturn(
        reservationFindMockResponse,
        'findOneAndUpdate',
      );
      mockingoose(FacilityAvailabilityModel).toReturn(
        availabilityFindMockResponse[0],
        'findOne',
      );
      mockingoose(FacilityAvailabilityModel).toReturn(
        availabilityFindMockResponse[0],
        'findOneAndUpdate',
      );
      //Act
      const result: any = await service.updateReservationStatus(
        reservationId.toString(),
        { status: ReservationStatus.CANCELED },
      );

      //Assert
      expect(result).toBeDefined();
    });
    it('should throw an error if the status provided is ACTIVE', async () => {
      //Arrange
      const reservationId = reservationFindMockResponse.id;

      //Act and Assert
      expect(
        service.updateReservationStatus(reservationId.toString(), {
          status: ReservationStatus.ACTIVE,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('Handle expired reservations', () => {
    it('should update the availability to passed and the reservation to COMPLETE if its date and time have passed', async () => {
      // //Arrange
      const date = new Date();
      const availabilityId = availabilityFindMockResponse[0]._id;
      const reservationId = reservationFindMockResponse.id;

      mockingoose(FacilityAvailabilityModel).toReturn(
        [availabilityFindMockResponse2],
        'find',
      );
      mockingoose(FacilityAvailabilityModel).toReturn(
        availabilityFindMockResponse3,
        'findByIdAndUpdate',
      );
      mockingoose(ReservationModel).toReturn(
        [reservationFindMockResponse],
        'find',
      );
      mockingoose(ReservationModel).toReturn(
        reservationFindMockResponse2,
        'findByIdAndUpdate',
      );

      //Act
      const result = await service.handleCronReservations();

      //Assert
      expect(result).toBeUndefined();
    });
  });
});
