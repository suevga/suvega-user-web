import { create } from 'zustand';
import { persist } from "zustand/middleware";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
  setLocation: (lat: number, lon: number) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      latitude: null,
      longitude: null,
      error: null,
      isLoading: false,
      setLocation: (lat, lon) => set({ 
        latitude: lat, 
        longitude: lon,
        error: null,
        isLoading: false
      }),
      setError: (error) => set({ error, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: "location-store",
      partialize: (state) => ({ 
        latitude: state.latitude,
        longitude: state.longitude
      })
    }
  )
);
