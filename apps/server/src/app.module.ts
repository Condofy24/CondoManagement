import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
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
import { ConfigModule } from '@nestjs/config';
import { FacilityController } from './facility/facility.controller';
import { FacilityModule } from './facility/facility.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_CONNECTION_URI ||
        'mongodb+srv://capstone:marioisgay@condofy.drswlo1.mongodb.net/dev?retryWrites=true&w=majority', // TODO: Move password to env
    ),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    CompanyModule,
    CloudinaryModule,
    BuildingModule,
    UnitModule,
    FacilityModule,
    ParkingModule,
    StorageModule,
  ],
  controllers: [
    AppController,
    UserController,
    AuthController,
    BuildingController,
    FacilityController,
    UnitController,
    ParkingController,
    StorageController,
  ],
  providers: [AppService],
})
export class AppModule {}
