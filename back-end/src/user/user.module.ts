// src/user/user.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { NotificationModule } from '../notification/notification.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]),
  forwardRef(() => NotificationModule),
],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],  // ← Assure-toi que cette ligne existe
})
export class UserModule {}  // ← Le nom doit être exactement "UserModule"