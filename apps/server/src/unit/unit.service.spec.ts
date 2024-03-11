import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientSession, MongoServerError, ObjectId } from 'mongodb';
import { BuildingService } from '../building/building.service';
import { ParkingService } from '../parking/parking.service';
import { UserService } from '../user/user.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import PaymentsModel from './entities/payments.entity';
import RegistationKeyModel, {
  RegistrationKeyEntity,
} from './entities/registration-key.entity';
import UnitModel, { UnitEntity } from './entities/unit.entity';
import { UnitService } from './unit.service';

const mockingoose = require('mockingoose');

const createUnitDto: CreateUnitDto = {
  unitNumber: 4,
  size: 4,
  isOccupiedByRenter: false,
  fees: 4,
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

const unitInfoTestData: Partial<UnitEntity> = {
  _id: new ObjectId(),
  buildingId: buildingInfoTestData2._id,
  unitNumber: 4,
  size: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

const unitInfoTestData2 = {
  _id: new ObjectId(),
  buildingId: buildingInfoTestData2._id,
  unitNumber: 4,
  size: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

const unitInfoTestData3 = {
  id: new ObjectId('65ed1de804bd4c731c3456c3'),
  ownerId: new ObjectId(),
  buildingId: buildingInfoTestData2._id,
  unitNumber: 4,
  size: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

const inDebtedUnitInfoTestData = {
  id: new ObjectId('65ed1de804bd4c731c3456c3'),
  ownerId: new ObjectId(),
  buildingId: buildingInfoTestData2._id,
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

const registationKeyTestData: Partial<RegistrationKeyEntity> = {
  _id: new ObjectId(),
  unitId: new ObjectId(),
  key: 'test',
  type: 'owner',
};

const parkingInfoTestData = {
  _id: new ObjectId(),
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
  findBuildingById: jest.fn().mockResolvedValue(buildingInfoTestData),
  updateBuilding: jest.fn().mockResolvedValue(buildingInfoTestData),
};

const parkingServiceMock = {
  findParkingsByUnitId: jest.fn().mockResolvedValue([parkingInfoTestData]),
};

const userServiceMock = {
  findUserById: jest.fn().mockResolvedValue(userInfoTestData),
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
        { provide: ParkingService, useValue: parkingServiceMock },
        {
          provide: getModelToken('Payments'),
          useValue: PaymentsModel,
        },
        {
          provide: getModelToken('RegistrationKey'),
          useValue: RegistationKeyModel,
        },
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
      buildingServiceMock.findBuildingById.mockResolvedValue(
        buildingInfoTestData,
      );

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
      buildingServiceMock.findBuildingById.mockResolvedValue(null);

      //Act and Assert
      await expect(
        service.createUnit(id.toString(), createUnitDto),
      ).rejects.toThrow(HttpException);
    });
    it('should throw an error if unit already exists', async () => {
      //Arrange
      const id = unitInfoTestData.buildingId as ObjectId;
      buildingServiceMock.findBuildingById.mockResolvedValue({
        id,
        ...buildingInfoTestData,
      });

      mockingoose(UnitModel).toReturn((_: any) => {
        throw mongoUniqueIndexException;
      }, 'save');

      //Act and Assert
      await expect(
        service.createUnit(id.toString(), createUnitDto),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('findAll', () => {
    it('should return all the units in a specific building given a valid buildingId', async () => {
      //Arrange
      const units = [unitInfoTestData];

      mockingoose(UnitModel).toReturn(units, 'find');
      mockingoose(RegistationKeyModel).toReturn(registationKeyTestData, 'find');

      const id = unitInfoTestData.buildingId as ObjectId;

      //Act
      const result = await service.findAllBuildingUnits(id.toString());

      //Assert
      expect(result.length).toBe(units.length);
    });
  });

  describe('findUnitById', () => {
    it('should return a unit given its corresponding id', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn({ _id: 'test' }, 'findOne');

      //Act
      await service.findUnitById((unitInfoTestData._id as ObjectId).toString());

      //Arrange
      await expect(service.findUnitById('test')).resolves.toBeDefined();
    });
  });

  describe('remove', () => {
    it('remove a unit given its corresponding id', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn(unitInfoTestData2, 'findOneAndRemove');
      const buildingId = unitInfoTestData2.buildingId.toString();
      buildingServiceMock.findBuildingById.mockResolvedValue({
        buildingId,
        ...buildingInfoTestData,
      });

      //Act
      await service.remove((unitInfoTestData2._id as ObjectId).toString());

      //Assert
      expect(buildingServiceMock.updateBuilding).toHaveBeenCalled();
    });

    it('should throw an exception given an incorrect unit id', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn({ _id: 'test' }, 'findById');

      //Act
      expect(service.remove('test')).rejects.toThrow(HttpException);

      //Assert
    });
    it('should throw an exception if building does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn(unitInfoTestData2, 'findOne');
      buildingServiceMock.findBuildingById.mockResolvedValue(null);

      //Act
      expect(service.remove('test')).rejects.toThrow(HttpException);
    });
  });

  describe('linkUnitToUser', () => {
    it('should link a specific unit to a specific user given valid informaiton', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn([unitInfoTestData2], 'findOne');

      //Act
      await service.linkUnitToUser(
        unitInfoTestData2.buildingId.toString(),
        registationKeyTestData as RegistrationKeyEntity,
        {} as ClientSession,
      );
    });
    it('should throw an exception if unit does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn([], 'find');

      //Act
      expect(
        service.linkUnitToUser(
          userInfoTestData._id.toString(),
          registationKeyTestData as RegistrationKeyEntity,
          {} as ClientSession,
        ),
      ).rejects.toThrow(HttpException);
    });
  });
  describe('findAssociatedUnits', () => {
    it('should return all units for a given user given valid information', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn([unitInfoTestData], 'find');
      userServiceMock.findUserById.mockResolvedValue(userInfoTestData);

      //Act
      const result = await service.findAssociatedUnits(
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
        service.findAssociatedUnits(userInfoTestData._id.toString()),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('payments', () => {
    it('make payment to unowned unit', async () => {
      mockingoose(UnitModel).toReturn(unitInfoTestData2, 'findOne');
      mockingoose(PaymentsModel).toReturn(paymentsTestData, 'findOne');

      expect(
        service.makeNewPayment(unitInfoTestData2._id.toString(), {
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

      expect(result.statusCode).toBe(HttpStatus.NO_CONTENT);
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

      expect(result.statusCode).toBe(HttpStatus.NO_CONTENT);
    });
    it('should get all unit payments', async () => {
      mockingoose(PaymentsModel).toReturn(paymentsTestData, 'findOne');

      const result = await service.getUnitPayments('test-id');

      expect(result?.record?.[0]?.amount).toBe(100);
    });
  });
  describe('scheduled task', () => {
    it('scheduled fees adjustment should run', async () => {
      mockingoose(UnitModel).toReturn([inDebtedUnitInfoTestData], 'find');
      service.handleCron();
    });
  });
});
