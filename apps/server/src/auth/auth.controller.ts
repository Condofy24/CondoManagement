import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import {
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SignInModel } from './models/sign-in.model';

/**
 * Controller responsible for handling authentication-related requests.
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint for user login.
   * @param signInDto - The DTO containing user credentials.
   * @returns The result of the login operation.
   */
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.UNAUTHORIZED)
  @Post('login')
  @ApiOkResponse({ description: 'User authenticated', type: SignInModel })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
