import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useCartStore from '../store/useCartStore';
import useUserStore from '../store/useUserStore';
import { useApiStore } from '../hooks/useApiStore';
import { AlertCircle, CreditCard, Truck, MapPin, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify'; 
import useOrderStore from '../store/useOrderStore';
import SearchBar from '../components/SearchBar';
import useProductStore from '../store/useProductStore';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    getSubtotalAfterDiscount, 
    getDeliveryCharge, 
    getTotalAmount 
  } = useCartStore();
  const { userData } = useUserStore();
  const { createOrder } = useApiStore();
  const { products } = useProductStore();

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const defaultAddress = userData?.address?.[0];
  
  // Filter products for search
  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  
  const formatAddress = () => {
    const selectedAddressData = addresses.find(addr => addr._id === selectedAddress);
    
    if (!selectedAddressData) return 'Select delivery address';
    
    const parts = [];
    if (selectedAddressData.city) parts.push(selectedAddressData.city);
    if (selectedAddressData.pinCode) parts.push(selectedAddressData.pinCode);
    
    return parts.join(', ');
  };


  console.log("default address in my checkout page::", defaultAddress);
  // Get the addresses from userData safely
  const addresses = userData?.address || [];

  useEffect(() => {
    // If we have addresses but no selection, select the first address
    if (Array.isArray(addresses) && addresses.length > 0 && !selectedAddress) {
      const firstAddress = addresses[0];
      if (firstAddress?._id) {
        setSelectedAddress(firstAddress._id);
      }
    }
  }, [addresses, selectedAddress]);

  useEffect(() => {
    if (!userData) {
      toast.error('User not authenticated');
      navigate('/login');
    }
    if (!Array.isArray(addresses) || addresses.length === 0) {
      toast.error('Please add a delivery address');
      navigate('/cart');
    }
  }, [userData, navigate, addresses]);
  
  const handleCreateOrder = async () => {
    if (!userData?._id) {
      toast.error('User not authenticated for creating order');
      setError('User not authenticated');
      return;
    }
    
    if (items.length === 0) {
      toast.error('your cart is empty');
      setError('Cart is empty');
      return;
    }
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      setError('Delivery address is required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const orderItems = items.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.discountPrice || item.price
      }));

      const orderResponse = await createOrder(
        userData._id, 
        {
          items: orderItems,
          totalPrice: getTotalAmount(),
          darkStoreId: userData.storeId,
          paymentMethod
        }
      );
      console.log("order response in my checkout page::", orderResponse);
      
      if (orderResponse && orderResponse.userId) {
        toast.done('Order placed successfully');
        useCartStore.getState().clearCart();
        // Add the new order to the order store
        const { addOrder } = useOrderStore.getState();
        addOrder(orderResponse);

        navigate('/orders');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isPlaceOrderDisabled = 
    isLoading || 
    items.length === 0 || 
    !paymentMethod || 
    !selectedAddress;

  return (
    <div className="container mx-auto px-4 min-h-screen">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white p-4 z-10 sm:hidden">
        <div className="flex items-center h-14 mb-2">
          <button 
            onClick={() => navigate('/')}
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
      <br/>
      <br/>
        {/* Order Summary */}
        <h2 className="text-lg font-bold mb-6">Order Summary</h2>
        <div className="bg-white rounded-lg shadow-md p-2">
          {items.map(item => (
            <div key={item._id} className="flex justify-between items-center mb-4 pb-4 border-b">
              <div className="flex items-center space-x-4">
                <img 
                  src={item.productImage} 
                  alt={item.productName} 
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-bold">
                ₹{(item.discountPrice || item.price) * item.quantity}
              </p>
            </div>
          ))}
          
          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{getSubtotalAfterDiscount()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>₹{getDeliveryCharge()}</span>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span className="text-primary">₹{getTotalAmount()}</span>
            </div>
          </div>
        </div>

        {/* Checkout Details */}
        <div className="bg-white rounded-lg shadow-md p-2">
          <h2 className="text-lg font-bold mb-6">Checkout Details</h2>
          
          {/* Address Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 text-primary" /> Delivery Address
            </h3>
            {addresses.length > 0 ? (
              addresses.map(addr => (
                <div 
                  key={addr._id}
                  className={`border p-4 rounded-lg mb-4 cursor-pointer transition-all ${
                    selectedAddress === addr._id 
                      ? 'border-primary bg-blue-50 ring-2 ring-primary ring-opacity-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAddress(addr._id)}
                >
                  <p className="font-medium">{addr.fullName}</p>
                  <p className="text-sm text-gray-600">{addr.addressLine}</p>
                  <p className="text-sm text-gray-600">{addr.city}, {addr.pinCode}</p>
                  {addr.landmark && (
                    <p className="text-sm text-gray-500 mt-1">Landmark: {addr.landmark}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center p-4 border border-dashed rounded-lg">
                <p className="text-gray-500">No delivery addresses found</p>
                <button
                  onClick={() => navigate('/cart')}
                  className="mt-2 text-primary hover:underline"
                >
                  Add New Address
                </button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2 text-primary" /> Payment Method
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {['cash', 'card', 'upi'].map(method => (
                <button
                  key={method}
                  className={`py-2 rounded-md border text-sm ${
                    method === 'cash'
                      ? paymentMethod === method 
                        ? 'bg-secondary text-white border-primary'
                        : 'bg-gray-100 text-gray-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => method === 'cash' && setPaymentMethod(method as 'cash' | 'card' | 'upi')}
                  disabled={method !== 'cash'}
                >
                  {method.toUpperCase()}
                  {method !== 'cash' && (
                    <span className="block text-xs">(Coming Soon)</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Error Handling */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded relative flex items-center">
              <AlertCircle className="mr-2 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Order Button - For larger screens */}
          <div className="hidden md:block">
            <button
              onClick={handleCreateOrder}
              className={`w-full mt-6 py-2 text-sm rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
                isPlaceOrderDisabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-secondary'
              }`}
              disabled={isPlaceOrderDisabled}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Truck className="mr-2" />
              )}
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Order Button - For mobile screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-10">
        <button
          onClick={handleCreateOrder}
          className={`w-full py-3 text-sm rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
            isPlaceOrderDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-secondary'
          }`}
          disabled={isPlaceOrderDisabled}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Truck className="mr-2" />
          )}
          {isLoading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;