import { FacilityController } from './facility.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { FacilityService } from './facility.service';
import { ObjectId } from 'mongodb';
import { BuildingService } from '../building/building.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { WeekDay } from './entities/facilities.entity';

describe('FacilitiesController', () => {
  let facilityController: FacilityController;

  const jwtServiceMock = {
    signAsync: jest.fn(),
  };
  const userServiceMock = {
    findOne: jest.fn(),
  };

  const facilityServiceMock = {
    createFacility: jest.fn(),
    deleteFacility: jest.fn(),
    getFacilities: jest.fn(),
    viewAvailabilities: jest.fn(),
    makeReservation: jest.fn(),
    getReservations: jest.fn(),
    cancelReservation: jest.fn(),
  };

  const buildingServiceMock = {
    findBuildingById: jest.fn(),
  };

  const facilityInfoTestData = {
    id: new ObjectId(),
    buildingId: new ObjectId(),
    name: 'PEWPEWWW',
    price: 0,
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

  const createFacilityDto = {
    buildingId: new ObjectId(),
    name: 'PEWPEWWW',
    price: 0,
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
  const availabilityInfoTestData = [
    {
      id: new ObjectId(),
      facilityId: new ObjectId(),
      startDate: new Date(),
      endDate: new Date(),
      status: 'available',
    },
    {
      id: new ObjectId(),
      facilityId: new ObjectId(),
      startDate: new Date(),
      endDate: new Date(),
      status: 'available',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacilityController],
      providers: [
        {
          provide: FacilityService,
          useValue: facilityServiceMock,
        },
        { provide: BuildingService, useValue: buildingServiceMock },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    facilityController = module.get<FacilityController>(FacilityController);
  });

  it('should be defined', () => {
    expect(facilityController).toBeDefined();
  });

  describe('createFacility', () => {
    it('should forward call to facility service', async () => {
      // Arrange

      facilityServiceMock.createFacility.mockResolvedValue(
        facilityInfoTestData,
      );

      // Act
      const result = await facilityController.createFacility(
        new ObjectId().toString(),
        createFacilityDto,
      );

      //Assert
      expect(result).toEqual(facilityInfoTestData);
    });
  });

  describe('deleteFacility', () => {
    it('should forward call to facility service', async () => {
      // Arrange

      facilityServiceMock.deleteFacility.mockResolvedValue(
        facilityInfoTestData,
      );

      // Act
      const result = await facilityController.deleteFacility(
        new ObjectId().toString(),
      );

      //Assert
      expect(result).toEqual(facilityInfoTestData);
    });
  });

  describe('getFacilities', () => {
    it('should forward call to facility service', async () => {
      // Arrange

      facilityServiceMock.getFacilities.mockResolvedValue([
        facilityInfoTestData,
      ]);

      // Act
      const result = await facilityController.getFacilities(
        new ObjectId().toString(),
      );

      //Assert
      expect(result).toEqual([facilityInfoTestData]);
    });
  });
  describe('viewAvailabilities', () => {
    it('should return all availabilities for a given facility', async () => {
      // Arrange

      facilityServiceMock.viewAvailabilities.mockResolvedValue(
        availabilityInfoTestData,
      );

      // Act
      const result = await facilityController.viewAvailabilites(
        new ObjectId().toString(),
      );

      // Assert
      expect(result).toEqual(availabilityInfoTestData);
    });
  });
  describe('makeReservation', () => {
    it('should make a reservation and return the reservation details', async () => {
      // Arrange
      const availabilityId = new ObjectId().toString();
      const userId = new ObjectId().toString();
      const reservationTestData = {
        id: new ObjectId(),
        availabilityId: availabilityId,
        userId: userId,
        status: 'reserved',
      };

      facilityServiceMock.makeReservation.mockResolvedValue(
        reservationTestData,
      );

      // Act
      const result = await facilityController.makeReservation(
        availabilityId,
        userId,
      );

      // Assert
      expect(result).toEqual(reservationTestData);
    });
  });

  describe('getReservations', () => {
    it('should get all reservations for a user', async () => {
      // Arrange
      const userId = new ObjectId().toString();
      const reservationsTestData = [
        { id: new ObjectId(), userId: userId, status: 'reserved' },
        { id: new ObjectId(), userId: userId, status: 'reserved' },
      ];

      facilityServiceMock.getReservations.mockResolvedValue(
        reservationsTestData,
      );

      // Act
      const result = await facilityController.getReservations(userId);

      // Assert
      expect(result).toEqual(reservationsTestData);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation and return the updated reservation details', async () => {
      // Arrange
      const reservationId = new ObjectId().toString();
      const userId = new ObjectId().toString();
      const cancelledReservationTestData = {
        id: new ObjectId(reservationId),
        userId: userId,
        status: 'cancelled',
      };

      facilityServiceMock.cancelReservation.mockResolvedValue(
        cancelledReservationTestData,
      );

      // Act
      const result = await facilityController.cancelReservation(
        reservationId,
        userId,
      );

      // Assert
      expect(result).toEqual(cancelledReservationTestData);
    });
  });
});
