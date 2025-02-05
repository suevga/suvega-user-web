import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { envConfig } from '../utilits/envConfig';

interface OrderUpdate {
  orderId: string;
  status: string;
  message: string;
  rider?: {
    name: string;
    phoneNumber: string;
    location?: {
      lat: number;
      lng: number;
    };
  };
}

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private orderStatusCallbacks: Map<string, (update: OrderUpdate) => void> = new Map();

  initialize(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.userId = userId;
        this.socket = io(envConfig.apiUrl, {
          query: { userId }
        });
        console.log("this is my userId::", this.userId);
        
        this.socket.on('connect', () => {
          console.log('Socket connected');
          this.socket?.emit('joinRoom', { type: 'user', id: userId });
          resolve();
        });

        this.socket.on('orderUpdate', (data: OrderUpdate) => {
          const callback = this.orderStatusCallbacks.get(data.orderId);
          if (callback) {
            callback(data);
          }

          switch (data.status) {
            case 'ORDER_ACCEPTED':
              toast.success('Your order has been accepted by the store!');
              break;
            case 'ORDER_REJECTED':
              toast.error(`Order rejected: ${data.message}`);
              break;
            case 'RIDER_ASSIGNED':
              toast.success(`Rider ${data.rider?.name} has been assigned to your order`);
              break;
            case 'PICKUP':
              toast.info('Rider has picked up your order from the store');
              break;
            case 'DELIVERED':
              toast.success('Your order has been delivered!');
              break;
          }
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });

      } catch (error) {
        console.error('Socket initialization error:', error);
        reject(error);
      }
    });
  }

  subscribeToOrderUpdates(orderId: string, callback: (update: OrderUpdate) => void): void {
    this.orderStatusCallbacks.set(orderId, callback);
  }

  unsubscribeFromOrderUpdates(orderId: string): void {
    this.orderStatusCallbacks.delete(orderId);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
      this.orderStatusCallbacks.clear();
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();