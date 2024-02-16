import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitSchema } from './entities/unit.entity';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { VerfService } from 'src/verf/verf.service';
import { VerfModule } from 'src/verf/verf.module';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Unit', schema: UnitSchema }]),VerfModule],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService, UnitModule],
})
export class UnitModule {}
