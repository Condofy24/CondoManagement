import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnitService } from './unit.service';
import { CloudinaryService } from '../user/cloudinary/cloudinary.service';
import { Unit, UnitModel } from './entities/unit.entity';
import { BadRequestException, HttpException } from '@nestjs/common';
import { Readable } from 'stream';
import { buffer } from 'stream/consumers';
import { CreateUnitDto } from './dto/create-unit.dto';
import { BuildingService } from '../building/building.service';
import { UserService } from '../user/user.service';
import { VerfService } from '../verf/verf.service';
import { ObjectId } from 'mongodb';
import { Building } from 'src/building/entities/building.entity';
import { LinkUnitToBuidlingDto } from './dto/link-unit-to-building.dto';
import { User } from 'src/user/entities/user.entity';

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

const unitInfoTestData: Unit = {
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

const userInfoTestData: User = {
  id: 'test',
  password: 'test',
  email: 'user@example.com',
  name: 'Test User',
  role: 4,
  phoneNumber: '1234567890',
  imageUrl: 'https://example.com/image.jpg',
  imageId: 'image123',
};

const userInfoTestData2: User = {
  id: 'test',
  password: 'test',
  email: 'user@example.com',
  name: 'Test User',
  role: 3,
  phoneNumber: '1234567890',
  imageUrl: 'https://example.com/image.jpg',
  imageId: 'image123',
};

const verfServiceMock = {
  createVerfKey: jest
    .fn()
    .mockResolvedValue({ verificationkeyId: 'mockVerificationKeyId' }),
};

const buildingServiceMock = {
  findOne: jest.fn().mockResolvedValue(buildingInfoTestData),
  findByIdandUpdateUnitCount: jest.fn().mockResolvedValue(null),
};

const userServiceMock = {
  findById: jest.fn().mockResolvedValue(userInfoTestData),
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
          provide: BuildingService,
          useValue: buildingServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: VerfService,
          useValue: verfServiceMock,
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
        id,
        ...buildingInfoTestData,
      });

      //Act
      const result: any = await service.createUnit(
        id.toString(),
        createUnitDto,
      );

      //Assert
      expect(result).toBeDefined();
      expect(verfServiceMock.createVerfKey).toHaveBeenCalledTimes(2);
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
      const id = unitInfoTestData.buildingId;
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
      const id = unitInfoTestData.buildingId;

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
        userInfoTestData.id,
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
          unitInfoTestData.buildingId.toString(),
          userInfoTestData.id,
          linkUnitToBuildingDto,
        ),
      ).rejects.toThrow(HttpException);
    });
    it('should throw an exception if user does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn([unitInfoTestData2], 'find');
      userServiceMock.findById.mockResolvedValue(null);

      //Act
      expect(
        service.linkUnitToUser(
          unitInfoTestData.buildingId.toString(),
          userInfoTestData.id,
          linkUnitToBuildingDto,
        ),
      ).rejects.toThrow(HttpException);
    });
  });
  describe('findOwnerUnits', () => {
    it('should return all units for a given user given valid information', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn([unitInfoTestData], 'find');
      userServiceMock.findById.mockResolvedValue(userInfoTestData2);

      //Act
      const result = await service.findOwnerUnits(userInfoTestData.id);

      //Assert
      expect(result).toBeDefined();
    });
    it('should throw an error if user does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn([], 'find');
      userServiceMock.findById.mockResolvedValue(null);

      //Act
      expect(service.findOwnerUnits(userInfoTestData.id)).rejects.toThrow(
        HttpException,
      );
    });
  });
  describe('findRenterUnit', () => {
    it('should return the unit a renter rents given valid information', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn(unitInfoTestData, 'findOne');
      userServiceMock.findById.mockResolvedValue(userInfoTestData);

      //Act
      const result = await service.findRenterUnit(userInfoTestData.id);

      //Assert
      expect(result).toBeDefined();
    });
    it('should throw an exception if user does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn(unitInfoTestData, 'findOne');
      userServiceMock.findById.mockResolvedValue(null);

      //Act
      expect(service.findRenterUnit(userInfoTestData.id)).rejects.toThrow(
        HttpException,
      );
    });
    it('should throw an exception if unit does not exist', async () => {
      //Arrange
      mockingoose(UnitModel).toReturn(null, 'findOne');
      userServiceMock.findById.mockResolvedValue(userInfoTestData);

      //Act
      const result = await service.findRenterUnit(userInfoTestData.id);

      //Act
      expect(result).toBeNull();
    });
  });
});
