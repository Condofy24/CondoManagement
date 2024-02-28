import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { User } from '../user/entities/user.entity';
import { Building } from '../building/entities/building.entity';
import { ParkingController } from './parking.controller';
import { CreateParkingDto } from './dto/create-parking.dto';
import { LinkParkingToUnitDto } from './dto/link-parking-to-unit.dtp';
import { Parking } from './entities/parking.entity';
import { ParkingService } from './parking.service';

const createParkingDto: CreateParkingDto = {
  parkingNumber: 4,
  isOccupied: false,
  fees: 4,
};

const parkingServiceMock = {
  createParking: jest.fn(),
  linkParkingToUser: jest.fn(),
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


});
