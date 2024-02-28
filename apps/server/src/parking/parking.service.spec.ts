import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnitService } from '../unit/unit.service';
import { BuildingService } from '../building/building.service';
import { MongoServerError, ObjectId } from 'mongodb';
import { Building } from '../building/entities/building.entity';
import { CreateParkingDto } from './dto/create-parking.dto';
import { ParkingService } from './parking.service';
import { Parking, ParkingModel } from './entities/parking.entity';
import { Unit } from '../unit/entities/unit.entity';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { LinkParkingToUnitDto } from './dto/link-parking-to-unit.dtp';
import { HttpException } from '@nestjs/common';

const mockingoose = require('mockingoose');

const createParkingDto: CreateParkingDto = {
  parkingNumber: 4,
  isOccupied: false,
  fees: 4,
};

const updateParkingTest: UpdateParkingDto = {
  parkingNumber: 5,
  isOccupied: false,
  fees: 70.5,
};

const updateParkingDtoTestData: UpdateParkingDto = {
  parkingNumber: 7,
  fees: 120,
  isOccupied: false,
};

const linkParkingToUnitDto: LinkParkingToUnitDto = {
  parkingNumber: 8,
};

const buildingInfoTestData: Building = {
  companyId: new ObjectId(),
  name: 'khaled',
  address: 'aslkdjfalk',
  unitCount: 56,
  parkingCount: 53,
  storageCount: 52,
  fileUrl:
    'https://res.cloudinary.com/dzu5t20lr/image/upload/v1708240883/wfypsvm',
  filePublicId: 'wfypsvm4kykgjtxxolbn',
  fileAssetId: 'dc1dc5cbafbe598f40a9c1c8938e51c7',
};

const buildingInfoTestData2 = {
  id: new ObjectId(),
  companyId: new ObjectId(),
  name: 'khaled',
  address: 'aslkdjfalk',
  unitCount: 56,
  parkingCount: 53,
  storageCount: 52,
  fileUrl:
    'https://res.cloudinary.com/dzu5t20lr/image/upload/v1708240883/wfypsvm',
  filePublicId: 'wfypsvm4kykgjtxxolbn',
  fileAssetId: 'dc1dc5cbafbe598f40a9c1c8938e51c7',
};

const occupiedUnitInfoTestData: Unit = {
  buildingId: buildingInfoTestData2.id,
  ownerId: new ObjectId(),
  renterId: new ObjectId(),
  unitNumber: 5,
  size: 4.5,
  isOccupiedByRenter: true,
  fees: 500,
};

const parkingInfoTestData: Parking = {
  buildingId: buildingInfoTestData2.id,
  parkingNumber: 7,
  isOccupied: false,
  fees: 10,
};

const parkingInfoTestData2: Parking = {
  buildingId: buildingInfoTestData2.id,
  parkingNumber: 7,
  isOccupied: false,
  fees: 10,
};

const buildingServiceMock = {
  findOne: jest.fn().mockResolvedValue(buildingInfoTestData),
  findByIdandUpdateParkingCount: jest.fn().mockResolvedValue(null),
};

const unitServiceMock = {
  findOne: jest.fn().mockResolvedValue(occupiedUnitInfoTestData),
};

describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingService,
        {
          provide: getModelToken('Parking'),
          useValue: ParkingModel,
        },
        {
          provide: BuildingService,
          useValue: buildingServiceMock,
        },
        {
          provide: UnitService,
          useValue: unitServiceMock,
        },
      ],
    }).compile();
    service = module.get<ParkingService>(ParkingService);
  });
  afterEach(() => {
    mockingoose(ParkingModel).reset();
    jest.clearAllMocks();
  });

  describe('createParking', () => {
    it('should create a Parking successfully if information is valid', async () => {
      //Arrange
      mockingoose(ParkingModel).toReturn(null, 'findOne');
      const id = new ObjectId();
      buildingServiceMock.findOne.mockResolvedValue({
        id,
        ...buildingInfoTestData,
      });

      //Act
      const result: any = await service.createParking(
        id.toString(),
        createParkingDto,
      );

      //Assert
      expect(
        buildingServiceMock.findByIdandUpdateParkingCount,
      ).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should throw an error if building does not exist', async () => {
      //Arrange
      mockingoose(ParkingModel).toReturn(null, 'findOne');
      const id = new ObjectId();
      buildingServiceMock.findOne.mockResolvedValue(null);

      //Act and Assert
      await expect(
        service.createParking(id.toString(), createParkingDto),
      ).rejects.toThrow(HttpException);
    });
    it('should throw an error if parking number already exists', async () => {
      // Arrange
      const id = new ObjectId();
      buildingServiceMock.findOne.mockResolvedValue({
        id,
        ...buildingInfoTestData,
      });
      mockingoose(ParkingModel).toReturn(
        { ...parkingInfoTestData, buildingId: id },
        'findOne',
      );

      // Act and Assert
      await expect(
        service.createParking(id.toString(), createParkingDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateParking', () => {
    it('should update parking if valid fields are inputted', async () => {
      // Arrange
      const parkingId = new ObjectId();
      mockingoose(ParkingModel).toReturn(parkingInfoTestData, 'findOne');
      mockingoose(ParkingModel).toReturn(updateParkingTest, 'findOneAndUpdate');

      // Act
      const result = await service.updateParking(
        parkingId.toString(),
        updateParkingDtoTestData,
      );

      // Asssert
      expect(result).toEqual({
        parkingNumber: updateParkingDtoTestData.parkingNumber,
        isOccupied: updateParkingDtoTestData.isOccupied,
        fees: updateParkingDtoTestData.fees,
      });
    });
    it('should throw an error if the parking does not exsit', async () => {
      // Arrange
      const parkingId = new ObjectId();
      mockingoose(ParkingModel).toReturn(null, 'findOne');

      await expect(
        service.updateParking(parkingId.toString(), updateParkingDtoTestData),
      ).rejects.toThrow(HttpException);
    });
    //DO this after incase of not enough coverage
    it('should throw an error if the new parking number is already taken', async () => {
      // Arrange
      const parkingId = new ObjectId();

      const mongoException: MongoServerError = {
        addErrorLabel: (_) => {},
        hasErrorLabel: (_) => false,
        name: 'test',
        message: 'etst',
        errmsg: 'duplicate ID',
        errorLabels: [],
        code: 110000,
      };

      mockingoose(ParkingModel)
        .toReturn(parkingInfoTestData, 'findOne')
        .toReturn(new Error(), 'findOneAndUpdate');

      // Act & Assert
      await expect(
        service.updateParking(parkingId.toString(), updateParkingDtoTestData),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return all the parkings in a specific building given a valid buildingId', async () => {
      //Arrange
      const parkings = [parkingInfoTestData];
      mockingoose(ParkingModel).toReturn(parkings, 'find');
      const id = parkingInfoTestData.buildingId;

      //Act
      const result = await service.findAll(id.toString());

      //Assert
      expect(result.length).toBe(parkings.length);
      expect(result[0]).toEqual(
        expect.objectContaining({ ...parkingInfoTestData }),
      );
    });
  });
});
