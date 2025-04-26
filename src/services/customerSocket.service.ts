import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { envConfig } from '../utilits/envConfig';

interface OrderUpdate {
  orderId: string;
  type: string;
  message: string;
  rider?: {
    name: string;
    phoneNumber: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private orderStatusCallbacks: Map<string, (update: OrderUpdate) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectionTimer: NodeJS.Timeout | null = null;
  private connectionState: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
  private listenerInitialized = false;

  // Initialize the socket connection
  initialize(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Clean up any existing connection
        this.cleanup();
        
        this.userId = userId;
        this.connectionState = 'connecting';
        
        console.log(`Initializing socket for userId: ${this.userId}`);
        console.log('Connecting to socket server:', envConfig.apiUrl || 'http://localhost:8080');
        
        // Create socket with proper configuration
        this.socket = io("http://localhost:8080", {
          query: { 
            type: "user", 
            userId 
          },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          transports: ['websocket', 'polling']
        });

        // Handle successful connection
        this.socket.on('connect', () => {
          console.log('Socket connected with ID:', this.socket?.id);
          this.connectionState = 'connected';
          this.reconnectAttempts = 0;
          
          // Join user-specific room
          this.socket?.emit('joinRoom', { type: 'user', id: userId });
          
          // Notify server we're ready to receive updates
          this.socket?.emit('userReady', { userId });
          
          // Success message
          // toast.success('Connected to notification service');
          
          // Set up event listeners if not already done
          if (!this.listenerInitialized) {
            this.setupEventListeners();
          }
          
          resolve();
        });

        // Handle connection errors
        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.connectionState = 'disconnected';
          this.handleReconnect();
          reject(error);
        });

        // Handle disconnection
        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected, reason:', reason);
          this.connectionState = 'disconnected';
          
          // Handle reconnection for specific disconnection reasons
          if (reason === 'io server disconnect' || reason === 'transport close' || reason === 'transport error') {
            this.handleReconnect();
          }
        });
      } catch (error) {
        console.error('Socket initialization error:', error);
        this.connectionState = 'disconnected';
        reject(error);
      }
    });
  }
  
  // Handle reconnection logic
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      // toast.error('Failed to connect to notification service after multiple attempts');
      return;
    }
    
    this.reconnectAttempts++;
    
    if (this.reconnectionTimer) {
      clearTimeout(this.reconnectionTimer);
    }
    
    const delay = Math.min(1000 * this.reconnectAttempts, 10000); // Exponential backoff up to 10 seconds
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectionTimer = setTimeout(() => {
      if (this.userId) {
        console.log('Attempting to reconnect...');
        this.socket?.connect();
      }
    }, delay);
  }
  
  // Cleanup resources
  private cleanup(): void {
    if (this.reconnectionTimer) {
      clearTimeout(this.reconnectionTimer);
      this.reconnectionTimer = null;
    }
    
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    
    this.connectionState = 'disconnected';
  }

  // Set up event listeners for order updates
  setupEventListeners() {
    if (!this.socket) {
      console.warn('Cannot setup event listeners: Socket is not initialized');
      return;
    }
    
    this.listenerInitialized = true;
    
    // Remove any existing listeners to avoid duplicates
    this.socket.off('orderUpdate');
    this.socket.off('riderLocationUpdate');
    this.socket.off('roomJoined');
    this.socket.off('notification');
    this.socket.off('error');
    
    console.log('Setting up socket event listeners');
    
    // Debug event to confirm room joining
    this.socket.on('roomJoined', (data) => {
      console.log('Joined room:', data);
      if (data.success) {
        console.log(`Connected to ${data.room}`);
      }
    });

    // Listen for order updates
    this.socket.on('orderUpdate', (data: OrderUpdate) => {
      console.log('🔔 Order update received:', data);
      console.log('Order ID:', data.orderId);
      console.log('Update type:', data.type);
      console.log('Message:', data.message);
      
      // Process update type to match expected patterns
      if (data.type) {
        // Store the original type for debugging
        const originalType = data.type;
        
        // Convert to uppercase for consistency with backend
        if (data.type === 'accepted') {
          data.type = 'ORDER_ACCEPTED';
          console.log(`🔄 Converting update type from 'accepted' to 'ORDER_ACCEPTED' for consistency`);
        } else if (data.type === 'rejected') {
          data.type = 'ORDER_REJECTED';
          console.log(`🔄 Converting update type from 'rejected' to 'ORDER_REJECTED' for consistency`);
        } else if (data.type === 'pickup') {
          data.type = 'PICKUP';
          console.log(`🔄 Converting update type from 'pickup' to 'PICKUP' for consistency`);
        } else if (data.type === 'delivered') {
          data.type = 'DELIVERED';
          console.log(`🔄 Converting update type from 'delivered' to 'DELIVERED' for consistency`);
        }
        
        // Log the conversion if it happened
        if (originalType !== data.type) {
          console.log(`Update type converted from ${originalType} to ${data.type}`);
        }
      }

      // Call the callback for the specific order (if registered)
      const callback = this.orderStatusCallbacks.get(data.orderId);
      if (callback) {
        console.log(`Found callback for order ${data.orderId}, invoking it`);
        callback(data);
      } else {
        console.log(`No specific callback found for order ${data.orderId}, checking general listeners`);
        // Try to find a general callback
        const generalCallback = this.orderStatusCallbacks.get('orderUpdate');
        if (generalCallback) {
          console.log('Invoking general order update callback');
          generalCallback(data);
        }
      }

      // Handle different types of order updates
      switch (data.type) {
        case 'ORDER_ACCEPTED':
          toast.success(data.message || 'Your order has been accepted!');
          break;
        case 'ORDER_REJECTED':
          toast.error(data.message || 'Your order has been rejected');
          break;
        case 'RIDER_ASSIGNED':
          toast.success(`Rider ${data.rider?.name || 'Unknown'} has been assigned to your order`);
          break;
        case 'PICKUP':
          toast.info(data.message || 'Rider has picked up your order from the store');
          break;
        case 'DELIVERED':
          toast.success(data.message || 'Your order has been delivered!');
          break;
        case 'NO_RIDER_AVAILABLE':
          toast.info(data.message || 'No riders available at the moment. Please wait.');
          break;
        default:
          // For legacy status-based updates
          if (data.type === 'accepted') {
            toast.success('Your order has been accepted!');
          } else if (data.type === 'rejected' || data.type === 'cancelled') {
            toast.error(`Your order has been ${data.type}`);
          } else if (data.type === 'delivered') {
            toast.success('Your order has been delivered!');
          } else {
            toast.info(`Order status: ${data.type || 'updated'}`);
          }
      }
    });

    // Listen for rider location updates
    this.socket.on('riderLocationUpdate', (data: any) => {
      console.log('Rider location update received:', data);

      // Call the callback for the specific order (if registered)
      const callback = this.orderStatusCallbacks.get(data.orderId);
      if (callback) {
        callback(data as OrderUpdate);
      }
    });
    
    // Handle generic notifications from server
    this.socket.on('notification', (data: any) => {
      console.log('Notification received:', data);
      toast.info(data.message || 'New notification received');
    });
    
    // Handle errors
    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  }

  // Subscribe to updates for a specific order
  subscribeToOrderUpdates(orderId: string, callback: (update: OrderUpdate) => void): void {
    this.orderStatusCallbacks.set(orderId, callback);
    console.log(`Subscribed to updates for order: ${orderId}`);
    
    // If we're already connected, join the order room immediately
    if (this.socket?.connected && orderId) {
      this.socket.emit('joinRoom', { type: 'order', id: orderId });
      console.log(`Joined order room: order_${orderId}`);
    } else {
      console.warn(`Socket not connected or orderId missing. Socket status: ${this.socket?.connected}, orderId: ${orderId}`);
    }
  }

  // Unsubscribe from updates for a specific order
  unsubscribeFromOrderUpdates(orderId: string): void {
    this.orderStatusCallbacks.delete(orderId);
    console.log(`Unsubscribed from updates for order: ${orderId}`);
    
    // Leave the order room if connected
    if (this.socket?.connected && orderId) {
      this.socket.emit('leaveRoom', { roomId: `order_${orderId}` });
    }
  }

  // Disconnect the socket
  disconnect(): void {
    this.cleanup();
    this.userId = null;
    this.orderStatusCallbacks.clear();
    this.listenerInitialized = false;
    console.log('Socket service disconnected');
  }

  // Check if the socket is connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
  
  // Get connection state
  getConnectionState(): string {
    return this.connectionState;
  }
  
  // Manually trigger a reconnection attempt
  reconnect(): void {
    if (!this.userId) {
      console.warn('Cannot reconnect: No user ID available');
      return;
    }
    
    console.log('Manually reconnecting socket...');
    this.initialize(this.userId).catch(error => {
      console.error('Manual reconnection failed:', error);
    });
  }
  
  // Join a specific order room
  joinOrderRoom(orderId: string): void {
    if (!this.socket?.connected) {
      console.warn('Cannot join room: Socket not connected');
      return;
    }
    
    console.log(`Joining order room for order ${orderId}`);
    this.socket.emit('joinRoom', { type: 'order', id: orderId });
  }
  
  // Send an acknowledgment to the server
  sendAcknowledgment(orderId: string, messageType: string): void {
    if (!this.socket?.connected) {
      console.warn('Cannot send acknowledgment: Socket not connected');
      return;
    }
    
    console.log(`Sending acknowledgment for order ${orderId}, type: ${messageType}`);
    this.socket.emit('acknowledgeMessage', {
      orderId,
      messageType,
      userId: this.userId
    });
  }
}

export const socketService = new SocketService(); 