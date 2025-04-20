import { useState, useCallback } from 'react';
import axiosInstance from '../utilits/axiosInstance';
import { LocationData, OrderData, UserData } from '../types/types';
import useUserStore from '../store/useUserStore';
import useCategoryStore from '../store/useCategoryStore';
import useProductStore from '../store/useProductStore';


export const useApiStore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);
  const { setDarkStore, setOutOfService } = useUserStore();
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
      console.log("response after chceking nearest darkstore::", JSON.stringify(response.data));
      
      if (response.data.data?.isAvailable) {
        setDarkStore(response.data.data.darkStores);
        setCategories(response.data.data.categories);
        setProducts(response.data.data.products);
        setOutOfService(false);
        return true;
      } else {
        console.log("No darkstores found within 5km radius");
        setOutOfService(true);
        setCategories([]);
        setProducts([]);
        return false;

      }
    } catch (err) {
      setError('Unable to find nearest store');
      setOutOfService(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setDarkStore, setCategories, setProducts, setOutOfService]);

  const registerUser = useCallback(async (email:string, phoneNumber: string, location: LocationData) => {
    setLoading(true);
    try {

      const response = await axiosInstance.post('/api/v1/users/register', {
        email,
        phoneNumber,
        location
      });
      console.log("registered new user::",response.data);
      setUser(response.data.data.user);
      return response.data.data.user;
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const checkUserRegisteredOrNot = useCallback(async (phoneNumber:string, email: string )=> {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/v1/users/check-user", {
        phoneNumber,
        email
      })
      if (res) {
        console.log("response after checking user status::", res.data);
        
        return res.data.data;
      }
    } catch (error) {
      setError('Failed to check user existence');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [])

   // Update user details
   const updateUserDetails = useCallback(async (
    userId: string,
    updateData: Partial<UserData>
  ) => {
    setLoading(true);
    try {
      const response = await axiosInstance.patch(
        `/api/v1/users/update/${userId}`,
        updateData
      );
      setUser(response.data.data);
      return response.data.data;
    } catch (err) {
      setError('Failed to update user details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user details
  const getUserDetails = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/v1/users/details/${userId}`
      );
      setUser(response.data.data.user);
      return response.data.data.user;
    } catch (err) {
      setError('Failed to fetch user details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAddress = useCallback(async (addressData: LocationData) => {
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

  const createOrder = useCallback(async (userId: string, orderDetails: any) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/api/v1/order/create/${userId}`, orderDetails);
      console.log("order response after placing order::", JSON.stringify(response.data.data.order));
      
      setOrder(response.data.data.order);
      return response.data.data.order;
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
    checkUserRegisteredOrNot,
    updateUserDetails,
    getUserDetails,
    registerUser,
    saveAddress,
    createOrder,
    placeOrder,
    setUser,
    setLocation,
  };
};