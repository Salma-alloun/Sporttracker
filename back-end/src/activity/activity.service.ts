// src/activity/activity.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<ActivityResponseDto> {
    const activity = this.activityRepository.create({
      ...createActivityDto,
      startTime: createActivityDto.startTime || new Date(),
      endTime: createActivityDto.endTime || new Date(),
    });
    
    const savedActivity = await this.activityRepository.save(activity);

    // Mettre à jour les statistiques de l'utilisateur
    await this.userService.updateStats(
      createActivityDto.userId,
      createActivityDto.distance,
      createActivityDto.duration,
      createActivityDto.calories,
    );

    // ✅ Notification de début d'activité
    const user = await this.userService.findOne(createActivityDto.userId);
    if (user.expoPushToken) {
      await this.notificationService.sendNotification(
        user.expoPushToken,
        '🏁 Activité démarrée',
        `Vous avez commencé une séance de ${createActivityDto.sport}`,
        { type: 'activity_start', sport: createActivityDto.sport }
      );
    }

    return new ActivityResponseDto(savedActivity);
  }

  async findAllByUser(userId: number): Promise<ActivityResponseDto[]> {
    const activities = await this.activityRepository.find({
      where: { userId },
      order: { startTime: 'DESC' },
    });
    return activities.map(activity => new ActivityResponseDto(activity));
  }

  async findOne(id: number): Promise<ActivityResponseDto> {
    const activity = await this.activityRepository.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return new ActivityResponseDto(activity);
  }

  async getStats(userId: number): Promise<any> {
    const activities = await this.activityRepository.find({ where: { userId } });
    
    const totalActivities = activities.length;
    const totalDistance = activities.reduce((sum, a) => sum + a.distance, 0) / 1000;
    const totalDurationSeconds = activities.reduce((sum, a) => sum + a.duration, 0);
    const totalHours = Math.floor(totalDurationSeconds / 3600);
    const totalMinutes = Math.floor((totalDurationSeconds % 3600) / 60);
    const totalDuration = `${totalHours}h ${totalMinutes}min`;
    const avgCalories = totalActivities > 0 ? Math.round(activities.reduce((sum, a) => sum + a.calories, 0) / totalActivities) : 0;
    const avgSpeed = totalActivities > 0 ? (activities.reduce((sum, a) => sum + a.averageSpeed, 0) / totalActivities).toFixed(1) : '0';
    
    const sportCount: Record<string, number> = {};
    activities.forEach(a => {
      sportCount[a.sport] = (sportCount[a.sport] || 0) + 1;
    });
    const favoriteSport = Object.keys(sportCount).length > 0 
      ? Object.keys(sportCount).reduce((a, b) => sportCount[a] > sportCount[b] ? a : b)
      : 'Aucun';

    return {
      totalActivities,
      totalDistance: totalDistance.toFixed(1),
      totalDuration,
      avgCalories,
      avgSpeed,
      favoriteSport,
      hasActivities: totalActivities > 0,
    };
  }

  async remove(id: number): Promise<void> {
    const activity = await this.activityRepository.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    await this.activityRepository.remove(activity);
  }
}