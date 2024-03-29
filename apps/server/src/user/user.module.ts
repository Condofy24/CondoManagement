import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { IsValidRole } from './user.validators';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CompanyModule } from '../company/company.module';
import { UnitModule } from '../unit/unit.module';
import { BuildingModule } from '../building/building.module';
import { RequestModule } from 'src/requests/request.module';

/**
 * Module for managing users in the application.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    CloudinaryModule,
    CompanyModule,
    BuildingModule,
    UnitModule,
    RequestModule,
  ],
  controllers: [UserController],
  providers: [UserService, IsValidRole],
  exports: [UserService, UserModule],
})
export class UserModule {}
