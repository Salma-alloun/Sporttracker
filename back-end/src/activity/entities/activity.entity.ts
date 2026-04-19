import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'varchar', length: 50 })
  sport: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'int', default: 0 })
  duration: number;

  @Column({ type: 'float', default: 0 })
  distance: number;

  @Column({ type: 'float', default: 0 })
  averageSpeed: number;

  @Column({ type: 'int', default: 0 })
  calories: number;

  @Column({ type: 'boolean', default: true })
  isCompleted: boolean;

  @Column({ type: 'json', default: [] })
  route: Array<{ latitude: number; longitude: number; timestamp: number }>;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.activities)
  @JoinColumn({ name: 'userId' })
  user: User;
}