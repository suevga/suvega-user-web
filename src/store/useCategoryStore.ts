import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fastStorage } from './storageManager';

interface Category {
  _id: string;
  name: string;
  image: string;
  description?: string;
  productCount?: number;
}

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