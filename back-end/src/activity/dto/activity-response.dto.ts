// src/activity/dto/activity-response.dto.ts
import { Exclude } from 'class-transformer';

export class ActivityResponseDto {
  id: number;
  userId: number;
  sport: string;
  startTime: Date;
  endTime: Date | null;
  duration: number;
  distance: number;
  averageSpeed: number;
  calories: number;
  isCompleted: boolean;
  route: Array<{ latitude: number; longitude: number; timestamp: number }>;
  createdAt: Date;

  // Champs formatés pour le frontend
  formattedDate?: string;
  formattedDuration?: string;
  formattedDistance?: string;

  constructor(partial: Partial<ActivityResponseDto>) {
    Object.assign(this, partial);
    
    // Formater la date
    if (this.startTime) {
      this.formattedDate = new Date(this.startTime).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
    
    // Formater la durée
    if (this.duration) {
      const hours = Math.floor(this.duration / 3600);
      const minutes = Math.floor((this.duration % 3600) / 60);
      this.formattedDuration = hours > 0 
        ? `${hours}h ${minutes}min` 
        : `${minutes}min`;
    }
    
    // Formater la distance
    if (this.distance) {
      this.formattedDistance = this.distance >= 1000 
        ? `${(this.distance / 1000).toFixed(2)} km` 
        : `${Math.round(this.distance)} m`;
    }
  }
}