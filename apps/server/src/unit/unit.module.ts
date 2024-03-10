import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitSchema } from './entities/unit.entity';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { BuildingModule } from '../building/building.module';
import { UserModule } from '../user/user.module';
import { RegistrationKeySchema } from './entities/registration-key.entity';
import { PaymentsSchema } from './entities/payments.entity';
import { ParkingModule } from 'src/parking/parking.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Unit', schema: UnitSchema },
      { name: 'RegistrationKey', schema: RegistrationKeySchema },
      { name: 'Payments', schema: PaymentsSchema },
    ]),
    forwardRef(() => BuildingModule),
    forwardRef(() => UserModule),
    ParkingModule,
  ],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService, UnitModule],
})
export class UnitModule {}
