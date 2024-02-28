import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SignInDto } from './dto/signin.dto';
import { UnauthorizedException } from '@nestjs/common';

const newAuthTestData: SignInDto = {
  email: 'email',
  password: 'password',
};

const userServiceMock = {
  signIn: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('singIn', () => {
    it('should forward call to auth service', () => {
      // Arrange
      userServiceMock.signIn.mockResolvedValue(newAuthTestData);

      // Act and Assert
      expect(authController.signIn(newAuthTestData)).resolves.toEqual({
        ...newAuthTestData,
      });
    });

    it('should not swallow exception if user service throws an exception', async () => {
      // Arrange
      userServiceMock.signIn.mockRejectedValue(new UnauthorizedException());

      // Act and Assert
      await expect(authController.signIn(newAuthTestData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
