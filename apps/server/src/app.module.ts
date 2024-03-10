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
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { BuildingModule } from './building/building.module';
import { BuildingController } from './building/building.controller';
import { UnitModule } from './unit/unit.module';
import { UnitController } from './unit/unit.controller';
import { ParkingModule } from './parking/parking.module';
import { ParkingController } from './parking/parking.controller';
import { StorageModule } from './storage/storage.module';
import { StorageController } from './storage/storage.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://capstone:marioisgay@condofy.drswlo1.mongodb.net/dev?retryWrites=true&w=majority', // TODO: Move password to env
    ),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    CompanyModule,
    CloudinaryModule,
    BuildingModule,
    UnitModule,
    ParkingModule,
    StorageModule,
  ],
  controllers: [
    AppController,
    UserController,
    AuthController,
    CompanyController,
    BuildingController,
    UnitController,
    ParkingController,
    StorageController,
  ],
  providers: [AppService],
})
export class AppModule {}
