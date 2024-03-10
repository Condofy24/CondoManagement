import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Roles } from './decorators/roles.decorator';
import { UserService } from '../user/user.service';
import { BuildingService } from '../building/building.service';

const extractTokenFromHeader = (request: Request): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * Determines whether the request is authorized.
   * @param context - The execution context.
   * @returns A boolean indicating whether the request is authorized.
   * @throws UnauthorizedException if the request is not authorized.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9', // TODO: move new to env file
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}

@Injectable()
export class PrivilegeGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private reflector: Reflector,
    private buildingService: BuildingService,
  ) {}

  /**
   * Determines whether the request has the required privilege.
   * @param context - The execution context.
   * @returns A boolean indicating whether the request has the required privilege.
   * @throws UnauthorizedException if the request does not have the required privilege.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9', // TODO: move new to env file
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findUserById(request.user.sub);
    const params = request?.params;
    if (user?.role === 0) {
      if (params?.buildingId) {
        // Accessing building
        const building = await this.buildingService.findBuildingById(
          params?.buildingId,
        );
        return (
          user?.role === this.reflector.get(Roles, context.getHandler()) &&
          user?.companyId === building?.companyId.toString()
        );
      } else if (params?.companyId) {
        return (
          user?.role === this.reflector.get(Roles, context.getHandler()) &&
          user?.companyId === params?.companyId
        );
      }
    }
    return user?.role === this.reflector.get(Roles, context.getHandler());
  }
}
