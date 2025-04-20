import { useState, useEffect } from 'react';

interface StoreHoursState {
  isOpen: boolean;
  nextOpenTime: string;
}

export const useStoreHours = (): StoreHoursState => {
  const [storeState, setStoreState] = useState<StoreHoursState>({
    isOpen: true,
    nextOpenTime: '',
  });

  useEffect(() => {
    const checkStoreHours = () => {
      // Get current time in IST (UTC+5:30)
      const now = new Date();
      const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istTime = new Date(utcTime + (5.5 * 3600000)); // IST offset is UTC+5:30
      
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      
      // Store hours: 8:00 AM to 9:00 PM IST
      const isOpen = (hours >= 8 && hours < 21) || (hours === 21 && minutes === 0);
      
      console.log(`Current IST time: ${istTime.toISOString()} (${hours}:${minutes.toString().padStart(2, '0')})`);
      console.log(`Store is ${isOpen ? 'OPEN' : 'CLOSED'}`);
      
      // Calculate next opening time
      let nextOpenTime = '';
      if (!isOpen) {
        const tomorrow = new Date(istTime);
        if (hours >= 21) {
          // If after closing time, open tomorrow at 8 AM
          tomorrow.setDate(tomorrow.getDate() + 1);
        }
        tomorrow.setHours(8, 0, 0, 0); // 8:00 AM
        
        // Format time string
        const nextOpenDate = new Date(tomorrow);
        const formattedHour = nextOpenDate.getHours() % 12 || 12;
        const amPm = nextOpenDate.getHours() >= 12 ? 'PM' : 'AM';
        nextOpenTime = `${formattedHour}:00 ${amPm} IST`;
        
        console.log(`Next open time: ${nextOpenTime}`);
      }
      
      setStoreState({ isOpen, nextOpenTime });
    };
    
    // Check immediately when component mounts
    checkStoreHours();
    
    // Then check every minute
    const interval = setInterval(checkStoreHours, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return storeState;
}; 