import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useUserStore from '../store/useUserStore';
import { useApiStore } from '../hooks/useApiStore';
import { AddressFormData, AddressFormProps, LocationData } from '../types/types';
import { useUser } from '@clerk/clerk-react';
import { useLocationStore } from '../store/useLocationStore';
import { Loader2 } from 'lucide-react';

export const AddressForm: React.FC<AddressFormProps> = ({ onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { phoneNumber, setUserData, userData } = useUserStore();
  const { checkUserRegisteredOrNot, registerUser, updateUserDetails } = useApiStore();
  const { user } = useUser();
  const { latitude, longitude } = useLocationStore();

  console.log("user data in address form::", userData);
  
  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
    defaultValues: {
      type: 'Home',
      fullName: '',
      addressLine: '',
      city: '',
      pinCode: '',
      landmark: ''
    }
  });

  const handleUpdateAddress = async (formData: AddressFormData) => {
    if (!userData?._id) {
      throw new Error('User data is required for updating address');
    }

    const newAddress = {
      id: Date.now().toString(),
      ...formData
    };

    const updatedUser = await updateUserDetails(userData._id, {
      address: [...(userData.address || []), newAddress]
    });
  
    console.log("updated user after adding address::", updatedUser);
    
    
    if (!updatedUser) {
      throw new Error('Failed to update address');
    }

    setUserData(updatedUser);
  };

  const handleUserRegistration = async () => {
    if (!phoneNumber || !user?.emailAddresses[0]?.emailAddress) {
      throw new Error('Phone number and email are required');
    }

    const userCheck = await checkUserRegisteredOrNot(
      phoneNumber,
      user.emailAddresses[0].emailAddress
    );

    if (userCheck.isRegistered) {
      setUserData(userCheck.user);
      return userCheck.user;
    }

    const location: LocationData = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    const registeredUser = await registerUser(
      user.emailAddresses[0].emailAddress,
      phoneNumber,
      location
    );

    if (!registeredUser) {
      throw new Error('Failed to register user');
    }

    setUserData(registeredUser);
    return registeredUser;
  };

  const onSubmit = async (formData: AddressFormData) => {
    setError(null);
    if (!phoneNumber) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);
    try {
      if (userData) {
        // If user data exists, directly update address
        await handleUpdateAddress(formData);
      } else {
        // If no user data, handle registration/login first
        const user = await handleUserRegistration();
        console.log("user retrive sucessfully::", user);
        
        // Then update address for the newly registered/retrieved user
        await handleUpdateAddress(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error in address submission:", error);
      setError(error instanceof Error ? error.message : "Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Add New Address</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                {...register('fullName', { required: 'Full name is required' })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="addressLine" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line
              </label>
              <input
                id="addressLine"
                type="text"
                {...register('addressLine', { required: 'Address is required' })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your address"
              />
              {errors.addressLine && (
                <p className="mt-1 text-sm text-red-600">{errors.addressLine.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code
                </label>
                <input
                  id="pinCode"
                  type="text"
                  {...register('pinCode', {
                    required: 'PIN Code is required',
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'Enter valid PIN code'
                    }
                  })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter PIN code"
                />
                {errors.pinCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.pinCode.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                Landmark (Optional)
              </label>
              <input
                id="landmark"
                type="text"
                {...register('landmark')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter landmark"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                         rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-primary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg 
                          ${loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-primary hover:bg-primary/90'} 
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                          flex items-center gap-2 cursor-pointer`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};