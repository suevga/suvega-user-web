import { ArrowLeft, MapPin, Phone, User } from 'lucide-react';
import useUserStore from '../store/useUserStore';
import { Address } from '../types/types';
import SearchBar from '../components/SearchBar';
import useProductStore from '../store/useProductStore';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const ProfilePage = () => {
  const { userData } = useUserStore();
  const { products } = useProductStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Filter products for search
  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const formatAddress = (address: Address) => {
    const parts = [];
    if (address?.addressLine) parts.push(address?.addressLine);
    if (address?.city) parts.push(address?.city);
    if (address?.pinCode) parts.push(address?.pinCode);
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
      <Helmet>
        <title>suvega | My Profile</title>
        <meta name="description" content="View your profile information on suvega." />
        <link rel="canonical" href="https://suveganow.com/profile" />
        <meta property="og:title" content="suvega | My Profile" />
        <meta property="og:description" content="View your profile information on suvega." />
        <meta property="og:image" content="https://suveganow.com/og-image.png" />
        <meta property="og:url" content="https://suveganow.com/profile" />
        <meta property="og:site_name" content="suvega" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
      </Helmet>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white p-4 z-10 sm:hidden">
        <div className="flex items-center h-14 mb-2">
          <button 
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          {/* Location Info */}
          <div className="flex-1">
            <div className="flex flex-col">
              <h1 className="text-sm font-medium">Delivery in 15 minutes</h1>
              <p className="text-xs text-gray-500">
                {formatAddress(userData?.address?.[0])}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar - Only visible on mobile */}
        <SearchBar
          className="w-full"
          isMobile={true}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchActive={isSearchActive}
          setIsSearchActive={setIsSearchActive}
          filteredProducts={filteredProducts}
          onProductClick={handleProductClick}
        />
      </div>

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