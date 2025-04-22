import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '@clerk/clerk-react';
import useUserStore from '../store/useUserStore';
import { useLocationStore } from '../store/useLocationStore';
import { useApiStore } from '../hooks/useApiStore';
import { Loader2 } from 'lucide-react';
import { LocationData } from '../types/types';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

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
    // Extract the phone number without the prefix for validation
    const numberOnly = phoneNumber.replace(/\D/g, '').slice(-10);
    
    if (!phoneRegex.test(numberOnly)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!latitude || !longitude) {
      setError('Location access is required. Please enable location services.');
      return;
    }
    setLoading(true)
    try {
      console.log("phone number before request::", numberOnly);
      console.log("email before request::", user?.emailAddresses[0]?.emailAddress);
      
      // First check if user already exists
      const userExists = await checkUserRegisteredOrNot(
        numberOnly,
        user?.emailAddresses[0]?.emailAddress || ''
      );

      console.log("user registered::", userExists);
      
      if (userExists.isRegistered) {
        toast.done("user already registered")
        setUserData(userExists.user);
        setStoredPhoneNumber(numberOnly);
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
          numberOnly,
          locationData
        );
        
        console.log("response after sending user data::", registeredUser);
        
        
        if (registeredUser) {
          toast.done("user registered sucessfully")
          setUserData(registeredUser);
          setStoredPhoneNumber(numberOnly);
          navigate('/');
          return;
        }
        console.log("phone number from use state in onboard::", numberOnly);
      } catch (registerError) {
        setUserData({
          ...userData,
          phoneNumber: numberOnly,
        } as any);
        setStoredPhoneNumber(numberOnly);
        toast.error("error when user register")
        navigate('/');
      }
      setStoredPhoneNumber(numberOnly);
    } catch (err) {
      console.error("Registration error:", err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-primary-background">
      <Helmet>
        <title>Suvega | Complete Your Profile</title>
        <meta name="description" content="Complete your profile to continue shopping on Suvega." />
        <link rel="canonical" href="https://suveganow.com/onboard" />
        
      </Helmet>
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
            <div className="flex">
              <div className="flex items-center justify-center px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                +91
              </div>
              <input
                id="phone"
                type="tel"
                placeholder="Enter your 10-digit phone number"
                value={phoneNumber.startsWith('+91') ? phoneNumber.slice(3) : phoneNumber}
                onChange={(e) => {
                  setError('');
                  const inputValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhoneNumber(inputValue);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
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