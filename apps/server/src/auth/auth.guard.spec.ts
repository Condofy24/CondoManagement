import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Reflector } from '@nestjs/core';
import { AuthGuard, PrivilegeGuard } from './auth.guard';
import { BuildingService } from '../building/building.service';

const jwtServiceMock = {
  verifyAsync: jest.fn().mockResolvedValue({ sub: 'user123' }),
};

const userServiceMock = {
  getPrivilege: jest.fn().mockResolvedValue(0),
  findById: jest
    .fn()
    .mockResolvedValue({ id: 'user123', companyId: 'company-id', role: 0 }),
};

const reflectorMock = {
  get: jest.fn().mockReturnValue(0),
};

const buildingServiceMock = {
  findOne: jest.fn(),
};

describe('PrivilegeGuard', () => {
  let privilegeGuard: PrivilegeGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PrivilegeGuard,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        { provide: BuildingService, useValue: buildingServiceMock },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: Reflector,
          useValue: reflectorMock,
        },
      ],
    }).compile();

    privilegeGuard = moduleRef.get<PrivilegeGuard>(PrivilegeGuard);
  });

  it('should allow access for valid privileges', async () => {
    // Arrange
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer valid.token.here' },
          params: { companyId: 'company-id' },
        }),
      }),
      getHandler: () => ({}),
    } as unknown as ExecutionContext;

    // Act & Assert
    await expect(
      privilegeGuard.canActivate(mockExecutionContext),
    ).resolves.toBeTruthy();
  });

  it('should allow access for public users', async () => {
    // Arrange
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer valid.token.here' },
        }),
      }),
      getHandler: () => ({}),
    } as unknown as ExecutionContext;

    // Act & Assert
    await expect(
      privilegeGuard.canActivate(mockExecutionContext),
    ).resolves.toBeTruthy();
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    // Arrange
    jwtServiceMock.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer invalid.token.here' },
        }),
      }),
    } as unknown as ExecutionContext;

    // Act & Assert
    await expect(
      privilegeGuard.canActivate(mockExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });
});

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as ExecutionContext;

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token verification fails', async () => {
    // Arrange
    jwtServiceMock.verifyAsync.mockRejectedValue(new Error('Token invalid'));

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalidtoken',
          },
        }),
      }),
    } as ExecutionContext;

    // Act & Assert
    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return true if token is valid', async () => {
    // Arrange
    jwtServiceMock.verifyAsync.mockResolvedValue({ userId: 1 });

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer validtoken',
          },
        }),
      }),
    } as ExecutionContext;

    // Act & Assert
    await expect(authGuard.canActivate(context)).resolves.toBe(true);
  });
});
