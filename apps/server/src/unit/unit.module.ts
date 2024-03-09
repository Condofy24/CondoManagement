import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UnitSchema } from './entities/unit.entity';
import { UnitController } from './unit.controller';
import { UnitService } from './unit.service';
import { BuildingModule } from '../building/building.module';
import { UserModule } from '../user/user.module';
import { RegistrationKeySchema } from './entities/registration-key.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Unit', schema: UnitSchema },
      { name: 'RegistrationKey', schema: RegistrationKeySchema },
    ]),
    forwardRef(() => BuildingModule),
    forwardRef(() => UserModule),
  ],
  controllers: [UnitController],
  providers: [UnitService],
  exports: [UnitService, UnitModule],
})
export class UnitModule {}
