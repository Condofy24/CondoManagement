import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { StorageController } from './storage.controller';
import { Storage } from './entities/storage.entity';
import { LinkStorageToUnitDto } from './dto/link-storage-to-unit.dto';
import { StorageService } from './storage.service';
import { HttpStatus } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { create } from 'domain';

const createStorageDto: CreateStorageDto = {
  storageNumber: 4,
  isOccupied: false,
  fees: 4,
};

const storageServiceMock = {
  createStorage: jest.fn(),
  linkStorageToUnit: jest.fn(),
};

const linkStorageToUnitDto: LinkStorageToUnitDto = {
  storageNumber: 4,
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

const storageInfoTestData: Storage = {
  buildingId: buildingInfoTestData2.id,
  storageNumber: 4,
  isOccupied: false,
  fees: 4,
};

const storageInfoTestData2 = {
  id: new ObjectId(),
  buildingId: buildingInfoTestData2.id,
  storageNumber: 4,
  isOccupied: false,
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
    it('should forward call to Parking service', async () => {
      //Arrange
      storageServiceMock.createStorage.mockResolvedValue(storageInfoTestData);

      //Act
      const result = await controller.create(
        storageInfoTestData.buildingId.toString(),
        createStorageDto,
      );

      //Assert
      expect(result).toEqual(storageInfoTestData);
    });
  });
});
