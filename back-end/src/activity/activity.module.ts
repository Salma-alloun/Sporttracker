// src/activity/activity.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
@Module({
  imports: [TypeOrmModule.forFeature([Activity]), UserModule,
  NotificationModule,
],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}  // ← Le nom doit être exactement "ActivityModule"