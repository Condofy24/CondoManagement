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
    if (user && compareSync(password, user?.password)) {
      const payload = { sub: user.id }; // name the user id sub per jwt conventions
      const userInfo: UserDto = {
        email,
        id: user.id,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        imageUrl: user.imageUrl,
        imageId: user.imageId,
      };
      return {
        token: await this.jwtService.signAsync(payload),
        user: userInfo,
      };
    }

    throw new UnauthorizedException();
  }

  test() {
    return 'IN';
  }
}
