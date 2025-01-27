import { useState, useCallback } from 'react';
import axiosInstance from '../utilits/axiosInstance';
import { OrderData, UserData, UserLocation } from '../types/types';
import useUserStore from '../store/useUserStore';
import useCategoryStore from '../store/useCategoryStore';
import useProductStore from '../store/useProductStore';



export const useApiStore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);
  const { setDarkStore } = useUserStore();
  const { setCategories } = useCategoryStore();
  const { setProducts } = useProductStore();
  const resetError = () => setError(null);

  const findNearestStore = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/v1/distance/check-availability', {
        latitude: latitude,
        longitude: longitude
      });
      console.log("response from my backend finding store", JSON.stringify(response.data));
      
      if (response.data.data.isAvailable) {
        setDarkStore(response.data.data.darkStores);
        setCategories(response.data.data.categories);
        setProducts(response.data.data.products);
      } else {
        console.log("No darkstores found within 5km radius");
      }
    } catch (err) {
      setError('Unable to find nearest store');
    } finally {
      setLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (userData: UserData & { location?: UserLocation }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/v1/auth/register', {
        ...userData,
        ...(userData.location && {
          latitude: userData.location.latitude,
          longitude: userData.location.longitude,
        }),
      });
      
      setUser(response.data.user);
      setLocation(userData.location || null);
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAddress = useCallback(async (addressData: UserLocation) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/v1/user/save-address', addressData);
      if (response.data) {
        setLocation(addressData);
      }
    } catch (err) {
      setError('Address save failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderDetails: any) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/v1/orders/create', orderDetails);
      setOrder(response.data.order);
    } catch (err) {
      setError('Order creation failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const placeOrder = useCallback(async (orderId: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/api/v1/orders/${orderId}/place`);
      setOrder(response.data.order);
    } catch (err) {
      setError('Order placement failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    resetError,
    user,
    location,
    order,
    findNearestStore,
    registerUser,
    saveAddress,
    createOrder,
    placeOrder,
    setUser,
    setLocation,
  };
};