import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signIn(signInDto: SignInDto): Promise<any> {
    const { email, password } = signInDto;

    const user = await this.userService.findOne(email);
    if (user && !compareSync(password, user?.password)) {
      throw new UnauthorizedException();
    }
    if (user) {
      const payload = { sub: user.id }; // name the user id sub per jwt conventions
      const userInfo: UserDto = {
        email,
        id: user.id,
        name: user.name,
        role: user.role,
      };
      return {
        token: await this.jwtService.signAsync(payload),
        user: userInfo,
      };
    }
  }
}
