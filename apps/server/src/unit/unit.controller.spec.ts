import { Test, TestingModule } from '@nestjs/testing';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { CreateUnitDto } from './dto/create-unit.dto';
import { ObjectId } from 'mongodb';
import { HttpStatus } from '@nestjs/common';

const createUnitDto: CreateUnitDto = {
  unitNumber: 4,
  size: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

const unitServiceMock = {
  createUnit: jest.fn().mockResolvedValue(null),
  linkUnitToUser: jest.fn().mockResolvedValue(null),
  remove: jest.fn().mockResolvedValue(null),
  findAllBuildingUnits: jest.fn().mockResolvedValue(null),
  findAssociatedUnits: jest.fn().mockResolvedValue(null),
  makeNewPayment: jest.fn(),
  getUnitPayments: jest.fn(),
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

const unitInfoTestData = {
  buildingId: buildingInfoTestData2.id,
  unitNumber: 4,
  size: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

const unitInfoTestData2 = {
  id: new ObjectId(),
  buildingId: buildingInfoTestData2.id,
  unitNumber: 4,
  size: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

const userInfoTestData = {
  _id: new ObjectId(),
  password: 'test',
  email: 'user@example.com',
  name: 'Test User',
  role: 4,
  phoneNumber: '1234567890',
  imageUrl: 'https://example.com/image.jpg',
  imageId: 'image123',
};

const userInfoTestData2 = {
  _id: new ObjectId(),
  password: 'test',
  email: 'user@example.com',
  name: 'Test User',
  role: 3,
  phoneNumber: '1234567890',
  imageUrl: 'https://example.com/image.jpg',
  imageId: 'image123',
};

const paymentsTestData = {
  unitId: new ObjectId(),
  record: [
    {
      timeStamp: new Date(),
      amount: 100,
      monthBalance: 100,
      overdueFees: 0,
      previousMonthBalance: 0,
      previousOverdueFees: 0,
    },
  ],
};

describe('UnitController', () => {
  let controller: UnitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitController],
      providers: [
        {
          provide: UnitService,
          useValue: unitServiceMock,
        },
      ],
    }).compile();
    controller = module.get<UnitController>(UnitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should forward call to unit service', async () => {
      //Arrange
      unitServiceMock.createUnit.mockResolvedValue(unitInfoTestData);

      //Act
      const result = await controller.create(
        unitInfoTestData.buildingId.toString(),
        createUnitDto,
      );

      //Assert
      expect(result).toEqual(unitInfoTestData);
    });
  });

  describe('remove', () => {
    it('should forward call to unit service', async () => {
      //Arrange
      unitServiceMock.remove.mockResolvedValue(HttpStatus.NO_CONTENT);

      //Act
      const result = await controller.remove(unitInfoTestData2.id.toString());

      //Assert
      expect(result).toEqual(HttpStatus.NO_CONTENT);
    });
  });
  describe('findAll', () => {
    it('should forward call to unit service', async () => {
      //Arrange
      unitServiceMock.findAllBuildingUnits.mockResolvedValue([
        unitInfoTestData,
      ]);

      //Act
      const result = await controller.findAll(
        unitInfoTestData2.buildingId.toString(),
      );

      //Assert
      expect(result).toEqual([unitInfoTestData]);
    });
  });

  describe('findAssociatedUnits', () => {
    it('should forward call to unit service', async () => {
      //Arrange
      unitServiceMock.findAssociatedUnits.mockResolvedValue([unitInfoTestData]);

      //Act
      const result = await controller.findOwnerUnits(
        userInfoTestData._id.toString(),
      );

      //Assert
      expect(result).toEqual([unitInfoTestData]);
    });
  });
  describe('makeNewPayment', () => {
    it('should forward call to unit service', async () => {
      //Arrange
      unitServiceMock.makeNewPayment.mockResolvedValue(HttpStatus.NO_CONTENT);

      //Act
      const result = await controller.makeNewPayment('test-id', {
        amount: 100,
      });

      //Assert
      expect(result).toEqual(HttpStatus.NO_CONTENT);
    });
  });
  describe('getPayments', () => {
    it('should forward call to unit service', async () => {
      //Arrange
      unitServiceMock.getUnitPayments.mockResolvedValue(paymentsTestData);

      //Act
      const result = await controller.getPayments('test-id');

      //Assert
      expect(result?.record?.[0]?.amount).toBe(100);
    });
  });
});
