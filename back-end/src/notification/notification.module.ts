// src/notification/notification.module.ts
import { Module, forwardRef } from '@nestjs/common'; // ← AJOUTER forwardRef
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { UserModule } from '../user/user.module';
import { FcmService } from './fcm.service';
@Module({
  imports: [forwardRef(() => UserModule)], // ← UTILISER forwardRef
  controllers: [NotificationController],
  providers: [NotificationService, FcmService],
  exports: [NotificationService, FcmService],
})
export class NotificationModule {}