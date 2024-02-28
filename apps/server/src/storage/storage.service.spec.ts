import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnitService } from '../unit/unit.service';
import { BuildingService } from '../building/building.service';
import { MongoServerError, ObjectId } from 'mongodb';
import { Building } from '../building/entities/building.entity';
import { CreateStorageDto } from './dto/create-storage.dto';
import { StorageService } from './storage.service';
import { Storage, StorageModel } from './entities/storage.entity';
import { Unit } from '../unit/entities/unit.entity';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { LinkStorageToUnitDto } from './dto/link-storage-to-unit.dto';
import { HttpException } from '@nestjs/common';

const mockingoose = require('mockingoose');

const createStorageDto: CreateStorageDto = {
  storageNumber: 4,
  isOccupied: false,
  fees: 4,
};

const updateStorageTest: UpdateStorageDto = {
  storageNumber: 5,
  isOccupied: false,
  fees: 70.5,
};

const updateStorageDtoTestData: UpdateStorageDto = {
  storageNumber: 7,
  fees: 120,
  isOccupied: false,
};

const linkStorageToUnitDto: LinkStorageToUnitDto = {
  storageNumber: 8,
};

const buildingInfoTestData: Building = {
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

const occupiedUnitInfoTestData: Unit = {
  buildingId: buildingInfoTestData2.id,
  ownerId: new ObjectId(),
  renterId: new ObjectId(),
  unitNumber: 5,
  size: 4.5,
  isOccupiedByRenter: true,
  fees: 500,
};

const storageInfoTestData: Storage = {
  buildingId: buildingInfoTestData2.id,
  storageNumber: 7,
  isOccupied: false,
  fees: 10,
};

const storageInfoTestData2: Storage = {
  buildingId: buildingInfoTestData2.id,
  storageNumber: 7,
  isOccupied: false,
  fees: 10,
};

const buildingServiceMock = {
  findOne: jest.fn().mockResolvedValue(buildingInfoTestData),
  findByIdandUpdateStorageCount: jest.fn().mockResolvedValue(null),
};

const unitServiceMock = {
  findOne: jest.fn().mockResolvedValue(occupiedUnitInfoTestData),
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
      buildingServiceMock.findOne.mockResolvedValue({
        id,
        ...buildingInfoTestData,
      });

      //Act
      const result: any = await service.createStorage(
        id.toString(),
        createStorageDto,
      );

      //Assert
      expect(
        buildingServiceMock.findByIdandUpdateStorageCount,
      ).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    it('should throw an error if building does not exist', async () => {
      //Arrange
      mockingoose(StorageModel).toReturn(null, 'findOne');
      const id = new ObjectId();
      buildingServiceMock.findOne.mockResolvedValue(null);

      //Act and Assert
      await expect(
        service.createStorage(id.toString(), createStorageDto),
      ).rejects.toThrow(HttpException);
    });
    it('should throw an error if Storage number already exists', async () => {
      // Arrange
      const id = new ObjectId();
      buildingServiceMock.findOne.mockResolvedValue({
        id,
        ...buildingInfoTestData,
      });
      mockingoose(StorageModel).toReturn(
        { ...storageInfoTestData, buildingId: id },
        'findOne',
      );

      // Act and Assert
      await expect(
        service.createStorage(id.toString(), createStorageDto),
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
      expect(result).toEqual({
        storageNumber: updateStorageDtoTestData.storageNumber,
        isOccupied: updateStorageDtoTestData.isOccupied,
        fees: updateStorageDtoTestData.fees,
      });
    });
    it('should throw an error if the Storage does not exsit', async () => {
      // Arrange
      const StorageId = new ObjectId();
      mockingoose(StorageModel).toReturn(null, 'findOne');

      await expect(
        service.updateStorage(StorageId.toString(), updateStorageDtoTestData),
      ).rejects.toThrow(HttpException);
    });
    //DO this after incase of not enough coverage
    it('should throw an error if the new Storage number is already taken', async () => {
      // Arrange
      const StorageId = new ObjectId();

      const mongoException: MongoServerError = {
        addErrorLabel: (_) => {},
        hasErrorLabel: (_) => false,
        name: 'test',
        message: 'etst',
        errmsg: 'duplicate ID',
        errorLabels: [],
        code: 110000,
      };

      mockingoose(StorageModel)
        .toReturn(storageInfoTestData, 'findOne')
        .toReturn(new Error(), 'findOneAndUpdate');

      // Act & Assert
      await expect(
        service.updateStorage(StorageId.toString(), updateStorageDtoTestData),
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
      const result = await service.findAll(id.toString());

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
      const result = await service.linkStorageToUnit(
        storageInfoTestData2.buildingId.toString(),
        unitId.toString(),
        linkStorageToUnitDto,
      );

      // Assert
      expect(result).toBeDefined();
    });

    it('should throw an exception if user does not exist', async () => {
      //Arrange
      mockingoose(StorageModel).toReturn([storageInfoTestData], 'find');
      unitServiceMock.findOne.mockResolvedValue(null);
      const unitId: ObjectId = new ObjectId();
      //Act
      expect(
        service.linkStorageToUnit(
          storageInfoTestData.buildingId.toString(),
          unitId.toString(),
          linkStorageToUnitDto,
        ),
      ).rejects.toThrow(HttpException);
    });
  });
});
