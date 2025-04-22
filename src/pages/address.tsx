import { useState } from 'react';
import { ArrowLeft, Plus, MapPin, Home, Building2, Briefcase } from 'lucide-react';
import useUserStore from '../store/useUserStore';
import { AddressForm } from '../components/AddressForm';
import SearchBar from '../components/SearchBar';
import useProductStore from '../store/useProductStore';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';

const AddressPage = () => {
  const { userData } = useUserStore();
  const { products } = useProductStore();
  const navigate = useNavigate();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const address = userData?.address?.[0];
  // Filter products for search
  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

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

  const formatAddress = () => {
    if (!address) return 'Add delivery address';
    const parts = [];
    if (address.addressLine) parts.push(address.addressLine);
    if (address.city) parts.push(address.city);
    return parts.join(', ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Suvega | Address</title>
        <meta name="description" content="Add or manage your delivery address on Suvega." />
        <link rel="canonical" href="https://suveganow.com/address" />
        <meta property="og:title" content="Suvega | Address" />
        <meta property="og:description" content="Add or manage your delivery address on Suvega." />
        <meta property="og:image" content="https://suveganow.com/og-image.png" />
        <meta property="og:url" content="https://suveganow.com/address" />
        <meta property="og:site_name" content="Suvega" />
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
                {formatAddress()}
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20">
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
                      {formatAddress()}
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