import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnitService } from './unit.service';
import UnitModel, { UnitEntity } from './entities/unit.entity';
import { BadRequestException, HttpException } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { BuildingService } from '../building/building.service';
import { UserService } from '../user/user.service';
import { ClientSession, MongoServerError, ObjectId } from 'mongodb';
import RegistationKeyModel, {
  RegistrationKeyEntity,
} from './entities/registration-key.entity';

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

const buildingServiceMock = {
  findBuildingById: jest.fn().mockResolvedValue(buildingInfoTestData),
  updateBuilding: jest.fn().mockResolvedValue(buildingInfoTestData),
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
});
