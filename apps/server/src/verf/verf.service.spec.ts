import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, HttpException } from '@nestjs/common';
import { Readable } from 'stream';
import { buffer } from 'stream/consumers';
import { VerfService } from '../verf/verf.service';
import {
  VerfModel,
  VerfRolesEnum,
  VerificationKey,
} from '../verf/entities/verf.entity';
import { ObjectId } from 'mongodb';

const mockingoose = require('mockingoose');

const verfKeyResponseMock = {
  id: new ObjectId(),
  unitId: new ObjectId('65dd47046d122514e4ccc0b6'),
  key: 'qwerty',
  type: VerfRolesEnum.OWNER,
  claimedBy: 'EA',
};

describe('VerfService', () => {
  let service: VerfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerfService,
        {
          provide: getModelToken('VerificationKey'),
          useValue: VerfModel,
        },
      ],
    }).compile();

    service = module.get<VerfService>(VerfService);
  });

  afterEach(() => {
    mockingoose(VerfModel).reset();
    jest.clearAllMocks();
  });

  describe('VerfService', () => {
    it('should create verf key successfully', async () => {
      // Act
      const result = await service.createVerfKey(
        '65dd47046d122514e4ccc0b6',
        VerfRolesEnum.OWNER,
        'EA',
      );
      // Assert
      expect(result).toEqual({
        ...verfKeyResponseMock,
        unitId: verfKeyResponseMock.unitId.toString(),
        id: result.id,
        key: result.key,
      });
    });

    it('should find verf key successfully', async () => {
      mockingoose(VerfModel).toReturn(verfKeyResponseMock, 'findOne');
      // Arrange
      const result = await service.findByVerfKey('qwerty');
      // Act
      expect(result).toBeTruthy();
    });

    it('should not find verf key', async () => {
      mockingoose(VerfModel).toReturn(null, 'findOne');
      // Arrange
      const result = await service.findByVerfKey('eeeee');
      // Act
      expect(result).toBeFalsy();
    });

    it('should find by unit id key successfully', async () => {
      mockingoose(VerfModel).toReturn([verfKeyResponseMock], 'find');
      // Arrange
      const result = await service.findByUnitId('65dd47046d122514e4ccc0b6');
      // Act
      expect(result).toHaveLength(1);
    });

    it('should not find by unit id key', async () => {
      mockingoose(VerfModel).toReturn(null, 'find');
      // Act
      await expect(service.findByUnitId('122345')).rejects.toThrow(
        HttpException,
      );
    });
  });
});
