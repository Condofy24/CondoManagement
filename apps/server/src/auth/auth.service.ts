import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { UserDto } from '../user/dto/user.dto';

/**
 * Service responsible for handling authentication-related operations.
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user based on the provided credentials.
   *
   * @param {SignInDto} signInDto - The sign-in data containing email and password.
   * @returns {Promise<any>} - An object containing the JWT token and user information.
   * @throws {UnauthorizedException} - If the provided credentials are invalid.
   */
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
}
