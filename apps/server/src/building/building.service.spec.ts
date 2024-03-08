import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';
import { CloudinaryService } from '../user/cloudinary/cloudinary.service';
import BuildingModel, { BuildingEntity } from './entities/building.entity';
import { Readable } from 'stream';
import { buffer } from 'stream/consumers';
import { CreateBuildingDto } from './dto/create-building.dto';
import { MongoServerError, ObjectId } from 'mongodb';
import { Company } from '../company/entities/company.entity';
import { CompanyService } from '../company/company.service';
import { UnitService } from '../unit/unit.service';
import { ParkingService } from '../parking/parking.service';
import { StorageService } from '../storage/storage.service';
import { BadRequestException, HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { toBuilding } from './view-models/building.view-model';

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

const companyInfoTestData: Company = {
  _id: new ObjectId().toString(),
  companyName: 'PEWPEW',
  companyLocation: 'PEWPew Address',
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
  findOne: jest.fn().mockResolvedValue(companyInfoTestData),
};
const unitServiceMock = {
  findAll: jest.fn().mockResolvedValue([]),
};
const parkingServiceMock = {
  findAll: jest.fn().mockResolvedValue([]),
};
const storageServiceMock = {
  findAll: jest.fn().mockResolvedValue([]),
};
const userServiceMock = {
  findOne: jest.fn(),
};
const jwtServiceMock = {
  signAsync: jest.fn(),
};

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
        {
          provide: ParkingService,
          useValue: parkingServiceMock,
        },
        {
          provide: StorageService,
          useValue: storageServiceMock,
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
      companyServiceMock.findOne.mockResolvedValue({
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
      companyServiceMock.findOne.mockResolvedValue(null);

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
      companyServiceMock.findOne.mockResolvedValue({
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
  describe('findAll', () => {
    it('should return all the users', async () => {
      // Arrange
      const building = [
        buildingInfoTestData,
        buildingInfoTestData,
        buildingInfoTestData,
      ];
      mockingoose(BuildingModel).toReturn(building, 'find');

      // Act
      const result = await service.findAll(companyInfoTestData._id);

      // Assert
      expect(result.length).toBe(building.length);
      expect(result[0]).toEqual(
        expect.objectContaining({ ...buildingInfoTestData, name: 'PEWPEWWW' }),
      );
    });
  });
  describe('findOne', () => {
    it('should find a building by id', async () => {
      // Arrange
      mockingoose(BuildingModel).toReturn({ _id: 'test' }, 'findOne');

      // Act
      await service.findOne('test');

      // Arrange
      await expect(service.findOne('test')).resolves.toBeDefined();
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

  describe('findAllProperties', () => {
    it('should return building info and arrays of building properties', async () => {
      // Arrange
      mockingoose(BuildingModel).toReturn(buildingInfoTestData, 'findOne');

      // Call the method
      const result = await service.findAllProperties('421');

      // Assertions
      expect(result).toMatchObject({
        building: toBuilding(buildingInfoTestData as BuildingEntity),
      });
    });
  });
});
