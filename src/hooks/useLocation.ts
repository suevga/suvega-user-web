import { useState, useEffect } from 'react'
import { useLocationStore } from '../store/useLocationStore'
import { useGoogleLocation } from './useGoogleLocation';
import { envConfig } from '../utilits/envConfig';


export const useLocation = () => {
  const [error, setError] = useState<string | null>(null)
  const { latitude, longitude, setLocation, setLoading } = useLocationStore()
  const { getCurrentLocation } = useGoogleLocation(envConfig.googleApiKey);

  const requestLocation = async () => {
    console.log("🔵 Requesting location...");
    try {
      setLoading(true);
      const location = await getCurrentLocation();
      setLocation(location.latitude, location.longitude);
      setError(null);
    } catch (err) {
      console.error("❌ Location fetch error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    requestLocation() // Always fetch location on mount
  }, [])

  return { 
    latitude, 
    longitude, 
    error, 
    requestLocation,
    openLocationSettings: () => {
      if (error?.includes('blocked')) {
        setError(
          'Location access is blocked. Please follow these steps to enable location access:\n' +
          '1. Click the lock/info icon in your browser\'s address bar\n' +
          '2. Click on "Site settings" or "Permissions"\n' +
          '3. Allow location access\n' +
          '4. Refresh the page'
        )
      }
    }
  }
}
