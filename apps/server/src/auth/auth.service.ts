import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { UserModel } from '../user/models/user.model';
import { SignInModel } from './models/sign-in.model';

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
  async signIn(signInDto: SignInDto): Promise<SignInModel> {
    const { email, password } = signInDto;

    const user = await this.userService.findUserByEmail(email);

    if (!user || !compareSync(password, user?.password))
      throw new UnauthorizedException({ message: 'Invalid credentials' });

    const payload = { sub: user._id }; // name the user id sub per jwt conventions

    return new SignInModel(
      await this.jwtService.signAsync(payload),
      new UserModel(user),
    );
  }
}
