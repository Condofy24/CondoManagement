import { HttpException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoServerError, ObjectId } from 'mongodb';
import { BuildingService } from '../building/building.service';
import { UnitService } from '../unit/unit.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import StorageModel from './entities/storage.entity';
import { StorageService } from './storage.service';

const mockingoose = require('mockingoose');

const createStorageDto: CreateStorageDto = {
  storageNumber: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

const updateStorageTest: UpdateStorageDto = {
  storageNumber: 5,
  isOccupiedByRenter: false,
  fees: 70.5,
};

const updateStorageDtoTestData: UpdateStorageDto = {
  storageNumber: 7,
  fees: 120,
  isOccupiedByRenter: false,
};

const buildingInfoTestData = {
  _id: new ObjectId(),
  companyId: new ObjectId(),
  name: 'khaled',
  address: 'aslkdjfalk',
  unitCount: 56,
  storageCount: 53,
  parkingCount: 52,
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
  storageCount: 53,
  parkingCount: 52,
  fileUrl:
    'https://res.cloudinary.com/dzu5t20lr/image/upload/v1708240883/wfypsvm',
  filePublicId: 'wfypsvm4kykgjtxxolbn',
  fileAssetId: 'dc1dc5cbafbe598f40a9c1c8938e51c7',
};

const occupiedUnitInfoTestData = {
  buildingId: buildingInfoTestData2.id,
  ownerId: new ObjectId(),
  renterId: new ObjectId(),
  unitNumber: 5,
  size: 4.5,
  isOccupiedByRenter: true,
  fees: 500,
};

const storageInfoTestData = {
  _id: new ObjectId(),
  buildingId: buildingInfoTestData2.id,
  storageNumber: 7,
  isOccupiedByRenter: false,
  fees: 10,
};

const storageInfoTestData2 = {
  _id: new ObjectId(),
  buildingId: buildingInfoTestData2.id,
  storageNumber: 7,
  isOccupiedByRenter: false,
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

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: getModelToken('Storage'),
          useValue: StorageModel,
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
    service = module.get<StorageService>(StorageService);
  });
  afterEach(() => {
    mockingoose(StorageModel).reset();
    jest.clearAllMocks();
  });

  describe('createStorage', () => {
    it('should create a Storage successfully if information is valid', async () => {
      //Arrange
      mockingoose(StorageModel).toReturn(null, 'findOne');
      const id = new ObjectId();
      buildingServiceMock.findBuildingById.mockResolvedValue(
        buildingInfoTestData,
      );

      //Act
      const result: any = await service.createStorage(
        id.toString(),
        createStorageDto,
      );

      //Assert
      expect(buildingServiceMock.updateBuilding).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should throw an error if building does not exist', async () => {
      //Arrange
      mockingoose(StorageModel).toReturn(null, 'findOne');
      const id = new ObjectId();
      buildingServiceMock.findBuildingById.mockResolvedValue(null);

      //Act and Assert
      await expect(
        service.createStorage(id.toString(), createStorageDto),
      ).rejects.toThrow(HttpException);
    });
    it('should throw an error if Storage number already exists', async () => {
      // Arrange
      const finderMock = (query: any) => {
        throw mongoUniqueIndexException;
      };

      mockingoose(StorageModel).toReturn(finderMock, 'findOne'); // findById is findOne

      // Act and Assert
      await expect(
        service.createStorage(
          storageInfoTestData._id.toString(),
          createStorageDto,
        ),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateStorage', () => {
    it('should update Storage if valid fields are inputted', async () => {
      // Arrange
      const StorageId = new ObjectId();
      mockingoose(StorageModel).toReturn(storageInfoTestData, 'findOne');
      mockingoose(StorageModel).toReturn(updateStorageTest, 'findOneAndUpdate');

      // Act
      const result = await service.updateStorage(
        StorageId.toString(),
        updateStorageDtoTestData,
      );

      // Asssert
      expect(result).toMatchObject(updateStorageTest);
    });

    it('should throw an error if the Storage does not exsit', async () => {
      // Arrange
      const StorageId = new ObjectId();
      mockingoose(StorageModel).toReturn(null, 'findOne');

      await expect(
        service.updateStorage(StorageId.toString(), updateStorageDtoTestData),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an error if the new Storage number is already taken', async () => {
      // Arrange
      const finderMock = (query: any) => {
        throw mongoUniqueIndexException;
      };

      mockingoose(StorageModel).toReturn(finderMock, 'findOneAndUpdate'); // findById is findOne

      // Act & Assert
      await expect(
        service.updateStorage(
          storageInfoTestData._id.toString(),
          updateStorageDtoTestData,
        ),
      ).rejects.toThrow(HttpException);
    });
  });
  describe('findAll', () => {
    it('should return all the storages in a specific building given a valid buildingId', async () => {
      //Arrange
      const storages = [storageInfoTestData];
      mockingoose(StorageModel).toReturn(storages, 'find');
      const id = storageInfoTestData.buildingId;

      //Act
      const result = await service.findAllBuildingStorages(id.toString());

      //Assert
      expect(result.length).toBe(storages.length);
      expect(result[0]).toEqual(
        expect.objectContaining({ ...storageInfoTestData }),
      );
    });
  });

  describe('linkStorageToUnit', () => {
    it('should link a specific storage to a specific user given valid informaiton', async () => {
      // Arrange
      mockingoose(StorageModel)
        .toReturn(storageInfoTestData, 'findOne')
        .toReturn(storageInfoTestData, 'findOneAndUpdate');

      const unitId: ObjectId = new ObjectId();

      // Act
      await service.linkStorageToUnit(
        storageInfoTestData2._id.toString(),
        unitId.toString(),
      );
    });

    it('should throw an exception if user does not exist', async () => {
      //Arrange
      mockingoose(StorageModel).toReturn([storageInfoTestData], 'find');
      unitServiceMock.findUnitById.mockResolvedValue(null);
      const unitId: ObjectId = new ObjectId();
      //Act
      expect(
        service.linkStorageToUnit(
          storageInfoTestData2._id.toString(),
          unitId.toString(),
        ),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('remove', () => {
    it('should remove a Storage given its corresponding id', async () => {
      mockingoose(StorageModel).toReturn(
        storageInfoTestData2,
        'findOneAndRemove',
      );

      buildingServiceMock.findBuildingById.mockResolvedValue(
        buildingInfoTestData,
      );

      //Act
      const storageId = new ObjectId();
      await service.remove(storageId.toString());
    });

    it('should throw an error if storage id is invalid', async () => {
      // Arrange
      mockingoose(StorageModel).toReturn(null, 'findAndDelete');

      // Act & Assert
      await expect(
        service.remove(storageInfoTestData2._id.toString()),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
