import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { BuildingService } from '../building/building.service';
import { NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

const userInfoTestData = {
  _id: new ObjectId(),
  email: 'user@example.com',
  name: 'Test User',
  role: 4,
  phoneNumber: '1234567890',
  imageUrl: 'https://example.com/image.jpg',
  imageId: 'image123',
};

const userServiceMock = {
  createUser: jest.fn().mockResolvedValue(userInfoTestData),
  createManager: jest.fn().mockResolvedValue(userInfoTestData),
  createEmployee: jest.fn().mockResolvedValue(userInfoTestData),
  findUserById: jest.fn(),
  findEmployeeById: jest.fn(),
  remove: jest.fn(),
  updateUser: jest.fn().mockResolvedValue(userInfoTestData),
};

const jwtServiceMock = {};

const buildingServiceMock = {};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: BuildingService,
          useValue: buildingServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should forward call to user service', async () => {
      // Act
      await controller.create({} as any, {} as any);

      // Assert
      expect(userServiceMock.createUser).toHaveBeenCalled();
    });
  });

  describe('createManager', () => {
    it('should forward call to user service', async () => {
      // Act
      await controller.createManager({} as any, {} as any);

      // Assert
      expect(userServiceMock.createManager).toHaveBeenCalled();
    });
  });

  describe('createEmployee', () => {
    it('should forward call to user service', async () => {
      // Act
      await controller.createEmployee({} as any);

      // Assert
      expect(userServiceMock.createEmployee).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should throw an error if user account not found', async () => {
      // Arrange
      userServiceMock.findUserById.mockResolvedValue(null);

      // Act
      await expect(
        controller.getProfile({ user: { sub: 'test' } } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should forward call to user service', async () => {
      // Arrange
      userServiceMock.findUserById.mockResolvedValue({});

      // Act
      await controller.getProfile({ user: { sub: 'test' } } as any);

      // Assert
      expect(userServiceMock.findUserById).toHaveBeenCalled();
    });
  });
});
