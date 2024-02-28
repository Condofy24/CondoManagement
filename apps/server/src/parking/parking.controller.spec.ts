import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { User } from '../user/entities/user.entity';
import { Building } from '../building/entities/building.entity';
import { ParkingController } from './parking.controller';
import { CreateParkingDto } from './dto/create-parking.dto';
import { LinkParkingToUnitDto } from './dto/link-parking-to-unit.dtp';
import { Parking } from './entities/parking.entity';
import { ParkingService } from './parking.service';
import { HttpStatus } from '@nestjs/common';
import { Unit } from 'src/unit/entities/unit.entity';

const createParkingDto: CreateParkingDto = {
  parkingNumber: 4,
  isOccupied: false,
  fees: 4,
};

const parkingServiceMock = {
  createParking: jest.fn(),
  linkParkingToUnit: jest.fn(),
  removeParking: jest.fn(),
  findAll: jest.fn(),
};

const linkParkingToUnitDto: LinkParkingToUnitDto = {
  parkingNumber: 4,
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

const parkingInfoTestData: Parking = {
  buildingId: buildingInfoTestData2.id,
  parkingNumber: 4,
  isOccupied: false,
  fees: 4,
};

const parkingInfoTestData2 = {
  id: new ObjectId(),
  buildingId: buildingInfoTestData2.id,
  parkingNumber: 4,
  isOccupied: false,
  fees: 4,
};

const occupiedUnitInfoTestData: Unit = {
  buildingId: buildingInfoTestData2.id,
  ownerId: new ObjectId(),
  renterId: new ObjectId(),
  unitNumber: 5,
  size: 4.5,
  isOccupiedByRenter: true,
  fees: 500,
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
      expect(result).toEqual(parkingInfoTestData);
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

      const result = await controller.linkParkingToUnit(
        parkingInfoTestData.buildingId.toString(),
        unitId.toString(),
        linkParkingToUnitDto,
      );

      //Assert
      expect(result).toEqual(parkingInfoTestData);
    });
  });
  describe('removeParking', () => {
    it('should forward call to parking service', async () => {
      //Arrange
      parkingServiceMock.removeParking.mockResolvedValue(HttpStatus.NO_CONTENT);

      //Act
      const result = await controller.remove(
        parkingInfoTestData2.id.toString(),
      );

      //Assert
      expect(result).toEqual(HttpStatus.NO_CONTENT);
    });
  });
  describe('findAll', () => {
    it('should forward call to parking service', async () => {
      //Arrange
      parkingServiceMock.findAll.mockResolvedValue([parkingInfoTestData]);

      //Act
      const result = await controller.findAll(
        parkingInfoTestData2.buildingId.toString(),
      );

      //Assert
      expect(result).toEqual([parkingInfoTestData]);
    });
  });
});
