import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitSchema } from './entities/unit.entity';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { VerfModule } from '../verf/verf.module';
import { BuildingModule } from '../building/building.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Unit', schema: UnitSchema }]),
    VerfModule,
    BuildingModule,
  ],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService, UnitModule],
})
export class UnitModule {}
