import { useState, useCallback } from 'react';
import { useLocationStore } from '../store/useLocationStore';

export const useGoogleLocation = (googleApiKey: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLocation } = useLocationStore();

   // Browser's native geolocation as fallback
   const getBrowserLocation = async (): Promise<{latitude: number; longitude: number}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          reject(new Error(`Failed to get location: ${err.message}`));
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  // Get current location using Google Geolocation API
  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First try Google Geolocation API
      if (!googleApiKey) {
        throw new Error('Google API key is not configured');
      }

      const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${googleApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // If Google API fails, try browser geolocation
        console.log('Falling back to browser geolocation...');
        return await getBrowserLocation();
      }

      const data = await response.json();
      
      return {
        latitude: data.location.lat,
        longitude: data.location.lng
      };
    } catch (err) {
      try {
        console.log('Falling back to browser geolocation...');
        return await getBrowserLocation();
      } catch (browserErr) {
        const errorMessage = browserErr instanceof Error ? browserErr.message : 'Failed to get location';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [googleApiKey, setLocation]);

  // Get route details using Google Directions API
  const getRouteDetails = useCallback(async (
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ) => {
    if (!googleApiKey) {
      throw new Error('Google API key is not configured');
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?` +
        `origin=${originLat},${originLng}&` +
        `destination=${destLat},${destLng}&` +
        `key=${googleApiKey}`
      );

      if (!response.ok) {
        throw new Error(`Failed to get route details: ${response.statusText}`);
      }


      const data = await response.json();
      if (data.status !== 'OK') {
        throw new Error(`Route details error: ${data.status}`);
      }

      return {
        route: data.routes[0],
        duration: data.routes[0].legs[0].duration.text,
        distance: data.routes[0].legs[0].distance.text,
        polyline: data.routes[0].overview_polyline.points
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get route details';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [googleApiKey]);

  return {
    getCurrentLocation,
    getRouteDetails,
    isLoading,
    error
  };
};