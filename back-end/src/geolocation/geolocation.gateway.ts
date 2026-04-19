import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// Définir les interfaces pour le typage
interface UserPosition {
  userId: number;
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  sport?: string;
}

interface NearbyUser {
  userId: number;
  position: { lat: number; lng: number };
  distance: number;
  sport?: string;
}

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: 'geolocation',
})
export class GeolocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activePositions = new Map<number, UserPosition>();
  private userSockets = new Map<number, string[]>();

  handleConnection(client: Socket) {
    console.log(`🔌 Client connecté: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 Client déconnecté: ${client.id}`);
    
    for (const [userId, socketIds] of this.userSockets.entries()) {
      const index = socketIds.indexOf(client.id);
      if (index !== -1) {
        socketIds.splice(index, 1);
        if (socketIds.length === 0) {
          this.userSockets.delete(userId);
          this.activePositions.delete(userId);
          console.log(`🗑️ Utilisateur ${userId} supprimé de la mémoire`);
          this.server.emit('userLeft', { userId });
        }
      }
    }
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; token: string },
  ) {
    console.log(`🔐 Authentification user ${data.userId}`);
    
    client.data.userId = data.userId;
    
    if (!this.userSockets.has(data.userId)) {
      this.userSockets.set(data.userId, []);
    }
    this.userSockets.get(data.userId)!.push(client.id);
    
    client.emit('authenticated', { success: true, userId: data.userId });
    this.sendNearbyUsers(client, data.userId);
  }

  @SubscribeMessage('updatePosition')
  handleUpdatePosition(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      userId: number;
      position: { lat: number; lng: number };
      accuracy: number;
      sport?: string;
    },
  ) {
    this.activePositions.set(data.userId, {
      userId: data.userId,
      lat: data.position.lat,
      lng: data.position.lng,
      accuracy: data.accuracy,
      timestamp: Date.now(),
      sport: data.sport,
    });

    console.log(`📍 Position user ${data.userId}: ${data.position.lat}, ${data.position.lng}`);

    client.broadcast.emit('positionUpdate', {
      userId: data.userId,
      position: data.position,
      sport: data.sport,
      timestamp: Date.now(),
    });

    client.emit('positionConfirmed', { timestamp: Date.now() });
  }

  @SubscribeMessage('getNearbyUsers')
  async handleGetNearbyUsers(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; radius?: number },
  ) {
    this.sendNearbyUsers(client, data.userId, data.radius || 1000);
  }

  // ✅ CORRECTION : Typer explicitement le tableau
  private sendNearbyUsers(client: Socket, userId: number, radiusMeters: number = 1000) {
    const currentPos = this.activePositions.get(userId);
    if (!currentPos) {
      client.emit('nearbyUsers', { users: [] });
      return;
    }

    const nearbyUsers: NearbyUser[] = []; // ← TYPAGE EXPLICITE
    
    for (const [otherUserId, position] of this.activePositions.entries()) {
      if (otherUserId === userId) continue;
      
      const distance = this.calculateDistance(
        currentPos.lat, currentPos.lng,
        position.lat, position.lng
      );
      
      if (distance <= radiusMeters) {
        nearbyUsers.push({
          userId: otherUserId,
          position: { lat: position.lat, lng: position.lng },
          distance: Math.round(distance),
          sport: position.sport,
        });
      }
    }
    
    client.emit('nearbyUsers', { users: nearbyUsers, timestamp: Date.now() });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  getUserPosition(userId: number): UserPosition | undefined {
    return this.activePositions.get(userId);
  }
}