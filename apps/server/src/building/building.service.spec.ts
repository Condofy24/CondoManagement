import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import BuildingModel, { BuildingEntity } from './entities/building.entity';
import { Readable } from 'stream';
import { buffer } from 'stream/consumers';
import { CreateBuildingDto } from './dto/create-building.dto';
import { MongoServerError, ObjectId } from 'mongodb';
import { CompanyEntity } from '../company/entities/company.entity';
import { CompanyService } from '../company/company.service';
import { UnitService } from '../unit/unit.service';
import { ParkingService } from '../parking/parking.service';
import { StorageService } from '../storage/storage.service';
import { BadRequestException, HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

const mockingoose = require('mockingoose');

const cloudinaryResponseMock = {
  secure_url: 'https://example.com/image.jpg',
  public_id: 'image123',
  asset_id: 'Image212344124',
};

const cloudinaryServiceMock = {
  uploadFile: jest.fn().mockResolvedValue(cloudinaryResponseMock),
};

const createBuildingDto: CreateBuildingDto = {
  name: 'test2',
  address: 'address test',
};

const companyInfoTestData: Partial<CompanyEntity> = {
  _id: new ObjectId(),
  name: 'PEWPEW',
  location: 'PEWPew Address',
};
const updateBuildingDtoTestData = {
  name: 'Updated Building',
  address: '456 Elm Street',
};
const updatedBuildingTest = {
  _id: new ObjectId(),
  companyId: new ObjectId(),
  name: 'Updated Building',
  address: '456 Elm Street',
  unitCount: 30,
  parkingCount: 10,
  storageCount: 5,
  fileUrl: 'https://example.com/image.jpg',
  filePublicId: 'image123',
  fileAssetId: 'Image212344124',
};

const fileMockData: Express.Multer.File = {
  fieldname: 'file',
  originalname: 'test.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 1024,
  destination: 'uploads/',
  filename: 'test.jpg',
  path: 'uploads/test.jpg',
  buffer: Buffer.from('some buffer data', 'utf-8'),
  stream: new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  }),
};

const buildingInfoTestData = {
  _id: new ObjectId(),
  companyId: new ObjectId(),
  name: 'PEWPEWWW',
  address: '2240PewPew',
  unitCount: 43,
  parkingCount: 23,
  storageCount: 6,
  fileUrl: 'https://example.com/image.jpg',
  filePublicId: 'image123',
  fileAssetId: 'Image212344124',
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

const companyServiceMock = {
  findCompanyById: jest.fn().mockResolvedValue(companyInfoTestData),
};
const userServiceMock = {
  findOne: jest.fn(),
};
const jwtServiceMock = {
  signAsync: jest.fn(),
};

const unitServiceMock = {};

describe('BuildingService', () => {
  let service: BuildingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildingService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: getModelToken('Building'),
          useValue: BuildingModel,
        },
        {
          provide: CloudinaryService,
          useValue: cloudinaryServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: CompanyService,
          useValue: companyServiceMock,
        },
        {
          provide: UnitService,
          useValue: unitServiceMock,
        },
      ],
    }).compile();
    service = module.get<BuildingService>(BuildingService);
  });

  afterEach(() => {
    mockingoose(BuildingModel).reset();
    cloudinaryServiceMock.uploadFile.mockResolvedValue(cloudinaryResponseMock);
    jest.clearAllMocks();
  });

  describe('createBuilding', () => {
    it('should create a building successfully if information is valid', async () => {
      //Arrange
      mockingoose(BuildingModel).toReturn(null, 'findOne');
      mockingoose(BuildingModel).toReturn(null, 'exists');
      const id = new ObjectId();
      companyServiceMock.findCompanyById.mockResolvedValue({
        id,
        ...companyInfoTestData,
      });

      //Act
      const result: any = await service.createBuilding(
        createBuildingDto,
        fileMockData,
        id.toString(),
      );

      //Assert
      expect(result).toBeDefined();
    });

    it('should throw an error if building does not exist', async () => {
      //Arrange
      mockingoose(BuildingModel).toReturn(null, 'findOne');
      const id = new ObjectId();
      companyServiceMock.findCompanyById.mockResolvedValue(null);

      //Act and Assert
      await expect(
        service.createBuilding(createBuildingDto, fileMockData, id.toString()),
      ).rejects.toThrow(HttpException);
    });

    it('should throw BadRequestException if address already exists', async () => {
      // Arrange
      const id = new ObjectId();

      const finderMock = (query: any) => {
        throw mongoUniqueIndexException;
      };

      mockingoose(BuildingModel).toReturn(finderMock, 'findOne'); // findById is findOne

      // Act & Assert
      await expect(
        service.createBuilding(createBuildingDto, fileMockData, id.toString()),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw HttpException if building already exists', async () => {
      // Arrange
      const id = new ObjectId();
      const finderMock = (query: any) => {
        throw mongoUniqueIndexException;
      };

      mockingoose(BuildingModel).toReturn(finderMock, 'findOne'); // findById is findOne

      // Act & Assert
      await expect(
        service.createBuilding(createBuildingDto, fileMockData, id.toString()),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if saving building fails', async () => {
      // Arrange
      mockingoose(BuildingModel).toReturn(null, 'findOne');
      const id = new ObjectId();
      companyServiceMock.findCompanyById.mockResolvedValue({
        id,
        ...companyInfoTestData,
      });

      mockingoose(BuildingModel).toReturn(new Error(), 'save');

      // Act & Assert
      await expect(
        service.createBuilding(createBuildingDto, fileMockData, id.toString()),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findOne', () => {
    it('should find a building by id', async () => {
      // Arrange
      mockingoose(BuildingModel).toReturn({ _id: 'test' }, 'findOne');

      // Act
      await service.findBuildingById('test');

      // Arrange
      await expect(service.findBuildingById('test')).resolves.toBeDefined();
    });
  });
  describe('updateBuilding', () => {
    it('should update the building with valid inputs', async () => {
      // Arrange
      const buildingId = new ObjectId();
      mockingoose(BuildingModel).toReturn(buildingInfoTestData, 'findOne');
      mockingoose(BuildingModel).toReturn(
        updatedBuildingTest,
        'findOneAndUpdate',
      );
      cloudinaryServiceMock.uploadFile.mockResolvedValue(
        cloudinaryResponseMock,
      );

      // Act
      const result = await service.updateBuilding(
        buildingId.toString(),
        updateBuildingDtoTestData,
        fileMockData,
      );

      // Assert
      expect(result).toMatchObject(updatedBuildingTest);
    });

    it('should throw an error if building is not found', async () => {
      // Arrange
      const buildingId = 'nonExistentBuilding';
      const updateBuildingDto = {
        name: 'Updated Building',
        address: '456 Elm Street',
      };
      mockingoose(BuildingModel).toReturn(null, 'findOne');

      // Act and Assert
      await expect(
        service.updateBuilding(buildingId, updateBuildingDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('findAll', () => {
    it('should return all company buildings', async () => {
      // Arrange
      mockingoose(BuildingModel).toReturn([buildingInfoTestData], 'find');

      // Act
      const result = await service.findAll(new ObjectId().toString());

      // Assert
      expect(result).toMatchObject([buildingInfoTestData]);
    });
  });
});
