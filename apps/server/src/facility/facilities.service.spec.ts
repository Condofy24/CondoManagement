import { Test, TestingModule } from '@nestjs/testing';
import { FacilityService } from './facility.service';
import FacilityModel, { WeekDay } from './entities/facilities.entity';
import FacilityAvailabilityModel from './entities/availability.entity';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from '../user/user.service';
import { BuildingService } from '../building/building.service';
import { ObjectId } from 'mongodb';
import { BadRequestException, HttpException } from '@nestjs/common';
import mongoose from 'mongoose';

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
    price: 0,
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

      //Assert
      await expect(
        service.deleteFacility(id.toString()),
      ).resolves.toBeUndefined(); // possible update needed
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
    it('should return available facilities for a specific facilityId', async () => {
      const facilityId = new mongoose.Types.ObjectId('62b5a2ac3e3ef320d4a7f3a1');
      const expectedAvailabilities = [
        {
          _id: new mongoose.Types.ObjectId('62b5a2ac3e3ef320d4a7f3b1'),
          facilityId: facilityId,
          startDate: new Date('2024-03-28T09:00:00Z'),
          endDate: new Date('2024-03-28T11:00:00Z'),
          status: 'available',
        },
        {
          _id: new mongoose.Types.ObjectId('62b5a2ac3e3ef320d4a7f3b2'),
          facilityId: facilityId,
          startDate: new Date('2024-03-29T12:00:00Z'),
          endDate: new Date('2024-03-29T14:00:00Z'),
          status: 'available',
        },
      ];

      jest.spyOn(FacilityAvailabilityModel, 'find').mockResolvedValue(expectedAvailabilities);

      const result = await service.viewAvailabilities(facilityId.toString());
      expect(result).toEqual(expectedAvailabilities);
      // expect(FacilityAvailabilityModel.find).toHaveBeenCalledWith({
      //   facilityId: facilityId,
      //   status: 'available',
      // });
    });
  });
});
