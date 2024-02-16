import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildingSchema } from './entities/building.entity';
import {BuildingController} from './building.controller';
import {BuildingService} from './building.service';
import { CloudinaryModule } from 'src/user/cloudinary/cloudinary.module';
import { CompanyModule } from 'src/company/company.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Building', schema: BuildingSchema }]),
    CloudinaryModule,
    CompanyModule
  ],
  controllers: [BuildingController],
  providers: [BuildingService],
  exports: [BuildingService, BuildingModule],
})
export class BuildingModule {}
