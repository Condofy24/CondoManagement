import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { ParkingController } from './parking.controller';
import { CreateParkingDto } from './dto/create-parking.dto';
import { ParkingService } from './parking.service';
import { HttpStatus } from '@nestjs/common';
import { ParkingModel } from './models/parking.model';
import { ParkingEntity } from './entities/parking.entity';

const createParkingDto: CreateParkingDto = {
  parkingNumber: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

const parkingServiceMock = {
  createParking: jest.fn(),
  linkParkingToUnit: jest.fn(),
  remove: jest.fn(),
  findAllBuildingParkings: jest.fn(),
  findByUnitId: jest.fn(),
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

const parkingInfoTestData = {
  _id: new ObjectId(),
  buildingId: buildingInfoTestData2.id,
  parkingNumber: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

const parkingInfoTestData2 = {
  _id: new ObjectId(),
  buildingId: buildingInfoTestData2.id,
  parkingNumber: 4,
  isOccupiedByRenter: false,
  fees: 4,
};

describe('ParkingController', () => {
  let controller: ParkingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingController],
      providers: [
        {
          provide: ParkingService,
          useValue: parkingServiceMock,
        },
      ],
    }).compile();
    controller = module.get<ParkingController>(ParkingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should forward call to Parking service', async () => {
      //Arrange
      parkingServiceMock.createParking.mockResolvedValue(parkingInfoTestData);

      //Act
      const result = await controller.create(
        parkingInfoTestData.buildingId.toString(),
        createParkingDto,
      );

      //Assert
      expect(result).toMatchObject(
        new ParkingModel(parkingInfoTestData as ParkingEntity),
      );
    });
  });

  describe('linkParkingToUnit', () => {
    it('should forward call to unit service', async () => {
      //Arrange
      parkingServiceMock.linkParkingToUnit.mockResolvedValue(
        parkingInfoTestData,
      );
      const unitId = new ObjectId();

      //Act
      await controller.linkParkingToUnit(
        unitId.toString(),
        parkingInfoTestData._id.toString(),
      );
    });
  });
  describe('removeParking', () => {
    it('should forward call to parking service', async () => {
      //Arrange
      parkingServiceMock.remove.mockResolvedValue(HttpStatus.NO_CONTENT);

      //Act
      const result = await controller.remove(
        parkingInfoTestData2._id.toString(),
      );

      //Assert
      expect(result).toEqual(HttpStatus.NO_CONTENT);
    });
  });
  describe('findAll', () => {
    it('should forward call to parking service', async () => {
      //Arrange
      parkingServiceMock.findAllBuildingParkings.mockResolvedValue([
        parkingInfoTestData,
      ]);

      //Act
      const result = await controller.findAllBuildingParkings(
        parkingInfoTestData2.buildingId.toString(),
      );

      //Assert
      expect(result).toMatchObject([
        new ParkingModel(parkingInfoTestData as ParkingEntity),
      ]);
    });
  });
});
