import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilitySchema } from './entities/facilities.entity';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';

/**
 * Module for managing facilities.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Facility', schema: FacilitySchema }]),
  ],
  controllers: [FacilityController],
  providers: [FacilityService],
  exports: [FacilityService, FacilityModule],
})
export class FacilityModule {}
