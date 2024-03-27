import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ObjectId } from 'mongodb';
import { BuildingService } from '../building/building.service';
import { UserService } from '../user/user.service';
import { UnitEntity } from 'src/unit/entities/unit.entity';

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

const unitInfoTestData: Partial<UnitEntity> = {
  _id: new ObjectId(),
  buildingId: buildingInfoTestData._id,
  unitNumber: 4,
  size: 4,
  isOccupiedByRenter: false,
  fees: 4,
  ownerId: new ObjectId(),
};

jest.mock('@knocklabs/node');

const userServiceMock = {
  findUserById: jest.fn().mockResolvedValue(userInfoTestData),
};

const buildingServiceMock = {
  findBuildingById: jest.fn().mockResolvedValue(buildingInfoTestData),
};

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    process.env.KNOCK_SECRET_API_KEY = 'test';
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
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

    service = module.get<NotificationService>(NotificationService);
  });

  it('should send payment processed notification', async () => {
    // Arrange
    const amount = 100;

    // Act
    await service.sendPaymentReceivedNotification(
      unitInfoTestData as UnitEntity,
      amount,
    );

    // Assert
    expect(userServiceMock.findUserById).toHaveBeenCalled();
    expect(buildingServiceMock.findBuildingById).toHaveBeenCalled();
  });
});
