import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParkingSchema } from './entities/parking.entity';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { BuildingModule } from '../building/building.module';
import { UnitModule } from 'src/unit/unit.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Parking', schema: ParkingSchema }]),
    BuildingModule,
    UnitModule,
  ],
  controllers: [ParkingController],
  providers: [ParkingService],
  exports: [ParkingService, ParkingModule],
})
export class ParkingModule {}
