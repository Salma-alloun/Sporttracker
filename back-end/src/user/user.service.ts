// src/user/user.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository ,Not, IsNull} from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    let age = createUserDto.age;
    if (createUserDto.birthDate && !age) {
      age = this.calculateAge(new Date(createUserDto.birthDate));
    }

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      age: age,
    });

    const savedUser = await this.userRepository.save(user);
    return new UserResponseDto(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map(user => new UserResponseDto(user));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return new UserResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    if (updateUserDto.birthDate) {
      updateUserDto.age = this.calculateAge(new Date(updateUserDto.birthDate));
    }

    Object.assign(user, updateUserDto);
    const savedUser = await this.userRepository.save(user);
    
    // ✅ Notification de modification de profil (seulement si token existe)
    if (user.expoPushToken) {
      await this.notificationService.sendNotification(
        user.expoPushToken,
        '👤 Profil modifié',
        'Vos informations ont été mises à jour avec succès',
        { type: 'profile_update', userId: user.id }
      );
    }
    
    return new UserResponseDto(savedUser);
  }

  async updateStats(userId: number, distance: number, duration: number, calories: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.totalActivities += 1;
      user.totalDistance += distance / 1000;
      user.totalDuration += duration;
      user.lastActive = new Date();
      await this.userRepository.save(user);
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.remove(user);
  }

  // ✅ Mettre à jour le token push (CORRIGÉ)
  async updatePushToken(userId: number, pushToken: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    user.expoPushToken = pushToken;
    const savedUser = await this.userRepository.save(user);
    console.log(`✅ Token push enregistré pour user ${userId}`);
    
    return savedUser;
  }

  // ✅ Envoyer un conseil nutritionnel personnalisé
  async sendNutritionAdvice(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      console.log(`❌ User ${userId} non trouvé`);
      return;
    }

    if (!user.expoPushToken) {
      console.log(`❌ User ${userId} n'a pas de token push`);
      return;
    }

    let advice = '';
    let title = '🥗 Conseil nutrition';
    
    if (user.goals?.includes('Perdre du poids')) {
      advice = 'Privilégiez les protéines et les légumes. Évitez les sucres rapides. Buvez beaucoup d\'eau avant les repas.';
    } else if (user.goals?.includes('Gagner en muscle')) {
      advice = 'Augmentez votre apport en protéines (poulet, œufs, poisson). Pensez aux féculents avant l\'entraînement.';
    } else if (user.goals?.includes('Améliorer endurance')) {
      advice = 'Consommez des glucides complexes (pâtes, riz complet) avant l\'effort. Hydratez-vous régulièrement.';
    } else {
      advice = 'Maintenez une alimentation équilibrée. Hydratez-vous avant, pendant et après l\'effort.';
    }
    
    if (user.sport === 'Course') {
      advice += ' Pour la course, privilégiez les glucides complexes la veille et une collation 1h avant.';
    } else if (user.sport === 'Natation') {
      advice += ' La natation dépense beaucoup d\'énergie. Pensez à manger une collation riche en glucides avant.';
    } else if (user.sport === 'Vélo') {
      advice += ' Pour le vélo, emportez des barres énergétiques pour les longues distances.';
    }
    
    if (user.age && user.age > 50) {
      advice += ' N\'oubliez pas de consulter un médecin avant de modifier votre alimentation.';
    }
    
    await this.notificationService.sendNotification(
      user.expoPushToken,
      title,
      advice,
      { type: 'nutrition_advice', userId: user.id }
    );
    
    console.log(`✅ Conseil nutrition envoyé à user ${userId}`);
  }

  // ✅ CORRIGÉ: findAllWithPushTokens pour TypeORM (pas Prisma)
  // ✅ Alternative avec QueryBuilder
// src/user/user.service.ts
async findAllWithPushTokens(): Promise<{ id: number; expoPushToken: string; name: string }[]> {
  try {
    // ✅ Récupérer TOUS les utilisateurs qui ont un token (n'importe lequel)
    const users = await this.userRepository.find({
      where: {
        expoPushToken: Not(IsNull())
      },
      select: ['id', 'expoPushToken', 'name'],
    });
    
    console.log(`📊 Utilisateurs avec token trouvés: ${users.length}`);
    
    // ✅ Ne plus filtrer par "ExponentPushToken" - accepter tous les tokens
    const validUsers = users.filter(user => 
      user.expoPushToken !== null && 
      user.expoPushToken !== ''
    );
    
    console.log(`📊 Utilisateurs valides: ${validUsers.length}`);
    
    validUsers.forEach(user => {
      console.log(`📱 User ${user.id}: ${user.expoPushToken?.substring(0, 30)}...`);
    });
    
    return validUsers.map(user => ({
      id: user.id,
      expoPushToken: user.expoPushToken!,
      name: user.name,
    }));
  } catch (error) {
    console.error('❌ Erreur findAllWithPushTokens:', error);
    return [];
  }
}
}