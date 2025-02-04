import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  initialize(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.userId = userId;
        this.socket = io(import.meta.env.VITE_API_URL, {
          auth: {
            userId
          }
        });

        this.socket.on('connect', () => {
          console.log('Socket connected');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });

        this.socket.on('orderStatusUpdate', (data) => {
          toast.info(`Order status updated: ${data.status}`);
        });

        this.socket.on('orderAssigned', (data) => {
          toast.success(`Order assigned to delivery partner: ${data.partnerName}`);
        });

        this.socket.on('disconnect', () => {
          console.log('Socket disconnected');
        });

      } catch (error) {
        console.error('Socket initialization error:', error);
        reject(error);
      }
    });
  }

  joinOrderRoom(orderId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit('joinOrderRoom', { orderId }, (response: { success: boolean; error?: string }) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error || 'Failed to join order room'));
        }
      });
    });
  }

  leaveOrderRoom(orderId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leaveOrderRoom', { orderId });
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();