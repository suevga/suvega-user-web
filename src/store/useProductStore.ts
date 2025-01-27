import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fastStorage } from './storageManager';
import { Product } from '../types/types';



interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
}

const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      
      setProducts: (products) => set({ products }),
      
      getProductById: (id) => 
        get().products.find(product => product._id === id),
      
      getProductsByCategory: (categoryId) => 
        get().products.filter(product => product.categoryId === categoryId),
    }),
    {
      name: 'product-store',
      storage: fastStorage,
    }
  )
);

export default useProductStore;