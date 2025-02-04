import { createJSONStorage } from 'zustand/middleware';

class FastStorageManager {
  private memoryCache: Map<string, any> = new Map();
  private retryAttempts = 3;
  private retryDelay = 1000; // 1 second

  private async retry<T>(operation: () => T): Promise<T> {
    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        return operation();
      } catch (error) {
        if (attempt === this.retryAttempts - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
    throw new Error('Operation failed after multiple attempts');
  }

  private isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  getItem = (name: string): string | null => {
    try {
      // First check memory cache
      const cachedItem = this.memoryCache.get(name);
      if (cachedItem !== undefined) {
        return JSON.stringify(cachedItem);
      }

      // Then check localStorage
      const storageItem = localStorage.getItem(name);
      if (!storageItem) return null;

      // Validate JSON before parsing
      if (!this.isValidJSON(storageItem)) {
        localStorage.removeItem(name);
        return null;
      }

      const parsed = JSON.parse(storageItem);
      this.memoryCache.set(name, parsed);
      return storageItem;
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  setItem = (name: string, value: string): void => {
    try {
      if (!this.isValidJSON(value)) {
        throw new Error('Invalid JSON string');
      }

      const parsed = JSON.parse(value);
      this.retry(() => {
        this.memoryCache.set(name, parsed);
        localStorage.setItem(name, value);
      });
    } catch (error) {
      console.error('Error setting item in storage:', error);
      // Clear potentially corrupted data
      this.memoryCache.delete(name);
      localStorage.removeItem(name);
    }
  }

  removeItem = (name: string): void => {
    try {
      this.retry(() => {
        this.memoryCache.delete(name);
        localStorage.removeItem(name);
      });
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }
}

const fastStorageManager = new FastStorageManager();
export const fastStorage = createJSONStorage(() => fastStorageManager);