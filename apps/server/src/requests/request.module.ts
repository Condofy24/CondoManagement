import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { RequestSchema } from './entities/request.entity';
import { UnitModule } from '../unit/unit.module';
import { UserModule } from '../user/user.module';
import { BuildingModule } from '../building/building.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Request', schema: RequestSchema }]),
    forwardRef(() => UnitModule),
    UserModule,
    BuildingModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
