import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fastStorage } from "./storageManager";
import { Address, DarkStore, LocationData } from "../types/types";



export interface UserDataProps {
  _id: string;
  name: string;
  phoneNumber: string;
  storeId: string[]; // Changed from string to string[]
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
}


const useUserStore = create<UserProps>()(
  persist(
    (set)=> ({
      userId: null,
      userData: null,
      phoneNumber: null,
      addresses: null,
      darkStores: null,
      outOfService: false,
      
      setUserId: (id) => set({ userId: id }),
      setUserData: (data) => set({ userData: data }),
      setPhoneNumber:(phone) =>set({phoneNumber:phone}),
      updateUserData: (data) => set({ userData: data }),
      setAddresses: (addresses) => set({ addresses }),
      setDarkStore: (store) => set({ darkStores: store }),
      setOutOfService: (data) => set({ outOfService: data }),
      resetUser: () => set({ userId: "", userData: null, outOfService: false }),
      clearUserID: () => set({ userId: null }),
      deleteAddress: (id) => set((state) => ({
        addresses: state.addresses?.filter((address) => address._id !== id) || null,
      })),
    }),
    {
      name: "user-store",
      partialize: (state)=> ({
        userData: state.userData,
        phoneNumber: state.phoneNumber,
        addresses: state.addresses,
        userId: state.userId,
        darkStores: state.darkStores,
      }),
      storage: fastStorage
    }
  )
)

export default useUserStore;