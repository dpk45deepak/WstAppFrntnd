// src/services/socket.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
  // private socket: Socket | null = null;
  socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return this.socket;
  }

  subscribeToPickupUpdates(callback: (data: any) => void) {
    this.socket?.on('pickup:update', callback);
  }

  unsubscribeFromPickupUpdates() {
    this.socket?.off('pickup:update');
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export default new SocketService();