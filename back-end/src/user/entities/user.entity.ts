import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Activity } from '../../activity/entities/activity.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  sport: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  activityLevel: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'text', nullable: true })
  goals: string;

  @Column({ type: 'text', nullable: true })
  medicalConditions: string;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'simple-array', default: '' })
  favoriteSports: string[];

  @Column({ type: 'int', default: 0 })
  totalActivities: number;

  @Column({ type: 'float', default: 0 })
  totalDistance: number;

  @Column({ type: 'int', default: 0 })
  totalDuration: number;

  @Column({ type: 'timestamp', nullable: true })
  lastActive: Date;

  @Column({ type: 'json', default: {} })
  preferences: Record<string, any>;

  @Column({ type: 'varchar', nullable: true })
  expoPushToken: string;

  @Column({ type: 'timestamp', nullable: true })
  lastNotificationSent: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];
}