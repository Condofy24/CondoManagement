import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoServerError, ObjectId } from 'mongodb';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { UnitService } from '../unit/unit.service';
import { RequestService } from './request.service';
import { RequestModel, RequestStatus } from './entities/request.entity';
import { CreateRequestDto, RequestType } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

const mockingoose = require('mockingoose');

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

const unitServiceMock = {
  findUnitById: jest.fn().mockResolvedValue(occupiedUnitInfoTestData),
};

const createRequestDto: CreateRequestDto = {
  title: 'Building 2 problem',
  description: 'Problem in building 2',
  type: RequestType.ADMIN,
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

describe('RequestService', () => {
  let service: RequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestService,
        {
          provide: getModelToken('Request'),
          useValue: RequestModel,
        },
        {
          provide: UnitService,
          useValue: unitServiceMock,
        },
      ],
    }).compile();
    service = module.get<RequestService>(RequestService);
  });

  afterEach(() => {
    mockingoose(RequestModel).reset();
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('remove', () => {
    it('should remove a Request given its corresponding id', async () => {
      mockingoose(RequestModel).toReturn(
        requestInfoTestData2,
        'findOneAndDelete',
      );

      //Act
      const requestId = requestInfoTestData2._id.toString(); // Use an actual ID that matches the mock
      await expect(service.remove(requestId)).resolves.not.toThrow();
    });

    it('should throw an error if Request id is invalid', async () => {
      // Arrange to simulate that no document was found for deletion
      mockingoose(RequestModel).toReturn(null, 'findOneAndDelete'); // Use the correct method name

      // Act & Assert
      await expect(service.remove(new ObjectId().toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('findAll', () => {
    it('should return all the request fot a specifc ', async () => {
      //Arrange
      const request = [requestInfoTestData2];
      mockingoose(RequestModel).toReturn(request, 'find');
      const id = requestInfoTestData2.owner;

      //Act
      const result = await service.findAllForOwner(id.toString());
      //Assert
      expect(result.length).toBe(request.length);
      expect(result[0]).toEqual(
        expect.objectContaining({ ...requestInfoTestData2 }),
      );
    });
  });

  describe('Update', () => {
    it('should successfully update an existing request', async () => {
      const updateData: UpdateRequestDto = { title: 'Updated Title' };
      const requestId = new ObjectId().toString();

      mockingoose(RequestModel).toReturn(
        { _id: requestId, ...updateData },
        'findOneAndUpdate',
      );

      const updatedRequest = await service.update(requestId, updateData);

      expect(updatedRequest).toHaveProperty('_id', expect.any(ObjectId));
      expect(updatedRequest).toHaveProperty('title', updateData.title);
    });

    it('should throw BadRequestException if the request is bad', async () => {
      const updateData: UpdateRequestDto = { title: 'Non-existent Title' };
      const nonExistentId = new ObjectId().toString();

      mockingoose(RequestModel).toReturn(null, 'findOneAndUpdate');

      await expect(service.update(nonExistentId, updateData)).rejects.toThrow(
        BadRequestException,
      );
    });
    describe('create', () => {
      it('should successfully create a request', async () => {
        // Arrange
        const ownerId = occupiedUnitInfoTestData.ownerId.toString();
        const unitId = occupiedUnitInfoTestData._id.toString();
        const mockCreationResult = {
          ...createRequestDto,
          _id: new ObjectId('6604b83495851141dad8982c'), // Example _id
          owner: ownerId,
          unit: unitId,
          status: 'Submitted',
        };

        mockingoose(RequestModel).toReturn(mockCreationResult, 'save');

        // Act
        const createdRequest = await service.create(
          unitId,
          createRequestDto,
          ownerId,
        );

        // Assert
        expect(createdRequest._id.toString()).toBe(
          mockCreationResult._id.toString(),
        );
        expect(createdRequest.owner.toString()).toBe(ownerId);
        expect(createdRequest.unit.toString()).toBe(unitId);
        expect(createdRequest.title).toBe(createRequestDto.title);
        expect(createdRequest.status).toBe('Submitted');
      });
    });
  });
});
