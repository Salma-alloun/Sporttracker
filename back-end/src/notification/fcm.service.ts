import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);
  private isInitialized = false;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (admin.apps.length === 0 && !this.isInitialized) {
      try {
        const serviceAccountPath = path.join(__dirname, '../..', 'serviceAccountKey.json');
        
        this.logger.log(`📁 Chargement clé depuis: ${serviceAccountPath}`);
        
        const serviceAccount = require(serviceAccountPath);
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        
        this.isInitialized = true;
        this.logger.log('✅ Firebase Admin SDK initialisé avec succès');
      } catch (error) {
        this.logger.error('❌ Erreur initialisation Firebase:', error.message);
      }
    }
  }

  async sendPushNotification(
    pushToken: string,
    title: string,
    body: string,
    data?: any,
  ): Promise<boolean> {
    if (!this.isInitialized) {
      this.logger.error('Firebase non initialisé');
      return false;
    }

    try {
      // ✅ Vérifier si le token est valide
      if (!pushToken || pushToken === '') {
        this.logger.error('Token vide');
        return false;
      }

      // ✅ Si c'est un token Expo, le rejeter
      if (pushToken.startsWith('ExponentPushToken')) {
        this.logger.error('Token Expo détecté - utilisez getDevicePushTokenAsync() au lieu de getExpoPushTokenAsync()');
        return false;
      }

      this.logger.log(`📤 Envoi FCM à: ${pushToken.substring(0, 30)}...`);

      const message: admin.messaging.Message = {
        notification: {
          title,
          body,
        },
        data: data ? this.convertToFirebaseData(data) : undefined,
        token: pushToken, // ✅ Utiliser le token directement
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`✅ Notification FCM envoyée: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Erreur envoi FCM: ${error.message}`);
      return false;
    }
  }

  private convertToFirebaseData(data: any): { [key: string]: string } {
    const firebaseData: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(data)) {
      firebaseData[key] = String(value);
    }
    return firebaseData;
  }
}