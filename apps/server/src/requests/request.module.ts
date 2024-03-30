import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { RequestSchema } from './entities/request.entity';
import { UnitModule } from 'src/unit/unit.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Request', schema: RequestSchema }]),
    forwardRef(() => UnitModule),
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService, RequestModule],
})
export class RequestModule {}
