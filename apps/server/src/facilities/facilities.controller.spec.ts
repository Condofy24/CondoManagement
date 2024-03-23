import { FacilityController } from './facility.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { FacilityService } from './facility.service';
import { ObjectId } from 'mongodb';
import { FacilityModel } from './models/facility.model';
import { FacilityEntity } from './entities/facilities.entity';
import { BuildingService } from '../building/building.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

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
      { openingTime: 480, closingTime: 0 },
      { openingTime: 480, closingTime: 0 },
      { openingTime: 480, closingTime: 0 },
      { openingTime: 480, closingTime: 0 },
      { openingTime: 480, closingTime: 0 },
      { openingTime: 480, closingTime: 0 },
      { openingTime: 480, closingTime: 0 },
    ],
  };

  const createFacilityDto = {
    buildingId: new ObjectId(),
    name: 'PEWPEWWW',
    price: 0,
    duration: 60,
    operationTimes: [
      { openingTime: 480, closingTime: 0 },
      { openingTime: 480, closingTime: 0 },
      { openingTime: 480, closingTime: 0 },
      { openingTime: 480, closingTime: 0 },
      { openingTime: 480, closingTime: 0 },
      { openingTime: 480, closingTime: 0 },
      { openingTime: 480, closingTime: 0 },
    ],
  };

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
});
