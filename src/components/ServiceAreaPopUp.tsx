import useUserStore from '../store/useUserStore';
import { X } from 'lucide-react';

const ServiceAreaPopup = () => {

  const { outOfService, setOutOfService } = useUserStore();

  if (!outOfService) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6 mx-4 animate-fade-in">
        {/* Close button */}
        <button 
          onClick={() => setOutOfService(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          aria-label="Close popup"
        >
          <X/>
        </button>

        {/* Content */}
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Coming Soon to Your Area!
          </h3>
          
          <p className="text-gray-600">
            We're not available in your area yet, but we've noted your location!
          </p>
          
          <p className="text-sm text-gray-500">
            Thank you for your interest. We're expanding quickly and hope to serve your area soon.
          </p>

          <button
            onClick={() => setOutOfService(false)}
            className="w-full mt-6 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaPopup;