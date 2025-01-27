import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fastStorage } from './storageManager';
import { CartState } from '../types/types';

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryCharge: 25,
      addToCart: (item) => set((state) => {
        const effectivePrice = item.discountPrice || item.price;
        const existingItem = state.items.find((cartItem) => cartItem._id === item._id);
        
        if (existingItem) {
          return {
            items: state.items.map((cartItem) =>
              cartItem._id === item._id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          };
        }

        return {
          items: [
            ...state.items,
            {
              _id: item._id,
              productName: item.productName,
              productImage: item.productImage,
              price: item.price,
              discountPrice: effectivePrice,
              quantity: 1,
            },
          ],
        };
      }),

      removeFromCart: (id) => set((state) => ({
        items: state.items.filter((item) => item._id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter((item) => item._id !== id),
          };
        }

        return {
          items: state.items.map((item) =>
            item._id === id
              ? { ...item, quantity }
              : item
          ),
        };
      }),

      clearCart: () => set({ items: [] }),

      getSubtotalBeforeDiscount: () => {
        const items = get().items;
        return items.reduce((total, item) => 
          total + (item.price * item.quantity), 0);
      },

      getSubtotalAfterDiscount: () => {
        const items = get().items;
        return items.reduce((total, item) => 
          total + ((item.discountPrice || item.price) * item.quantity), 0);
      },

      getDeliveryCharge: () => {
        return get().deliveryCharge;
      },

      getTotalAmount: () => {
        return get().getSubtotalAfterDiscount() + get().getDeliveryCharge();
      },

      getTotalSavings: () => {
        return get().getSubtotalBeforeDiscount() - get().getSubtotalAfterDiscount();
      },

      getSavingsPercentage: () => {
        const subtotalBeforeDiscount = get().getSubtotalBeforeDiscount();
        const totalSavings = get().getTotalSavings();
        
        if (subtotalBeforeDiscount === 0) return 0;
        
        return (totalSavings / subtotalBeforeDiscount) * 100;
      },
    }),
    {
      name: 'cart-store',
      storage: fastStorage,
    }
  )
);

export default useCartStore;