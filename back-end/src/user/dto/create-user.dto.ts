import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, IsArray, IsObject, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';  // ← AJOUTE CETTE LIGNE
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  sport?: string;

  @IsOptional()
  @IsEnum(['Homme', 'Femme', 'Autre'])
  gender?: string;

  @IsOptional()
  @IsString()
  activityLevel?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)  // ← AJOUTE CETTE LIGNE
  birthDate?: Date;

  @IsOptional()
  @IsString()
  goals?: string;

  @IsOptional()
  @IsString()
  medicalConditions?: string;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsArray()
  favoriteSports?: string[];

  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;

  @IsOptional()
  @IsString()
  expoPushToken?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}