import { useState } from 'react';
import { ArrowLeft, Plus, MapPin, Home, Building2, Briefcase } from 'lucide-react';
import useUserStore from '../store/useUserStore';
import { AddressForm } from '../components/AddressForm';
import { Address } from '../types/types';

const AddressPage = () => {
  const { userData } = useUserStore();
  const [showAddressForm, setShowAddressForm] = useState(false);

  const getAddressIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'office':
        return <Briefcase className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  const formatAddress = (address: Address) => {
    const parts = [];
    if (address.addressLine) parts.push(address.addressLine);
    if (address.landmark) parts.push(address.landmark);
    if (address.city) parts.push(address.city);
    if (address.pinCode) parts.push(address.pinCode);
    return parts.join(', ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button 
              onClick={() => window.history.back()}
              className="mr-3 hover:bg-gray-100 p-2 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Manage Addresses</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Add New Address Button */}
        <button
          onClick={() => setShowAddressForm(true)}
          className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 
                     bg-white border-2 border-dashed border-gray-300 rounded-lg
                     text-primary hover:border-primary transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add New Address</span>
        </button>

        {/* Addresses List */}
        {userData?.address && userData.address.length > 0 ? (
          <div className="space-y-4">
            {userData.address.map((address, index) => (
              <div 
                key={address._id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 
                         hover:border-primary transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                    {getAddressIcon(address.type || 'home')}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">
                        {address.fullName}
                      </h3>
                      {index === 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {formatAddress(address)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex justify-center items-center w-16 h-16 
                          bg-gray-100 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No addresses found
            </h3>
            <p className="text-gray-500 mb-6">
              Add your delivery address to get started
            </p>
          </div>
        )}
      </main>

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm onClose={() => setShowAddressForm(false)} />
      )}
    </div>
  );
};

export default AddressPage;