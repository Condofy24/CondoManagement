import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanySchema } from './entities/company.entity';
import { CompanyService } from './company.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
  ],
  providers: [CompanyService],
  exports: [CompanyService, CompanyModule],
})
export class CompanyModule {}
