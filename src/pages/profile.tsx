import { ArrowLeft, MapPin, Phone, User } from 'lucide-react';
import useUserStore from '../store/useUserStore';
import { Address } from '../types/types';

const ProfilePage = () => {
  const { userData } = useUserStore();

  const formatAddress = (address: Address) => {
    const parts = [];
    if (address.addressLine) parts.push(address.addressLine);
    if (address.city) parts.push(address.city);
    if (address.pinCode) parts.push(address.pinCode);
    return parts.join(', ');
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button 
              onClick={() => window.history.back()}
              className="mr-3 hover:bg-gray-100 p-2 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-sm font-medium">Delivery in 15 minutes</h1>
              <p className="text-xs text-gray-500">
                {userData.address?.map(address => address.city)}
                {"\n"},
                {userData.address?.map(address => address.addressLine)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-xl font-bold text-primary-text">My Profile</h1>
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-2 mb-6 mt-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="bg-gray-100 rounded-full p-3">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
                <div className="flex items-center text-gray-500 mt-1">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{userData.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Delivery Addresses</h3>
          </div>

          <div className="space-y-4">
            {userData && userData.address &&  userData.address.map((address, index) => (
              <div 
                key={address._id} 
                className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{address.fullName}</h4>
                      {index === 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-start mt-2 text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                      <p className="text-sm">{formatAddress(address)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;