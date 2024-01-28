import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

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
// @Injectable()
// export class PrivilegeGuard implements CanActivate {
//   constructor(
//     private jwtService: JwtService,
//     private userService: UserService,
//   ) {}
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const token = extractTokenFromHeader(request);
//     if (!token) {
//       throw new UnauthorizedException();
//     }
//     try {
//       const payload = await this.jwtService.verifyAsync(token, {
//         secret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9', // TODO: move new to env file
//       });
//       // 💡 We're assigning the payload to the request object here
//       // so that we can access it in our route handlers
//       request['user'] = payload;
//     } catch {
//       throw new UnauthorizedException();
//     }
//     return (
//       (await this.userService.getPrivilege(request.user.sub)) ===
//       UserRolesEnum.MANAGER
//     );
//   }
// }
