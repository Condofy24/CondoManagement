import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

/**
 * Module responsible for handling authentication related functionality.
 */
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9', // TODO: Move new to env file
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
