import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationKeySchema } from './entities/verf.entity';
import { VerfService } from './verf.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'VerificationKey', schema: VerificationKeySchema },
    ]),
  ],
  providers: [VerfService],
  exports: [VerfService, VerfModule],
})
export class VerfModule {}
