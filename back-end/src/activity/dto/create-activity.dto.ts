// src/activity/dto/create-activity.dto.ts
import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsObject, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActivityDto {
  @IsNumber()
  userId: number;

  @IsString()
  @MinLength(2)
  sport: string;

  @IsNumber()
  @Min(0)
  duration: number;

  @IsNumber()
  @Min(0)
  distance: number;

  @IsNumber()
  @Min(0)
  averageSpeed: number;

  @IsNumber()
  @Min(0)
  calories: number;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  route?: Array<{ latitude: number; longitude: number; timestamp: number }>;

  @IsOptional()
  @Type(() => Date)
  startTime?: Date;

  @IsOptional()
  @Type(() => Date)
  endTime?: Date;
}