import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CompanyController } from './company/company.controller';
import { CompanyModule } from './company/company.module';
import { CloudinaryModule } from './user/cloudinary/cloudinary.module';
import { BuildingModule } from './building/building.module';
import { BuildingController } from './building/building.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://capstone:marioisgay@condofy.drswlo1.mongodb.net/?retryWrites=true&w=majority', // TODO: Move password to env
    ),
    UserModule,
    AuthModule,
    CompanyModule,
    CloudinaryModule,
    BuildingModule,
  ],
  controllers: [
    AppController,
    UserController,
    AuthController,
    CompanyController,
    BuildingController,
  ],
  providers: [AppService],
})
export class AppModule {}
