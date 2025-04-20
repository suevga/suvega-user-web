import React from 'react';
import { X } from 'lucide-react';

interface StoreHoursPopupProps {
  onClose?: () => void;
  nextOpenTime?: string;
}

const StoreHoursPopup: React.FC<StoreHoursPopupProps> = ({ onClose, nextOpenTime }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6 mx-4 animate-fade-in">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            aria-label="Close popup"
          >
            <X/>
          </button>
        )}

        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Store is Closed
          </h3>
          
          <p className="text-gray-600">
            Thank you for your interest 🙏 Our store is currently closed. We're open daily from 8:00 AM to 9:00 PM IST.
          </p>
          
          <p className="text-sm text-gray-500">
            {nextOpenTime 
              ? `We'll be open again at ${nextOpenTime}. Thank you for your patience!` 
              : "Please check back during our operating hours."}
          </p>

          {onClose && (
            <button
              onClick={onClose}
              className="w-full mt-6 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Got it
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreHoursPopup; 