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
import { UserService } from 'src/user/user.service';
import { UserRolesEnum } from '../user/user.model'

const extractTokenFromHeader = (request: Request): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

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


// TODO: UPDATE THIS CLASS TO HANDLE MANY DIFFERENT PRIVILEGES
@Injectable()
export class PrivilegeGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request)
    const token = extractTokenFromHeader(request);
    if (!token) {
      console.log("here")
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
      console.log("here2")
      throw new UnauthorizedException();
    }
    return (
      (await this.userService.getPrivilege(request.user.sub)) ===
      this.reflector.get(Roles, context.getHandler())
    );
  }
}
