import { Module, forwardRef } from '@nestjs/common';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';
import { CloudinaryModule } from '../user/cloudinary/cloudinary.module';
import { CompanyModule } from '../company/company.module';
import { UnitModule } from '../unit/unit.module';
import { ParkingModule } from '../parking/parking.module';
import { StorageModule } from '../storage/storage.module';
import { UserModule } from 'src/user/user.module';
import { BuildingSchema } from './entities/building.entity';
import { MongooseModule } from '@nestjs/mongoose';

/**
 * Module for managing buildings.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Building', schema: BuildingSchema }]),
    CompanyModule,
    CloudinaryModule,
    forwardRef(() => UserModule),
    forwardRef(() => UnitModule),
    ParkingModule,
    StorageModule,
  ],
  controllers: [BuildingController],
  providers: [BuildingService],
  exports: [BuildingService, BuildingModule],
})
export class BuildingModule {}
