import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnitService } from '../unit/unit.service';
import { MongoServerError, ObjectId } from 'mongodb';
import { CreateRequestDto, RequestType } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestService } from './request.service';
import { RequestStatus } from './entities/request.entity';
import { HttpException } from '@nestjs/common';
import { RequestController } from './request.controller';
import { JwtService } from '@nestjs/jwt';

const mockingoose = require('mockingoose');

const requestServiceMock = {
  create: jest.fn(),
  findAllForOwner: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const buildingInfoTestData2 = {
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

const occupiedUnitInfoTestData = {
  _id: new ObjectId(),
  buildingId: buildingInfoTestData2._id,
  ownerId: new ObjectId(),
  renterId: new ObjectId(),
  unitNumber: 5,
  size: 4.5,
  isOccupiedByRenter: true,
  fees: 500,
};
const requestInfoTestData2 = {
  _id: new ObjectId(),
  title: 'Building2',
  description: 'Building 2 description',
  type: RequestType.ADMIN,
  status: RequestStatus.IN_PROGRESS,
  owner: new ObjectId(),
  unit: new ObjectId(),
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

const createRequestDto: CreateRequestDto = {
  title: 'Building 2 problem',
  description: 'Problem in building 2',
  type: RequestType.ADMIN,
};
describe('RequestController', () => {
  let controller: RequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestController],
      providers: [
        {
          provide: RequestService,
          useValue: requestServiceMock,
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RequestController>(RequestController);

    requestServiceMock.create.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
