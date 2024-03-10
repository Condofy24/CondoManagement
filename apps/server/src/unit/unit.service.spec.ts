import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnitService } from './unit.service';
import UnitModel, { UnitEntity } from './entities/unit.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import PaymentsModel from './entities/payments.entity';
import { BuildingService } from '../building/building.service';
import { UserService } from '../user/user.service';
import { ObjectId } from 'mongodb';
import { LinkUnitToBuidlingDto } from './dto/link-unit-to-building.dto';
import RegistationKeyModel from './entities/registration-key.entity';
import { ParkingService } from '../parking/parking.service';
import { Parking } from '../parking/entities/parking.entity';

const mockingoose = require('mockingoose');

const createUnitDto: CreateUnitDto = {
  unitNumber: 4,
  size: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

const linkUnitToBuildingDto: LinkUnitToBuidlingDto = {
  unitNumber: 4,
};

const buildingInfoTestData = {
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

const unitInfoTestData: Partial<UnitEntity> = {
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

const unitInfoTestData3 = {
  id: new ObjectId('65ed1de804bd4c731c3456c3'),
  ownerId: new ObjectId(),
  buildingId: buildingInfoTestData2.id,
  unitNumber: 4,
  size: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

const inDebtedUnitInfoTestData = {
  id: new ObjectId('65ed1de804bd4c731c3456c3'),
  ownerId: new ObjectId(),
  buildingId: buildingInfoTestData2.id,
  unitNumber: 4,
  size: 4,
  isOccupiedByRenter: false,
  fees: 4,
  monthlyFeesBalance: 100,
  overdueFees: 300,
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
  id: 'test',
  password: 'test',
  email: 'user@example.com',
  name: 'Test User',
  role: 3,
  phoneNumber: '1234567890',
  imageUrl: 'https://example.com/image.jpg',
  imageId: 'image123',
};

const parkingInfoTestData: Parking = {
  buildingId: new ObjectId(),
  unitId: unitInfoTestData._id,
  parkingNumber: 7,
  isOccupied: false,
  fees: 10,
};

const paymentsTestData = {
  unitId: new ObjectId(unitInfoTestData._id),
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

const buildingServiceMock = {
  findOne: jest.fn().mockResolvedValue(buildingInfoTestData),
  findByIdandUpdateUnitCount: jest.fn().mockResolvedValue(null),
  updateBuilding: jest.fn().mockResolvedValue(buildingInfoTestData),
};

const parkingServiceMock = {
  findByUnitId: jest.fn().mockResolvedValue([parkingInfoTestData]),
};

const userServiceMock = {
  findUserById: jest.fn().mockResolvedValue(userInfoTestData),
};

describe('UnitService', () => {
  let service: UnitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitService,
        {
          provide: getModelToken('Unit'),
          useValue: UnitModel,
        },
        {
          provide: getModelToken('Payments'),
          useValue: PaymentsModel,
        },
        {
          provide: getModelToken('RegistrationKey'),
          useValue: RegistationKeyModel,
        },
        { provide: ParkingService, useValue: parkingServiceMock },
        {
          provide: BuildingService,
          useValue: buildingServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();
    service = module.get<UnitService>(UnitService);
  });

  afterEach(() => {
    mockingoose(UnitModel).reset();
    jest.clearAllMocks();
  });

  describe('createUnit', () => {
    it('should create a unit successfully if information is valid', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn(null, 'findOne');
      const id = new ObjectId();
      buildingServiceMock.findOne.mockResolvedValue({
        _id: id,
        ...buildingInfoTestData,
      });

      //Act
      const result: any = await service.createUnit(
        id.toString(),
        createUnitDto,
      );

      //Assert
      expect(result).toBeDefined();
    });
    it('should throw an error if building does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn(null, 'findOne');
      const id = new ObjectId();
      buildingServiceMock.findOne.mockResolvedValue(null);

      //Act and Assert
      await expect(
        service.createUnit(id.toString(), createUnitDto),
      ).rejects.toThrow(HttpException);
    });
    it('should throw an error if unit already exists', async () => {
      //Arrange
      const id = unitInfoTestData.buildingId as ObjectId;
      buildingServiceMock.findOne.mockResolvedValue({
        id,
        ...buildingInfoTestData,
      });
      mockingoose(UnitModel).toReturn({ id, ...unitInfoTestData }, 'findOne');

      //Act and Assert
      await expect(
        service.createUnit(id.toString(), createUnitDto),
      ).rejects.toThrow(HttpException);
    });
  });
  describe('findAll', () => {
    it('should return all the units in a specific building given a valid buildingId', async () => {
      //Arrange
      const units = [unitInfoTestData];
      mockingoose(UnitModel).toReturn(units, 'find');
      const id = unitInfoTestData.buildingId as ObjectId;

      //Act
      const result = await service.findAll(id.toString());

      //Assert
      expect(result.length).toBe(units.length);
      expect(result[0]).toEqual(
        expect.objectContaining({ ...unitInfoTestData }),
      );
    });
  });
  describe('findOne', () => {
    it('should return a unit given its corresponding id', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn({ _id: 'test' }, 'findOne');

      //Act
      await service.findOne('test');

      //Arrange
      await expect(service.findOne('test')).resolves.toBeDefined();
    });
    it('should throw an exception when an invalid unit id is given', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn(null, 'findOne');

      //Act
      expect(service.findOne('test')).rejects.toThrow(HttpException);
    });
  });
  describe('remove', () => {
    it('remove a unit given its corresponding id', async () => {
      //Arrange

      mockingoose(UnitModel).toReturn(unitInfoTestData2, 'findOne');
      const buildingId = unitInfoTestData2.buildingId.toString();
      buildingServiceMock.findOne.mockResolvedValue({
        buildingId,
        ...buildingInfoTestData,
      });

      //Act

      const result = await service.remove(unitInfoTestData2.id.toString());
      //Assert
      expect(result).toBeDefined();
    });
    it('should throw an exception given an incorrect unit id', async () => {
      //     //Arrange
      const unitId = new ObjectId();
      const id = unitInfoTestData.buildingId;
      const unit = {
        id,
        ...unitInfoTestData,
      };

      mockingoose(UnitModel).toReturn({ _id: 'test' }, 'findById');

      //Act
      expect(service.remove('test')).rejects.toThrow(HttpException);

      //Assert
    });
    it('should throw an exception if building does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn(unitInfoTestData2, 'findOne');
      const buildingId = unitInfoTestData2.buildingId.toString();
      buildingServiceMock.findOne.mockResolvedValue(null);

      //Act
      expect(service.remove('test')).rejects.toThrow(HttpException);
    });
  });
  describe('linkUnitToUser', () => {
    it('should link a specific unit to a specific user given valid informaiton', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn([unitInfoTestData2], 'find');

      //Act
      const result = await service.linkUnitToUser(
        unitInfoTestData2.buildingId.toString(),
        userInfoTestData._id.toString(),
        linkUnitToBuildingDto,
      );

      //Assert
      expect(result).toBeDefined();
    });
    it('should throw an exception if unit does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn([], 'find');

      //Act
      expect(
        service.linkUnitToUser(
          (unitInfoTestData.buildingId as ObjectId).toString(),
          userInfoTestData._id.toString(),
          linkUnitToBuildingDto,
        ),
      ).rejects.toThrow(HttpException);
    });
    it('should throw an exception if user does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn([unitInfoTestData2], 'find');
      userServiceMock.findUserById.mockResolvedValue(null);

      //Act
      expect(
        service.linkUnitToUser(
          (unitInfoTestData.buildingId as ObjectId).toString(),
          userInfoTestData._id.toString(),
          linkUnitToBuildingDto,
        ),
      ).rejects.toThrow(HttpException);
    });
  });
  describe('findOwnerUnits', () => {
    it('should return all units for a given user given valid information', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn([unitInfoTestData], 'find');
      userServiceMock.findUserById.mockResolvedValue(userInfoTestData2);

      //Act
      const result = await service.findOwnerUnits(
        userInfoTestData._id.toString(),
      );

      //Assert
      expect(result).toBeDefined();
    });
    it('should throw an error if user does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn([], 'find');
      userServiceMock.findUserById.mockResolvedValue(null);

      //Act
      expect(
        service.findOwnerUnits(userInfoTestData._id.toString()),
      ).rejects.toThrow(HttpException);
    });
  });
  describe('findRenterUnit', () => {
    it('should return the unit a renter rents given valid information', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn(unitInfoTestData, 'findOne');
      userServiceMock.findUserById.mockResolvedValue(userInfoTestData);

      //Act
      const result = await service.findRenterUnit(
        userInfoTestData._id.toString(),
      );

      //Assert
      expect(result).toBeDefined();
    });
    it('should throw an exception if user does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn(unitInfoTestData, 'findOne');
      userServiceMock.findUserById.mockResolvedValue(null);

      //Act
      expect(
        service.findRenterUnit(userInfoTestData._id.toString()),
      ).rejects.toThrow(HttpException);
    });
    it('should throw an exception if unit does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn(null, 'findOne');
      userServiceMock.findUserById.mockResolvedValue(userInfoTestData);

      //Act
      const result = await service.findRenterUnit(
        userInfoTestData._id.toString(),
      );

      //Act
      expect(result).toBeNull();
    });
  });
  describe('makeNewPayment', () => {
    it('make payment to unowned unit', async () => {
      mockingoose(UnitModel).toReturn(unitInfoTestData2, 'findOne');
      mockingoose(PaymentsModel).toReturn(paymentsTestData, 'findOne');

      expect(
        service.makeNewPayment(unitInfoTestData2.id.toString(), {
          amount: 1000,
        }),
      ).rejects.toThrow(HttpException);
    });
    it('should make new payment successfully (no overdue)', async () => {
      mockingoose(UnitModel)
        .toReturn(unitInfoTestData3, 'findOne')
        .toReturn((_: any) => {}, 'save');
      mockingoose(PaymentsModel)
        .toReturn(paymentsTestData, 'findOne')
        .toReturn((_: any) => {}, 'save');

      const result = await service.makeNewPayment(
        unitInfoTestData3.id.toString(),
        {
          amount: 1000,
        },
      );

      expect(result).toBe(HttpStatus.NO_CONTENT);
    });
    it('should make new payment successfully (with overdue)', async () => {
      mockingoose(UnitModel)
        .toReturn(inDebtedUnitInfoTestData, 'findOne')
        .toReturn((_: any) => {}, 'save');
      mockingoose(PaymentsModel)
        .toReturn(paymentsTestData, 'findOne')
        .toReturn((_: any) => {}, 'save');

      const result = await service.makeNewPayment(
        inDebtedUnitInfoTestData.id.toString(),
        {
          amount: 1000,
        },
      );

      expect(result).toBe(HttpStatus.NO_CONTENT);
    });
  });
  describe('scheduled task', () => {
    it('scheduled fees adjustment should run', async () => {
      mockingoose(UnitModel).toReturn([inDebtedUnitInfoTestData], 'find');
      service.handleCron();
    });
  });
});
