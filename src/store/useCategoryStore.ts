import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fastStorage } from './storageManager';
import { Category } from '../types/types';


interface CategoryState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  getCategoryById: (id: string) => Category | undefined;
}

const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      
      setCategories: (categories) => set({ categories }),
      
      getCategoryById: (id) => 
        get().categories.find(category => category._id === id),
    }),
    {
      name: 'category-store',
      storage: fastStorage,
    }
  )
);

export default useCategoryStore;