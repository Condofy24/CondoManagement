import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildingSchema } from './entities/building.entity';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';
import { CloudinaryModule } from '../user/cloudinary/cloudinary.module';
import { CompanyModule } from '../company/company.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Building', schema: BuildingSchema }]),
    CompanyModule,
    CloudinaryModule,
  ],
  controllers: [BuildingController],
  providers: [BuildingService],
  exports: [BuildingService, BuildingModule],
})
export class BuildingModule {}
