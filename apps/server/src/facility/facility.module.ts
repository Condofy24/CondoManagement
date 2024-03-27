import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilitySchema } from './entities/facilities.entity';
import { FacilityController } from './facility.controller';
import { FacilityService } from './facility.service';
import { BuildingModule } from '../building/building.module';
import { UserModule } from '../user/user.module';
import { FacilityAvailabilitySchema } from './entities/availability.entity';

/**
 * Module for managing facilities.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Facility', schema: FacilitySchema },
      { name: 'FacilityAvailability', schema: FacilityAvailabilitySchema },
    ]),
    BuildingModule,
    forwardRef(() => UserModule),
  ],
  controllers: [FacilityController],
  providers: [FacilityService],
  exports: [FacilityService, FacilityModule],
})
export class FacilityModule {}
