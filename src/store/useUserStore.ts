import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fastStorage } from "./storageManager";

interface DarkStore {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface Address {
  id: string;
  type: string;
  name: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  pinCode: string;
  landmark: string;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface UserDataProps {
  _id: string;
  name: string;
  phoneNumber: string;
  storeId: string;
  address: Address[];
  location: UserLocation;
  cartItem: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserProps {
  userId: string | null;
  userData: UserDataProps | null;
  addresses: Address[] | null;
  darkStores: DarkStore | null;
  outOfService: boolean;

  // Actions
  setUserId: (id: string) => void;
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
      addresses: null,
      darkStores: null,
      outOfService: false,
      
      setUserId: (id) => set({ userId: id }),
      setUserData: (data) => set({ userData: data }),
      updateUserData: (data) => set({ userData: data }),
      setAddresses: (addresses) => set({ addresses }),
      setDarkStore: (store) => set({ darkStores: store }),
      setOutOfService: (data) => set({ outOfService: data }),
      resetUser: () => set({ userId: "", userData: null, outOfService: false }),
      clearUserID: () => set({ userId: null }),
      deleteAddress: (id) => set((state) => ({
        addresses: state.addresses?.filter((address) => address.id !== id) || null,
      })),
    }),
    {
      name: "user-store",
      partialize: (state)=> ({
        userData: state.userData,
        addresses: state.addresses,
        userId: state.userId,
        darkStores: state.darkStores,
      }),
      storage: fastStorage
    }
  )
)

export default useUserStore;