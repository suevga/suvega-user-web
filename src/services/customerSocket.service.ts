import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { envConfig } from '../utilits/envConfig';

interface OrderUpdate {
  orderId: string;
  type: string; // Changed from `status` to `type` to match backend
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

  // Initialize the socket connection
  initialize(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.userId = userId;
        this.socket = io(envConfig.apiUrl, {
          query: { userId },
          reconnection: true, // Enable reconnection
          reconnectionAttempts: 5, // Max reconnection attempts
          reconnectionDelay: 1000, // Delay between attempts
        });

        // Handle successful connection
        this.socket.on('connect', () => {
          console.log('Socket connected');
          this.socket?.emit('joinRoom', { type: 'user', id: userId }); // Join user-specific room
          resolve();
        });

        // Set up event listeners
        this.setupEventListeners();

        // Handle connection errors
        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setTimeout(() => {
            this.socket?.connect(); // Retry connection
          }, 5000); // Retry after 5 seconds
          reject(error);
        });

        // Handle disconnection
        this.socket.on('disconnect', () => {
          console.log('Socket disconnected');
        });
      } catch (error) {
        console.error('Socket initialization error:', error);
        reject(error);
      }
    });
  }

  // Set up event listeners for order updates
  setupEventListeners() {
    if (!this.socket) return;

    // Listen for order updates
    this.socket.on('orderUpdate', (data: OrderUpdate) => {
      console.log('Order update received:', data); // Debug log

      // Call the callback for the specific order (if registered)
      const callback = this.orderStatusCallbacks.get(data.orderId);
      if (callback) {
        callback(data);
      }

      // Handle different types of order updates
      switch (data.type) {
        case 'ORDER_ACCEPTED':
          toast.success(data.message);
          break;
        case 'ORDER_REJECTED':
          toast.error(data.message);
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
        case 'NO_RIDER_AVAILABLE':
          toast.info(data.message);
          break;
        default:
          console.warn('Unknown order update type:', data.type);
      }
    });

    // Listen for rider location updates
    this.socket.on('riderLocationUpdate', (data: OrderUpdate) => {
      console.log('Rider location update received:', data); // Debug log

      // Call the callback for the specific order (if registered)
      const callback = this.orderStatusCallbacks.get(data.orderId);
      if (callback) {
        callback(data);
      }
    });
  }

  // Subscribe to updates for a specific order
  subscribeToOrderUpdates(orderId: string, callback: (update: OrderUpdate) => void): void {
    this.orderStatusCallbacks.set(orderId, callback);
  }

  // Unsubscribe from updates for a specific order
  unsubscribeFromOrderUpdates(orderId: string): void {
    this.orderStatusCallbacks.delete(orderId);
  }

  // Disconnect the socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
      this.orderStatusCallbacks.clear();
    }
  }

  // Check if the socket is connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();