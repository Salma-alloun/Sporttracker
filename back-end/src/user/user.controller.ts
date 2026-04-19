// src/user/user.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Request, ForbiddenException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('📝 Register request:', createUserDto.email);
    return this.userService.create(createUserDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(`📡 GET /users/${id}`);
    return this.userService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,
    @Request() req
  ) {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📡 PATCH /users/${id}`);
    console.log(`📦 Body reçu:`, updateUserDto);
    
    const tokenUserId = req.user?.sub || req.user?.userId || req.user?.id;
    
    if (tokenUserId && tokenUserId != id) {
      throw new ForbiddenException('Vous ne pouvez modifier que votre propre profil');
    }
    
    const result = await this.userService.update(id, updateUserDto);
    console.log(`✅ Mise à jour réussie pour l'utilisateur ${id}`);
    return result;
  }

  // ✅ Route avec validation désactivée via @UsePipes
  @UseGuards(AuthGuard('jwt'))
  @Patch('push-token')
  @UsePipes(new ValidationPipe({ whitelist: false, transform: false }))
  async updatePushToken(@Request() req, @Body() body: any) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 REQUÊTE PUSH-TOKEN REÇUE');
    console.log('📥 Body reçu:', body);
    
    const pushToken = body.pushToken;
    console.log('📥 pushToken extrait:', pushToken);
    
    // Extraire l'ID utilisateur du token JWT
    const userId = req.user?.sub || req.user?.userId || req.user?.id;
    console.log('📱 userId extrait du token:', userId, 'Type:', typeof userId);
    
    if (!pushToken) {
      return { success: false, message: 'pushToken requis' };
    }
    
    if (!userId) {
      return { success: false, message: 'Utilisateur non identifié' };
    }
    
    // Convertir en nombre
    const numericUserId = parseInt(userId, 10);
    console.log('📱 numericUserId:', numericUserId);
    
    const result = await this.userService.updatePushToken(numericUserId, pushToken);
    console.log('✅ Token push enregistré avec succès');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return { success: true, message: 'Token push enregistré', user: result };
  }

  // ✅ Route pour envoyer un conseil nutritionnel
  @UseGuards(AuthGuard('jwt'))
  @Post('nutrition-advice')
  async sendNutritionAdvice(@Request() req) {
    const userId = parseInt(req.user?.sub || req.user?.userId || req.user?.id, 10);
    console.log(`🥗 Demande de conseil nutrition pour user ${userId}`);
    await this.userService.sendNutritionAdvice(userId);
    return { success: true, message: 'Conseil nutritionnel envoyé' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    console.log(`📡 DELETE /users/${id}`);
    const tokenUserId = req.user?.sub || req.user?.userId || req.user?.id;
    
    if (tokenUserId && tokenUserId != id) {
      throw new ForbiddenException('Vous ne pouvez supprimer que votre propre profil');
    }
    return this.userService.remove(id);
  }
}