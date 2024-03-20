import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnitService } from '../unit/unit.service';
import { BuildingService } from '../building/building.service';
import { MongoServerError, ObjectId } from 'mongodb';
import { CreateParkingDto } from './dto/create-parking.dto';
import { ParkingService } from './parking.service';
import ParkingModel from './entities/parking.entity';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { HttpException } from '@nestjs/common';

const mockingoose = require('mockingoose');

const createParkingDto: CreateParkingDto = {
  parkingNumber: 4,
  fees: 4,
};

const updateParkingTest: UpdateParkingDto = {
  parkingNumber: 5,
  isOccupiedByRenter: false,
  fees: 70.5,
};

const updateParkingDtoTestData: UpdateParkingDto = {
  parkingNumber: 7,
  fees: 120,
  isOccupiedByRenter: false,
};

const buildingInfoTestData = {
  _id: new ObjectId(),
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
  _id: new ObjectId(),
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

const occupiedUnitInfoTestData = {
  _id: new ObjectId(),
  buildingId: buildingInfoTestData2._id,
  ownerId: new ObjectId(),
  renterId: new ObjectId(),
  unitNumber: 5,
  size: 4.5,
  isOccupiedByRenter: true,
  fees: 500,
};

const parkingInfoTestData = {
  _id: new ObjectId(),
  buildingId: buildingInfoTestData2._id,
  parkingNumber: 7,
  isOccupiedByRenter: false,
  fees: 10,
};

const parkingInfoTestData2 = {
  _id: new ObjectId(),
  buildingId: buildingInfoTestData2._id,
  parkingNumber: 7,
  isOccupied: false,
  fees: 10,
};

const mongoUniqueIndexException: MongoServerError = {
  addErrorLabel: (_) => {},
  hasErrorLabel: (_) => false,
  name: 'test',
  message: 'etst',
  errmsg: 'duplicate ID',
  errorLabels: [],
  code: 110000,
};

const buildingServiceMock = {
  findBuildingById: jest.fn().mockResolvedValue(buildingInfoTestData),
  updateBuilding: jest.fn().mockResolvedValue(buildingInfoTestData),
};

const unitServiceMock = {
  findUnitById: jest.fn().mockResolvedValue(occupiedUnitInfoTestData),
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
      buildingServiceMock.findBuildingById.mockResolvedValue({
        id,
        ...buildingInfoTestData,
      });

      //Act
      const result: any = await service.createParking(
        id.toString(),
        createParkingDto,
      );

      //Assert
      expect(buildingServiceMock.updateBuilding).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should throw an error if building does not exist', async () => {
      //Arrange
      mockingoose(ParkingModel).toReturn(null, 'findOne');
      const id = new ObjectId();
      buildingServiceMock.findBuildingById.mockResolvedValue(null);

      //Act and Assert
      await expect(
        service.createParking(id.toString(), createParkingDto),
      ).rejects.toThrow(HttpException);
    });
    it('should throw an error if parking number already exists', async () => {
      // Arrange
      const finderMock = (query: any) => {
        throw mongoUniqueIndexException;
      };

      mockingoose(ParkingModel).toReturn(finderMock, 'findOne'); // findById is findOne

      // Act and Assert
      await expect(
        service.createParking(
          parkingInfoTestData._id.toString(),
          createParkingDto,
        ),
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
      expect(result).toMatchObject(updateParkingTest);
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

  describe('findAllBuildingParkings', () => {
    it('should return all the parkings in a specific building given a valid buildingId', async () => {
      //Arrange
      const parkings = [parkingInfoTestData];
      mockingoose(ParkingModel).toReturn(parkings, 'find');
      const id = parkingInfoTestData.buildingId;

      //Act
      const result = await service.findAllBuildingParkings(id.toString());

      //Assert
      expect(result.length).toBe(parkings.length);
      expect(result[0]).toEqual(
        expect.objectContaining({ ...parkingInfoTestData }),
      );
    });
  });

  describe('linkParkingToUnit', () => {
    it('should link a specific parking to a specific user given valid informaiton', async () => {
      // Arrange
      mockingoose(ParkingModel)
        .toReturn(parkingInfoTestData, 'findOne')
        .toReturn(parkingInfoTestData, 'findOneAndUpdate');

      const unitId: ObjectId = new ObjectId();

      // Act
      await service.linkParkingToUnit(
        parkingInfoTestData2.buildingId.toString(),
        unitId.toString(),
      );
    });

    it('should throw an exception if user does not exist', async () => {
      //Arrange
      mockingoose(ParkingModel).toReturn([parkingInfoTestData], 'find');
      unitServiceMock.findUnitById.mockResolvedValue(null);
      const unitId: ObjectId = new ObjectId();
      //Act
      expect(
        service.linkParkingToUnit(
          parkingInfoTestData.buildingId.toString(),
          unitId.toString(),
        ),
      ).rejects.toThrow(HttpException);
    });
  });
  describe('remove', () => {
    it('should remove a parking given its corresponding id', async () => {
      mockingoose(ParkingModel).toReturn(
        parkingInfoTestData2,
        'findOneAndRemove',
      );

      buildingServiceMock.findBuildingById.mockResolvedValue(
        buildingInfoTestData,
      );

      //Act
      const parkingId = new ObjectId();
      const result = await service.remove(parkingId.toString());
    });
  });
});
