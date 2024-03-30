import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { RequestSchema } from './entities/request.entity';
import { UnitModule } from 'src/unit/unit.module';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Request', schema: RequestSchema }]),
    forwardRef(() => UnitModule),
    UserModule,
  ],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService, RequestModule],
})
export class RequestModule {}
