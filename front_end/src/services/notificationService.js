// front_end/src/services/notificationService.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/constants';

// ✅ CORRECTION 1: Remplacer shouldShowAlert par shouldShowBanner
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,  // ← MODIFIÉ (ancien: shouldShowAlert)
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Récupérer et enregistrer le token push
export const registerForPushNotificationsAsync = async () => {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('❌ Permission non accordée pour les notifications');
    return null;
  }

  try {
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'faad833e-369f-45d4-a46c-c0c942de7801',
    })).data;
    console.log('✅ Expo Push Token:', token);
  } catch (e) {
    console.log('❌ Erreur récupération token:', e);
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};

// Envoyer le token au backend
// front_end/src/services/notificationService.js
// Remplace UNIQUEMENT la fonction sendTokenToBackend par celle-ci :

export const sendTokenToBackend = async (token) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      console.log('❌ Pas de token utilisateur');
      return false;
    }

    console.log('📤 Envoi du token push au backend...');
    console.log('📤 Token complet:', token);
    console.log('📤 Longueur token:', token.length);
    
    const body = JSON.stringify({ pushToken: token });
    console.log('📤 Body envoyé:', body);
    
    const response = await fetch(`${API_URL}/notification/push-token`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: body,
    });

    console.log('📥 Statut réponse:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Token push enregistré sur le serveur:', data);
      return true;
    } else {
      const errorText = await response.text();
      console.log('❌ Erreur enregistrement token push:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur envoi token:', error);
    return false;
  }
};

// Configurer les écouteurs de notifications
export const setupNotificationListeners = (navigationRef) => {
  // Notification reçue au premier plan
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('📱 Notification reçue au premier plan:', notification);
    }
  );

  // Notification cliquée
  const responseListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const data = response.notification.request.content.data;
      console.log('🔘 Notification cliquée:', data);
      
      // Navigation en fonction du type de notification
      if (data?.type === 'activity_complete' && navigationRef?.current) {
        navigationRef.current.navigate('History');
      }
      if (data?.type === 'nutrition_advice' && navigationRef?.current) {
        navigationRef.current.navigate('Profile');
      }
    }
  );

  // Fonction de nettoyage
  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
};