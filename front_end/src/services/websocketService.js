import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = {};
  }

  connect(userId, onPositionUpdate, onNearbyUsers, onUserLeft) {
    if (this.socket && this.isConnected) {
      console.log('WebSocket déjà connecté');
      return;
    }

    const SOCKET_URL = 'http://10.84.246.91:3000/geolocation'; // ← Ton IP
    
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', async () => {
      console.log('✅ WebSocket connecté');
      this.isConnected = true;
      
      const token = await AsyncStorage.getItem('userToken');
      const userStr = await AsyncStorage.getItem('user');
      const userId = userStr ? JSON.parse(userStr).id : null;
      
      this.socket.emit('authenticate', { userId, token });
    });

    this.socket.on('authenticated', (data) => {
      console.log('🔐 Authentifié WebSocket:', data);
    });

    this.socket.on('positionUpdate', (data) => {
      console.log('📍 Position autre utilisateur:', data);
      if (onPositionUpdate) onPositionUpdate(data);
    });

    this.socket.on('nearbyUsers', (data) => {
      console.log('👥 Utilisateurs à proximité:', data.users.length);
      if (onNearbyUsers) onNearbyUsers(data.users);
    });

    this.socket.on('userLeft', (data) => {
      console.log('👋 Utilisateur parti:', data.userId);
      if (onUserLeft) onUserLeft(data.userId);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket déconnecté');
      this.isConnected = false;
    });
  }

  sendPosition(userId, latitude, longitude, accuracy, sport = null) {
    if (!this.socket || !this.isConnected) {
      console.log('⚠️ WebSocket non connecté');
      return;
    }

    this.socket.emit('updatePosition', {
      userId,
      position: { lat: latitude, lng: longitude },
      accuracy,
      sport,
    });
  }

  getNearbyUsers(userId, radius = 1000) {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('getNearbyUsers', { userId, radius });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export default new WebSocketService();