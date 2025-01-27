import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fastStorage } from "./storageManager";

interface Order {
  _id: string;
  totalPrice: number;
  items: { productId: string; quantity: number; price: number }[];
  createdAt: string;
}

interface OrderState {
  orderList: { [userId: string]: Order[] };
  setOrderList: (userId: string, orders: Order[]) => void;
  addOrder: (userId: string, order: Order) => void;
  getOrdersByUserId: (userId: string) => Order[];
}

const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orderList: {},
      
      setOrderList: (userId, orders) =>
        set((state) => ({
          orderList: {
            ...state.orderList,
            [userId]: orders,
          },
        })),
        
      addOrder: (userId, order) =>
        set((state) => ({
          orderList: {
            ...state.orderList,
            [userId]: [...(state.orderList[userId] || []), order],
          },
        })),
        
      getOrdersByUserId: (userId) => get().orderList[userId] || [],
    }),
    {
      name: "order-store",
      storage: fastStorage,
    }
  )
);

export default useOrderStore;