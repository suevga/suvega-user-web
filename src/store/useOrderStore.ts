import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fastStorage } from "./storageManager";

interface OrderItem {
  product: string;
  productName: string;
  productImage?: string;
  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  orderStatus: "pending" | "accepted" | "rejected" | "pickup" | "delivered" | "cancelled";
  paymentMethod: "cash" | "card" | "upi";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
  darkStore?: string;
  deliveryRider?: {
    _id: string;
    name: string;
    phoneNumber: string;
    location?: {
      coordinates: [number, number];
    };
  };
}

interface OrderStore {
  // State
  orders: Order[];
  selectedOrder: Order | null;
  isModalOpen: boolean;

  // Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  setSelectedOrder: (order: Order | null) => void;
  setModalOpen: (isOpen: boolean) => void;

  // Getters
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: Order['orderStatus']) => Order[];
  getPendingOrders: () => Order[];
  getActiveOrders: () => Order[];
  getCompletedOrders: () => Order[];
  getCancelledOrders: () => Order[];

  // Operations
  clearOrders: () => void;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
  updatePaymentStatus: (orderId: string, status: Order['paymentStatus']) => void;
  updateRiderLocation: (orderId: string, location: { coordinates: [number, number] }) => void;
}

const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      // Initial state
      orders: [],
      selectedOrder: null,
      isModalOpen: false,

      // Setters
      setOrders: (orders) => set({ orders }),

      addOrder: (order) => set((state) => ({
        orders: [...state.orders, order],
      })),

      updateOrder: (orderId, updates) => set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? { ...order, ...updates } : order
        ),
      })),

      setSelectedOrder: (order) => set({ selectedOrder: order }),

      setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

      // Getters
      getOrderById: (orderId) => get().orders.find((order) => order._id === orderId),

      getOrdersByStatus: (status) =>
        get().orders.filter((order) => order.orderStatus === status),

      getPendingOrders: () =>
        get().orders.filter((order) => order.orderStatus === "pending"),

      getActiveOrders: () =>
        get().orders.filter((order) =>
          ["accepted", "pickup"].includes(order.orderStatus)
        ),

      getCompletedOrders: () =>
        get().orders.filter((order) => order.orderStatus === "delivered"),

      getCancelledOrders: () =>
        get().orders.filter((order) =>
          ["cancelled", "rejected"].includes(order.orderStatus)
        ),

      // Operations
      clearOrders: () => set({ orders: [], selectedOrder: null }),

      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: status } : order
        ),
      })),

      updatePaymentStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? { ...order, paymentStatus: status } : order
        ),
      })),

      updateRiderLocation: (orderId, location) => set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId && order.deliveryRider
            ? {
                ...order,
                deliveryRider: {
                  ...order.deliveryRider,
                  location,
                },
              }
            : order
        ),
      })),
    }),
    {
      name: "order-store",
      storage: fastStorage,
    }
  )
);

export default useOrderStore;