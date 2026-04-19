// backend/src/notification/notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

@Injectable()
export class NotificationService {
  private expo = new Expo();
  private readonly logger = new Logger(NotificationService.name);

  async sendNotification(
    to: string,
    title: string,
    body: string,
    data?: any,
  ): Promise<boolean> {
    if (!Expo.isExpoPushToken(to)) {
      this.logger.error(`Push token ${to} is not a valid Expo push token`);
      return false;
    }

    const messages: ExpoPushMessage[] = [
      {
        to,
        sound: 'default',
        title,
        body,
        data: data || {},
      },
    ];

    const chunks = this.expo.chunkPushNotifications(messages);
    let success = false;

    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        this.logger.log(`Ticket reçu: ${JSON.stringify(ticketChunk)}`);
        success = true;
      } catch (error) {
        this.logger.error('Erreur lors de l\'envoi de la notification', error);
        success = false;
      }
    }

    this.logger.log(`Notification envoyée à ${to}: ${title}`);
    return success;
  }

  async sendBulkNotifications(
    tokens: string[],
    title: string,
    body: string,
    data?: any,
  ): Promise<void> {
    const validTokens = tokens.filter(token => Expo.isExpoPushToken(token));
    
    if (validTokens.length === 0) {
      this.logger.warn('Aucun token valide trouvé');
      return;
    }

    const messages: ExpoPushMessage[] = validTokens.map(to => ({
      to,
      sound: 'default',
      title,
      body,
      data: data || {},
    }));

    const chunks = this.expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        const tickets = await this.expo.sendPushNotificationsAsync(chunk);
        this.logger.log(`${tickets.length} notifications envoyées`);
      } catch (error) {
        this.logger.error('Erreur lors de l\'envoi groupé', error);
      }
    }
  }
}