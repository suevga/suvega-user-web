import { createJSONStorage } from 'zustand/middleware';

class FastStorageManager {
  private memoryCache: Map<string, any> = new Map();

  getItem = (name: string): string | null => {
    const cachedItem = this.memoryCache.get(name);
    if (cachedItem) return JSON.stringify(cachedItem);

    const storageItem = localStorage.getItem(name);
    if (storageItem) {
      const parsed = JSON.parse(storageItem);
      this.memoryCache.set(name, parsed);
      return storageItem;
    }
    return null;
  }

  setItem = (name: string, value: string): void => {
    const parsed = JSON.parse(value);
    this.memoryCache.set(name, parsed);
    localStorage.setItem(name, value);
  }

  removeItem = (name: string): void => {
    this.memoryCache.delete(name);
    localStorage.removeItem(name);
  }
}

const fastStorageManager = new FastStorageManager();
export const fastStorage = createJSONStorage(() => fastStorageManager);