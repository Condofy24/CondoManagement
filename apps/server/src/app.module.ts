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
import { UnitModule } from './unit/unit.module';
import { UnitController } from './unit/unit.controller';
import { ParkingModule } from './parking/parking.modules';
import { ParkingController } from './parking/parking.controller';

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
    UnitModule,
    ParkingModule
  ],
  controllers: [
    AppController,
    UserController,
    AuthController,
    CompanyController,
    BuildingController,
    UnitController,
    ParkingController
  ],
  providers: [AppService],
})
export class AppModule {}
