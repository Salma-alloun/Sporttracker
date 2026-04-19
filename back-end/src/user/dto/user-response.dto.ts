import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  sport?: string;
  gender?: string;
  activityLevel?: string;
  age?: number;
  weight?: number;
  height?: number;
  birthDate?: Date;
  goals?: string;
  medicalConditions?: string;
  isEmailVerified: boolean;
  favoriteSports: string[];
  totalActivities: number;
  totalDistance: number;
  totalDuration: number;
  lastActive?: Date;
  preferences: Record<string, any>;
  expoPushToken?: string;
  lastNotificationSent?: Date;
  role: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}