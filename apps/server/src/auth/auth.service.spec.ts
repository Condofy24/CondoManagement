import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
jest.mock('bcrypt');

const userTestData = {
  email: 'Bob@example.com',
  id: '1',
  name: 'Test User',
  password: 'thebuilder',
  role: 'user',
  phoneNumber: '1234567890',
  imageUrl: 'imageurl',
  imageId: 'imageid',
};

const signInDtoTestData = {
  email: 'Bob@example.com',
  password: 'thebuilder',
};

const jwtTokenTestData = 'testToken';

const userServiceMock = {
  findOne: jest.fn(),
};

const jwtServiceMock = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token and user info on successful sign in', async () => {
      // Arrange
      (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(true);
      userServiceMock.findOne.mockResolvedValueOnce(userTestData);
      jwtServiceMock.signAsync.mockResolvedValueOnce(jwtTokenTestData);

      // Act
      const result = await authService.signIn(signInDtoTestData);

      // Assert
      expect(result).toBeDefined();
      expect(result.token).toBe(jwtTokenTestData);
      expect(result.user).toEqual({
        email: userTestData.email,
        id: userTestData.id,
        name: userTestData.name,
        role: userTestData.role,
        phoneNumber: userTestData.phoneNumber,
        imageUrl: userTestData.imageUrl,
        imageId: userTestData.imageId,
      });
      expect(userServiceMock.findOne).toHaveBeenCalledWith(
        signInDtoTestData.email,
      );
      expect(jwtServiceMock.signAsync).toHaveBeenCalled();
    });

    it('should throw exception for invalid password', async () => {
      // Arrange
      (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(false);
      userServiceMock.findOne.mockResolvedValueOnce(userTestData);

      // Act & Assert
      await expect(authService.signIn(signInDtoTestData)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw exception for invalid email', async () => {
      // Arrange
      userServiceMock.findOne.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(authService.signIn(signInDtoTestData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
