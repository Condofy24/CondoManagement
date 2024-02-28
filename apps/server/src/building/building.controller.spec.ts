import { Test, TestingModule } from '@nestjs/testing';
import { BuildingService } from './building.service';
import { buffer } from 'stream/consumers';
import { Readable } from 'stream';
import { BuildingController } from './building.controller';
import { CreateBuildingDto } from './dto/create-building.dto';
import { ObjectId } from 'mongodb';

const buildingServiceMock = {
  createBuilding: jest.fn(),
  findAll: jest.fn(),
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
const createBuildingDto: CreateBuildingDto = {
  name: 'test2',
  address: 'address test',
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

describe('BuidlingController', () => {
  let buildingController: BuildingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildingController],
      providers: [
        {
          provide: BuildingService,
          useValue: buildingServiceMock,
        },
      ],
    }).compile();

    buildingController = module.get<BuildingController>(BuildingController);
  });

  it('should be defined', () => {
    expect(buildingController).toBeDefined();
  });

  describe('create', () => {
    it('should forward call to building service', async () => {
      // Arrange

      buildingServiceMock.createBuilding.mockResolvedValue(
        buildingInfoTestData,
      );

      // Act
      const result = await buildingController.create(
        's',
        createBuildingDto,
        fileMockData,
      );

      //Assert
      expect(result).toEqual(buildingInfoTestData);
    });
    describe('findAll', () => {
      it('should forward call to building service', async () => {
        // Arrange

        buildingServiceMock.findAll.mockResolvedValue(buildingInfoTestData);

        // Act
        const result = await buildingController.findAll(
          buildingInfoTestData.companyId.toString(),
        );

        //Assert
        expect(result).toEqual(buildingInfoTestData);
      });
    });
  });
});
