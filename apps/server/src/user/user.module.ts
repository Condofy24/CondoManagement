import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { IsValidRole } from './user.validators';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    CloudinaryModule,
    CompanyModule,
  ],
  controllers: [UserController],
  providers: [UserService, IsValidRole],
  exports: [UserService, UserModule],
})
export class UserModule {}
