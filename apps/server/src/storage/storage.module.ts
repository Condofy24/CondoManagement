import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageSchema } from './entities/storage.entity';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { BuildingModule } from '../building/building.module';
import { UnitModule } from '../unit/unit.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Storage', schema: StorageSchema }]),
    BuildingModule,
    UnitModule,
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService, StorageModule],
})
export class StorageModule {}
