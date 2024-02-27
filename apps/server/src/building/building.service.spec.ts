import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BuildingService } from '../building/building.service';
import { CloudinaryService } from '../user/cloudinary/cloudinary.service';
import { BuildingModel } from '../building/entities/building.entity';
import { Readable } from 'stream';
import { buffer } from 'stream/consumers';
import { CreateBuildingDto } from './dto/create-building.dto';
import { ObjectId } from 'mongodb';
import { Company } from '../company/entities/company.entity';
import { CompanyService } from '../company/company.service';
import { UnitService } from '../unit/unit.service';
import { ParkingService } from '../parking/parking.service';
import { StorageService } from '../storage/storage.service';
import { BadRequestException, HttpException } from '@nestjs/common';

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
  companyId: '2d04c8e7-dd56-46de-826f-f7c4194f5644',
  companyName: 'PEWPEW',
  companyLocation: 'PEWPew Address',
};
const updateBuildingDtoTestData = {
  name: 'Updated Building',
  address: '456 Elm Street',
};
const updatedBuildingTest = {
  id: new ObjectId(),
  companyId: 'company123',
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
const companyServiceMock = {
  findByCompanyId: jest.fn().mockResolvedValue(companyInfoTestData),
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

describe('BuildingService', () => {
  let service: BuildingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildingService,
        {
          provide: getModelToken('Building'),
          useValue: BuildingModel,
        },
        {
          provide: CloudinaryService,
          useValue: cloudinaryServiceMock,
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
  describe('uploadfileToCloudinary', () => {
    it('should upload file to cloudinary successfully', async () => {
      // Act
      const result = await service.uploadFileToCloudinary(fileMockData);
      // Assert
      expect(result).toEqual(cloudinaryResponseMock);
    });

    it('should fail to upload file to cloudinary ', async () => {
      // Arrange
      cloudinaryServiceMock.uploadFile.mockRejectedValue(new Error());

      // Act
      await expect(
        service.uploadFileToCloudinary(fileMockData),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('createBuilding', () => {
    it('should create a building successfully if information is valid', async () => {
      //Arrange
      mockingoose(BuildingModel).toReturn(null, 'findOne');
      mockingoose(BuildingModel).toReturn(null, 'exists');
      const id = new ObjectId();
      companyServiceMock.findByCompanyId.mockResolvedValue({
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
      companyServiceMock.findByCompanyId.mockResolvedValue(null);

      //Act and Assert
      await expect(
        service.createBuilding(createBuildingDto, fileMockData, id.toString()),
      ).rejects.toThrow(HttpException);
    });
    it('should throw HttpException if address already exists', async () => {
      const id = new ObjectId();
      companyServiceMock.findByCompanyId.mockResolvedValue({
        id,
        ...companyInfoTestData,
      });
      const finderMock = (query: any) => {
        if (query.getQuery().address) {
          return buildingInfoTestData;
        }
        return null;
      };

      mockingoose(BuildingModel).toReturn(finderMock, 'findOne'); // findById is findOne

      // Act & Assert
      await expect(
        service.createBuilding(createBuildingDto, fileMockData, id.toString()),
      ).rejects.toThrow(HttpException);
    });
    it('should throw HttpException if building already exists', async () => {
      const id = new ObjectId();
      companyServiceMock.findByCompanyId.mockResolvedValue({
        id,
        ...companyInfoTestData,
      });
      mockingoose(BuildingModel).toReturn(
        { ...buildingInfoTestData, companyId: id },
        'findOne',
      ); // findById is findOne

      // Act & Assert
      await expect(
        service.createBuilding(createBuildingDto, fileMockData, id.toString()),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an error if saving building fails', async () => {
      // Arrange
      mockingoose(BuildingModel).toReturn(null, 'findOne');
      const id = new ObjectId();
      companyServiceMock.findByCompanyId.mockResolvedValue({
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
      const result = await service.findAll(companyInfoTestData.companyId);

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
      expect(result).toEqual({
        name: updatedBuildingTest.name,
        address: updatedBuildingTest.address,
        fileUrl: updatedBuildingTest.fileUrl,
        filePublicId: updatedBuildingTest.filePublicId,
        fileAssetId: updatedBuildingTest.fileAssetId,
      });
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
  describe('findByIdAndUpdateUnitCount', () => {
    it('should update the unit count of the building', async () => {
      // Arrange
      const buildingId = updatedBuildingTest.id.toString();
      const newUnitCount = 30;

      // Mock the findByIdAndUpdate function of the buildingModel
      mockingoose(BuildingModel).toReturn(
        updatedBuildingTest,
        'findOneAndUpdate',
      );

      // Act
      const result = await service.findByIdandUpdateUnitCount(
        buildingId,
        newUnitCount,
      );

      // Assert
      await expect(result?.unitCount).toEqual(newUnitCount);
    });

    it('should return null if building is not found', async () => {
      // Arrange
      const nonExistentBuildingId = 'nonExistentBuilding';
      mockingoose(BuildingModel).toReturn(null, 'findOneAndUpdate');

      // Act
      const result = await service.findByIdandUpdateUnitCount(
        nonExistentBuildingId,
        50,
      );

      // Assert
      expect(result).toBeNull();
    });
  });
});
