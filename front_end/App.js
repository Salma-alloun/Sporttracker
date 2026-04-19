// App.js
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync, sendTokenToBackend, setupNotificationListeners } from './src/services/notificationService';
import useAuth from './src/hooks/useAuth';

function RootNavigator() {
  const { isAuthenticated, loading, user } = useAuth();
  const navigationRef = useRef();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérification de l'authentification
  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Enregistrer le token push quand l'utilisateur est connecté
  // App.js - Modifie le useEffect du token push
useEffect(() => {
  console.log('🔍 Vérification token push - isLoggedIn:', isLoggedIn, 'user?.id:', user?.id);
  
  if (isLoggedIn && user?.id) {
    console.log('🔑 Utilisateur connecté, enregistrement du token push...');
    registerForPushNotificationsAsync().then(token => {
      console.log('📱 Token récupéré:', token ? 'OUI' : 'NON');
      if (token) {
        sendTokenToBackend(token);
      }
    });
  }
}, [isLoggedIn, user]);

  // ✅ Configurer les écouteurs de notifications
  useEffect(() => {
    const cleanup = setupNotificationListeners(navigationRef);
    return cleanup;
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoggedIn ? <DrawerNavigator /> : <StackNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return <RootNavigator />;
}