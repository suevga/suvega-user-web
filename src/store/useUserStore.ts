import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fastStorage } from "./storageManager";
import { Address, DarkStore, LocationData } from "../types/types";

export interface UserDataProps {
  _id: string;
  name: string;
  phoneNumber: string;
  storeId: string[];
  address: Address[];
  location: LocationData;
  cartItem: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserProps {
  userId: string | null;
  phoneNumber: string | null;
  userData: UserDataProps | null;
  addresses: Address[] | null;
  darkStores: DarkStore | null;
  outOfService: boolean;
  isInitialized: boolean;

  // Actions
  setUserId: (id: string) => void;
  setPhoneNumber: (phone: string) => void;
  setUserData: (data: UserDataProps) => void;
  updateUserData: (data: UserDataProps) => void;
  setOutOfService: (data: boolean) => void;
  setAddresses: (addresses: Address[]) => void;
  setDarkStore: (store: DarkStore) => void;
  resetUser: () => void;
  clearUserID: () => void;
  deleteAddress: (id: string) => void;
  initialize: () => void;
}

const STORAGE_KEY = 'user-store';

const useUserStore = create<UserProps>()(
  persist(
    (set) => ({
      userId: null,
      userData: null,
      phoneNumber: null,
      addresses: null,
      darkStores: null,
      outOfService: false,
      isInitialized: false,

      initialize: () => {
        try {
          const storedData = localStorage.getItem(STORAGE_KEY);
          if (storedData) {
            const parsed = JSON.parse(storedData);
            set({ ...parsed, isInitialized: true });
          }
        } catch (error) {
          console.error('Error initializing user store:', error);
          // Clear potentially corrupted data
          localStorage.removeItem(STORAGE_KEY);
          set({ isInitialized: true });
        }
      },
      
      setUserId: (id) => set({ userId: id }),
      setUserData: (data) => {
        if (!data) return;
        set({ userData: data, userId: data._id });
      },
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      updateUserData: (data) => {
        if (!data) return;
        set({ userData: data });
      },
      setAddresses: (addresses) => set({ addresses }),
      setDarkStore: (store) => set({ darkStores: store }),
      setOutOfService: (data) => set({ outOfService: data }),
      resetUser: () => set({ 
        userId: null, 
        userData: null, 
        phoneNumber: null,
        addresses: null,
        darkStores: null,
        outOfService: false 
      }),
      clearUserID: () => set({ userId: null }),
      deleteAddress: (id) => set((state) => ({
        addresses: state.addresses?.filter((address) => address._id !== id) || null,
        userData: state.userData ? {
          ...state.userData,
          address: state.userData.address.filter((addr) => addr._id !== id)
        } : null
      })),
    }),
    {
      name: STORAGE_KEY,
      storage: fastStorage,
      partialize: (state) => ({
        userData: state.userData,
        phoneNumber: state.phoneNumber,
        addresses: state.addresses,
        userId: state.userId,
        darkStores: state.darkStores,
      }),
    }
  )
);

export default useUserStore;