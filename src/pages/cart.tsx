import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import useUserStore from '../store/useUserStore';
import CartItems from '../components/CartItems';
import BillDetails from '../components/BillDetails';
import { useNavigate } from 'react-router';
import { AddressForm } from '../components/AddressForm';

const CartPage: React.FC = () => {
  const { userData, updateUserData } = useUserStore();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingAddress, setIsDeletingAddress] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const addresses = userData?.address || [];

  const defaultAddress = userData?.address?.[0];
  const formatAddress = () => {
    if (!defaultAddress) return 'Add delivery address';
    
    const parts = [];
    if (defaultAddress.city) parts.push(defaultAddress.city);
    if (defaultAddress.pinCode) parts.push(defaultAddress.pinCode);
    
    return parts.join(', ');
  };

  // Reset selected address if it doesn't exist in addresses
  useEffect(() => {
    if (selectedAddressId && !addresses.some(addr => addr._id === selectedAddressId)) {
      setSelectedAddressId('');
    }
  }, [addresses, selectedAddressId]);

  const handleAddAddress = () => {
    setShowAddressForm(true);
  };

  const handleAddressSelect = (addressId: string) => {
    console.log('Selecting address:', addressId);
    setSelectedAddressId(addressId);
  };

  const handleDeleteAddress = async (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeletingAddress(addressId);
    
    try {
      if (selectedAddressId === addressId) {
        setSelectedAddressId('');
      }
      
      const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
      
      if (userData) {
        const updatedUserData = {
          ...userData,
          address: updatedAddresses
        };
        updateUserData(updatedUserData);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setIsDeletingAddress(null);
    }
  };

  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    // If no address is selected and addresses exist, select the first one
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses[0]._id);
    }
  };
  
  const handlePaymentClick = async () => {
    if (!selectedAddressId) {
      console.error('No address selected');
      return;
    }
    
    setIsLoading(true);
    try {
      // Add your payment processing logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/checkout');
    } catch (error) {
      console.error('Payment navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-3 md:px-4 pb-24">
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
          <div className="flex items-center h-14 mb-2">
            <button 
              onClick={() => window.history.back()}
              className="mr-3"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <div className="flex-1">
              <div className="flex flex-col">
                <h1 className="text-sm font-medium">Delivery in 15 minutes</h1>
                <p className="text-xs text-gray-500">
                  {formatAddress()}
                </p>
              </div>
            </div>
          </div>
          <CartItems />
          <BillDetails />
        </div>
        <div className="mt-5">
          {addresses.length > 0 ? (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div 
                  key={address._id} 
                  onClick={() => handleAddressSelect(address._id)}
                  className={`p-4 rounded-lg bg-gray-50 border cursor-pointer transition-all
                    ${selectedAddressId === address._id 
                      ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                      : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{address.fullName}</p>
                      <p className="text-sm text-gray-600 mt-1">{address.addressLine}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.pinCode}
                      </p>
                      {address.landmark && (
                        <p className="text-sm text-gray-600 mt-1">
                          Landmark: {address.landmark}
                        </p>
                      )}
                    </div>
                    <div className="flex items-start space-x-4">
                      <button
                        onClick={(e) => handleDeleteAddress(address._id, e)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        disabled={isDeletingAddress === address._id}
                      >
                        {isDeletingAddress === address._id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-primary-text mb-4 text-sm font-bold">No addresses found</p>
          )}

          {showAddressForm && (
            <AddressForm onClose={handleCloseAddressForm} />
          )}

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleAddAddress}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-primary-text font-medium 
                       hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              + Add New Address
            </button>
            
            <button
              onClick={handlePaymentClick}
              disabled={!selectedAddressId || isLoading}
              className={`w-full py-2.5 px-4 rounded-lg font-medium text-white 
                        ${selectedAddressId && !isLoading
                          ? 'bg-primary hover:bg-primary/90' 
                          : 'bg-gray-400 cursor-not-allowed'} 
                        transition-colors flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;