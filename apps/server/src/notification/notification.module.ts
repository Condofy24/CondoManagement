import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UserModule } from '../user/user.module';
import { BuildingModule } from '../building/building.module';

@Module({
  imports: [forwardRef(() => UserModule), forwardRef(() => BuildingModule)],
  providers: [NotificationService],
  exports: [NotificationService, NotificationModule],
})
export class NotificationModule {}
