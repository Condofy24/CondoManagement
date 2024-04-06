import { Test, TestingModule } from '@nestjs/testing';

import { ObjectId } from 'mongodb';
import { RequestType } from './dto/create-request.dto';
import { RequestService } from './request.service';
import { RequestStatus } from './entities/request.entity';
import { HttpStatus } from '@nestjs/common';
import { RequestController } from './request.controller';
import { JwtService } from '@nestjs/jwt';

const requestServiceMock = {
  create: jest.fn(),
  findAllForOwner: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
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

  describe('remove', () => {
    it('should forward call to Reqeust service', async () => {
      //Arrange
      requestServiceMock.remove.mockResolvedValue(HttpStatus.NO_CONTENT);

      //Act
      const result = await controller.remove(
        requestInfoTestData2._id.toString(),
      );

      //Assert
      expect(result.statusCode).toEqual(HttpStatus.OK);
    });
  });
});
