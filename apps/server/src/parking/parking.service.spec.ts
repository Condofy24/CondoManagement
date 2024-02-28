import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnitService } from '../unit/unit.service';
import { BuildingService } from '../building/building.service';
import { MongoServerError, ObjectId } from 'mongodb';
import { Building } from '../building/entities/building.entity';
import { CreateParkingDto } from './dto/create-parking.dto';
import { ParkingService } from './parking.service';
import { Parking, ParkingModel } from './entities/parking.entity';
import { Unit } from '../unit/entities/unit.entity';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { LinkParkingToUnitDto } from './dto/link-parking-to-unit.dtp';

const mockingoose = require('mockingoose');

const createParkingDto: CreateParkingDto = {
  parkingNumber: 4,
  isOccupied: false,
  fees: 4,
};

const updateParkingTest: UpdateParkingDto = {
  parkingNumber: 5,
  isOccupied: false,
  fees: 70.5,
};

const updateParkingDtoTestData: UpdateParkingDto = {
  parkingNumber: 7,
  fees: 120,
  isOccupied: false,
};

const linkParkingToUnitDto: LinkParkingToUnitDto = {
  parkingNumber: 8,
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

const occupiedUnitInfoTestData: Unit = {
  buildingId: buildingInfoTestData2.id,
  ownerId: new ObjectId(),
  renterId: new ObjectId(),
  unitNumber: 5,
  size: 4.5,
  isOccupiedByRenter: true,
  fees: 500,
};

const parkingInfoTestData: Parking = {
  buildingId: buildingInfoTestData2.id,
  parkingNumber: 7,
  isOccupied: false,
  fees: 10,
};

const parkingInfoTestData2: Parking = {
  buildingId: buildingInfoTestData2.id,
  parkingNumber: 7,
  isOccupied: false,
  fees: 10,
};

const buildingServiceMock = {
  findOne: jest.fn().mockResolvedValue(buildingInfoTestData),
  findByIdandUpdateParkingCount: jest.fn().mockResolvedValue(null),
};

const unitServiceMock = {
  findOne: jest.fn().mockResolvedValue(occupiedUnitInfoTestData),
};

describe('ParkingService', () => {
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingService,
        {
          provide: getModelToken('Parking'),
          useValue: ParkingModel,
        },
        {
          provide: BuildingService,
          useValue: buildingServiceMock,
        },
        {
          provide: UnitService,
          useValue: unitServiceMock,
        },
      ],
    }).compile();
    service = module.get<ParkingService>(ParkingService);
  });
  afterEach(() => {
    mockingoose(ParkingModel).reset();
    jest.clearAllMocks();
  });
});
