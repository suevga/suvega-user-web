import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '@clerk/clerk-react';
import useUserStore from '../store/useUserStore';
import { useLocationStore } from '../store/useLocationStore';
import { useApiStore } from '../hooks/useApiStore';
import { Loader2 } from 'lucide-react';
import { LocationData } from '../types/types';
import { toast } from 'react-toastify';


const OnboardPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const { setPhoneNumber: setStoredPhoneNumber, phoneNumber: storedPhoneNumber, setUserData, userData } = useUserStore();
  const { latitude, longitude } = useLocationStore();

  console.log("latitude in onboard loading::", latitude);
  console.log("longitude in onboard loading::", longitude);

  const { 
    checkUserRegisteredOrNot, 
    registerUser
  } = useApiStore();

  console.log("stored phone number in onboard page::", storedPhoneNumber);
  
   // Check if onboarding is already completed
   useEffect(() => {
    if (storedPhoneNumber) {
      navigate('/');
    }
  }, [storedPhoneNumber, navigate]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!latitude || !longitude) {
      setError('Location access is required. Please enable location services.');
      return;
    }
    setLoading(true)
    try {
      console.log("phone number before request::", phoneNumber);
      console.log("email before request::", user?.emailAddresses[0]?.emailAddress);
      
      // First check if user already exists
      const userExists = await checkUserRegisteredOrNot(
        phoneNumber,
        user?.emailAddresses[0]?.emailAddress || ''
      );

      console.log("user registered::", userExists);
      
      if (userExists.isRegistered) {
        toast.done("user already registered")
        setUserData(userExists.user);
        setStoredPhoneNumber(phoneNumber);
        navigate('/');
        return;
      }
      
      // Modified location structure to match backend expectations
      const locationData: LocationData = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      console.log("location data before sending to backend::", locationData);
      
      try {
        const registeredUser = await registerUser(
          user?.emailAddresses[0]?.emailAddress || '',
          phoneNumber,
          locationData
        );
        
        console.log("response after sending user data::", registeredUser);
        
        
        if (registeredUser) {
          toast.done("user registered sucessfully")
          setUserData(registeredUser);
          setStoredPhoneNumber(phoneNumber);
          navigate('/');
          return;
        }
        console.log("phone number from use state in onboard::", phoneNumber);
      } catch (registerError) {
        setUserData({
          ...userData,
          phoneNumber: phoneNumber,
        } as any);
        setStoredPhoneNumber(phoneNumber);
        toast.error("error when user register")
        navigate('/');
      }
      setStoredPhoneNumber(phoneNumber);
    } catch (err) {
      console.error("Registration error:", err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-primary-background">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center text-primary-text">
            Complete Your Profile
          </h1>
        </div>
        
        <form onSubmit={handlePhoneSubmit} className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="phone" 
              className="block text-sm font-medium text-primary-text"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter your 10-digit phone number"
              value={phoneNumber}
              onChange={(e) => {
                setError('');
                setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {error && (
              <p className="text-utility-text text-sm">{error}</p>
            )}
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-primary text-secondary-text text-center py-2 px-4 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
          >
            {
              loading ? <Loader2/> : "continue"
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardPage;