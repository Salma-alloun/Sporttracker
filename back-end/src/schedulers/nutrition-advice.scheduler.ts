import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from '../user/user.service';
import { FcmService } from '../notification/fcm.service';

@Injectable()
export class NutritionAdviceScheduler {
  private readonly logger = new Logger(NutritionAdviceScheduler.name);

  private readonly nutritionTips = [
  // Originales
  { title: '🥗 Conseil nutrition', body: 'Pensez à boire 2L d\'eau par jour pour rester hydraté !' },
  { title: '🍎 Conseil nutrition', body: 'Les fruits et légumes sont riches en nutriments essentiels.' },
  
  // Nouvelles notifications
  { title: '💪 Conseil nutrition', body: 'Les protéines aident à la récupération musculaire après le sport.' },
  { title: '🌙 Conseil nutrition', body: 'Un dîner léger améliore la qualité de votre sommeil.' },
  { title: '🍌 Conseil nutrition', body: 'La banane est excellente avant une séance de sport !' },
  { title: '🥑 Conseil nutrition', body: 'Les bonnes graisses (avocat, noix, oléagineux) sont essentielles.' },
  { title: '⏰ Conseil nutrition', body: 'Mangez à heures régulières pour stabiliser votre métabolisme.' },
  { title: '🥤 Conseil nutrition', body: 'Évitez les sodas, préférez l\'eau ou les thés non sucrés.' },
  { title: '🥦 Conseil nutrition', body: 'Les légumes verts sont riches en fer et en vitamines.' },
  { title: '🐟 Conseil nutrition', body: 'Le poisson gras (saumon, sardine) est riche en oméga-3.' },
  { title: '🍠 Conseil nutrition', body: 'Les glucides complexes (patate douce, riz complet) donnent de l\'énergie durable.' },
  { title: '🥚 Conseil nutrition', body: 'Les œufs sont une excellente source de protéines et de vitamines B.' },
  { title: '🍯 Conseil nutrition', body: 'Remplacez le sucre raffiné par du miel ou du sirop d\'érable.' },
  { title: '🥜 Conseil nutrition', body: 'Une poignée de noix par jour pour les bonnes graisses.' },
  { title: '🍊 Conseil nutrition', body: 'Les agrumes sont riches en vitamine C pour renforcer l\'immunité.' },
  { title: '🥛 Conseil nutrition', body: 'Les produits laitiers ou alternatives végétales apportent du calcium.' },
  { title: '🍚 Conseil nutrition', body: 'Privilégiez les céréales complètes pour plus de fibres.' },
  { title: '🥗 Conseil nutrition', body: 'Variez les couleurs dans votre assiette pour plus de nutriments.' },
  { title: '🍫 Conseil nutrition', body: 'Le chocolat noir à 70% minimum est un antioxydant puissant.' },
  { title: '🍵 Conseil nutrition', body: 'Le thé vert aide à brûler les graisses et à se concentrer.' },
];

  constructor(
    private readonly userService: UserService,
    private readonly fcmService: FcmService,
  ) {}

  @Cron('*/1 * * * *')
  async sendNutritionAdviceTest() {
    this.logger.log('🕐 Envoi des conseils nutritionnels');
    
    try {
      const users = await this.userService.findAllWithPushTokens();
      
      if (!users || users.length === 0) {
        this.logger.warn('Aucun utilisateur avec token');
        return;
      }

      const randomTip = this.nutritionTips[
        Math.floor(Math.random() * this.nutritionTips.length)
      ];

      for (const user of users) {
        await this.fcmService.sendPushNotification(
          user.expoPushToken,
          randomTip.title,
          randomTip.body,
          { type: 'nutrition_advice', userId: user.id }
        );
      }
      
      this.logger.log('✅ Conseils envoyés');
    } catch (error) {
      this.logger.error('❌ Erreur:', error);
    }
  }
}