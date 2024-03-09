import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../user/models/user.model';
import { UserEntity } from '../user/entities/user.entity';
jest.mock('bcrypt');

const userTestData = {
  email: 'Bob@example.com',
  id: '1',
  name: 'Test User',
  password: 'thebuilder',
  role: 4, //'user',
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
  findUserByEmail: jest.fn(),
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
      userServiceMock.findUserByEmail.mockResolvedValueOnce(userTestData);
      jwtServiceMock.signAsync.mockResolvedValueOnce(jwtTokenTestData);

      // Act
      const result = await authService.signIn(signInDtoTestData);

      // Assert
      expect(result).toBeDefined();
      expect(result.token).toBe(jwtTokenTestData);
      expect(result.user).toMatchObject(
        new UserModel(userTestData as unknown as UserEntity),
      );
      expect(userServiceMock.findUserByEmail).toHaveBeenCalledWith(
        signInDtoTestData.email,
      );
      expect(jwtServiceMock.signAsync).toHaveBeenCalled();
    });

    it('should throw exception for invalid password', async () => {
      // Arrange
      (bcrypt.compareSync as jest.Mock).mockReturnValueOnce(false);
      userServiceMock.findUserByEmail.mockResolvedValueOnce(userTestData);

      // Act & Assert
      await expect(authService.signIn(signInDtoTestData)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw exception for invalid email', async () => {
      // Arrange
      userServiceMock.findUserByEmail.mockResolvedValueOnce(null);

      // Act & Assert
      await expect(authService.signIn(signInDtoTestData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
