import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { HttpStatus } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { StorageModel } from './models/storage.model';
import { StorageEntity } from './entities/storage.entity';

const createStorageDto: CreateStorageDto = {
  storageNumber: 4,
  fees: 4,
};

const storageServiceMock = {
  createStorage: jest.fn(),
  linkStorageToUnit: jest.fn(),
  remove: jest.fn(),
  findAllBuildingStorages: jest.fn(),
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

const storageInfoTestData = {
  _id: new ObjectId(),
  buildingId: buildingInfoTestData2.id,
  storageNumber: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

const storageInfoTestData2 = {
  id: new ObjectId(),
  buildingId: buildingInfoTestData2.id,
  storageNumber: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

describe('StorageController', () => {
  let controller: StorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageController],
      providers: [
        {
          provide: StorageService,
          useValue: storageServiceMock,
        },
      ],
    }).compile();
    controller = module.get<StorageController>(StorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should forward call to Storage service', async () => {
      //Arrange
      storageServiceMock.createStorage.mockResolvedValue(storageInfoTestData);

      //Act
      const result = await controller.create(
        storageInfoTestData.buildingId.toString(),
        createStorageDto,
      );

      //Assert
      expect(result).toMatchObject(
        new StorageModel(storageInfoTestData as StorageEntity),
      );
    });
  });
  describe('linkStorageToUnit', () => {
    it('should forward call to Storage service', async () => {
      //Arrange
      storageServiceMock.linkStorageToUnit.mockResolvedValue(
        storageInfoTestData,
      );
      const unitId = new ObjectId();

      //Act
      await controller.linkStorageToUnit(
        unitId.toString(),
        storageInfoTestData._id.toString(),
      );
    });
  });

  describe('remove', () => {
    it('should forward call to Storage service', async () => {
      //Arrange
      storageServiceMock.remove.mockResolvedValue(HttpStatus.NO_CONTENT);

      //Act
      const result = await controller.remove(
        storageInfoTestData2.id.toString(),
      );

      //Assert
      expect(result).toEqual(HttpStatus.NO_CONTENT);
    });
  });
  describe('findAll', () => {
    it('should forward call to Storage service', async () => {
      //Arrange
      storageServiceMock.findAllBuildingStorages.mockResolvedValue([
        storageInfoTestData,
      ]);

      //Act
      const result = await controller.findAll(
        storageInfoTestData2.buildingId.toString(),
      );

      //Assert
      expect(result).toEqual([
        new StorageModel(storageInfoTestData as StorageEntity),
      ]);
    });
  });
});
