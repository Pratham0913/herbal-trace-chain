import { useState, useCallback } from 'react';

interface GeolocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
}

interface GeolocationError {
  code: number;
  message: string;
}

interface UseGeolocationReturn {
  location: GeolocationData | null;
  error: GeolocationError | null;
  isLoading: boolean;
  getCurrentLocation: () => Promise<GeolocationData>;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = useCallback((): Promise<GeolocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = {
          code: 1,
          message: 'Geolocation is not supported by this browser.'
        };
        setError(error);
        reject(error);
        return;
      }

      setIsLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: GeolocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
            accuracy: position.coords.accuracy
          };
          
          setLocation(locationData);
          setIsLoading(false);
          resolve(locationData);
        },
        (error) => {
          const geoError = {
            code: error.code,
            message: error.message
          };
          setError(geoError);
          setIsLoading(false);
          reject(geoError);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }, []);

  return {
    location,
    error,
    isLoading,
    getCurrentLocation
  };
};