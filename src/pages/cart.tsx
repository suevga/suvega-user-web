import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import useUserStore from '../store/useUserStore';
import CartItems from '../components/CartItems';
import BillDetails from '../components/BillDetails';
import { useNavigate } from 'react-router';
import { AddressForm } from '../components/AddressForm';
import { Address } from '../types/types'; // Make sure to import Address type
import { toast } from 'react-toastify';

const CartPage: React.FC = () => {
  const { userData, updateUserData } = useUserStore();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingAddress, setIsDeletingAddress] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Safely get addresses with strict type checking
  const addresses: Address[] = userData?.address ?? [];

  // Effect to handle automatic address selection
  useEffect(() => {
    // Check if we have addresses and no address is currently selected
    if (Array.isArray(addresses) && addresses.length > 0) {
      const firstAddress = addresses[0];
      // Only set if we have a valid address and it has an _id
      if (firstAddress && firstAddress._id) {
        setSelectedAddressId(firstAddress._id);
      }
    } else {
      // Reset selection if no addresses available
      setSelectedAddressId('');
    }
  }, [addresses]); // Depend on addresses array changes

  const formatAddress = () => {
    // Strict null checks for first address
    const firstAddress = Array.isArray(addresses) && addresses.length > 0 ? addresses[0] : null;
    
    if (!firstAddress) return 'Add delivery address';
    
    const parts: string[] = [];
    if (firstAddress.city) parts.push(firstAddress.city);
    if (firstAddress.pinCode) parts.push(firstAddress.pinCode);
    
    return parts.join(', ');
  };

  const handleAddAddress = () => {
    setShowAddressForm(true);
  };

  const handleAddressSelect = (addressId: string) => {
    if (addressId) {
      setSelectedAddressId(addressId);
    }
  };

  const handleDeleteAddress = async (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!addressId) return;
    
    setIsDeletingAddress(addressId);
    
    try {
      // Only proceed if we have valid userData and addresses
      if (userData && Array.isArray(addresses)) {
        const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
        
        const updatedUserData = {
          ...userData,
          address: updatedAddresses
        };
        
        updateUserData(updatedUserData);

        // If we deleted the selected address, select the first available address
        if (selectedAddressId === addressId) {
          const newFirstAddress = updatedAddresses[0];
          setSelectedAddressId(newFirstAddress ? newFirstAddress._id : '');
        }
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    } finally {
      setIsDeletingAddress(null);
    }
  };

  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    
    // After closing form, ensure first address is selected if available
    if (Array.isArray(addresses) && addresses.length > 0) {
      const firstAddress = addresses[0];
      if (firstAddress && firstAddress._id) {
        setSelectedAddressId(firstAddress._id);
      }
    }
  };
  
  const handlePaymentClick = async () => {
    if (!selectedAddressId) {
      toast.error('Please add a delivery address');
      return;
    }
    
    setIsLoading(true);
    try {
      // Add your payment processing logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/checkout');
    } catch (error) {
      console.error('Payment navigation error:', error);
      toast.error('Failed to proceed to payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-3 md:px-4 pb-24">
        <div className="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
          {/* Header Section */}
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

        {/* Addresses Section */}
        <div className="mt-5 max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
          {Array.isArray(addresses) && addresses.length > 0 ? (
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

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={handleAddAddress}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-primary-text font-medium 
                       hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
                        transition-colors flex items-center justify-center gap-2 cursor-pointer`}
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