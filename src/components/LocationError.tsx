import React from 'react';
import { Settings, RefreshCw } from 'lucide-react';

interface LocationErrorProps {
  message: string;
  onRetry: () => void;
  onOpenSettings?: () => void;
}

export const LocationError: React.FC<LocationErrorProps> = ({ 
  message, 
  onRetry, 
  onOpenSettings 
}) => {
  const isBlocked = message.toLowerCase().includes('blocked') || 
                    message.toLowerCase().includes('denied');

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-primary-background)] p-4">
      <div className="w-full max-w-md mx-auto xs:max-w-lg 2xl:max-w-xl 3xl:max-w-2xl">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-xl xs:text-2xl 2xl:text-3xl font-bold text-[var(--color-primary-text)] mb-3">
              Location Access Required
            </h2>
            <p className="text-sm xs:text-base 2xl:text-lg text-gray-600 mb-4">
              {message}
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button 
              onClick={onRetry}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-[var(--color-secondary-text)] py-3 rounded-lg transition-colors flex items-center justify-center text-sm xs:text-base"
            >
              <RefreshCw className="mr-2 h-4 w-4 xs:h-5 xs:w-5" />
              Try Again
            </button>
            
            {isBlocked && (
              <button 
                onClick={onOpenSettings}
                className="w-full bg-[var(--color-primary-background)] hover:bg-gray-200 text-[var(--color-primary-text)] py-3 rounded-lg transition-colors flex items-center justify-center text-sm xs:text-base"
              >
                <Settings className="mr-2 h-4 w-4 xs:h-5 xs:w-5" />
                Open Settings
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};