import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnitService } from '../unit/unit.service';
import { MongoServerError, ObjectId } from 'mongodb';
import { CreateRequestDto, RequestType } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestService } from './request.service';
import {
  RequestEntity,
  RequestModel,
  RequestStatus,
} from './entities/request.entity';
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
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
