import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useCartStore from '../store/useCartStore';
import useUserStore from '../store/useUserStore';
import { useApiStore } from '../hooks/useApiStore';
import { AlertCircle, CreditCard, Truck, MapPin, ArrowLeft, Loader2 } from 'lucide-react';

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

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const defaultAddress = userData?.address?.[0];
  const formatAddress = () => {
    if (!defaultAddress) return 'Add delivery address';
    
    const parts = [];
    if (defaultAddress.city) parts.push(defaultAddress.city);
    if (defaultAddress.pinCode) parts.push(defaultAddress.pinCode);
    
    return parts.join(', ');
  };

  useEffect(() => {
    if (!userData) {
      navigate('/login');
    }
  }, [userData, navigate]);

  const handleCreateOrder = async () => {
    if (!userData?._id) {
      setError('User not authenticated');
      return;
    }

    if (items.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setIsLoading(true);
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
        useCartStore.getState().clearCart();
        navigate('/orders');
      }
    } catch (err) {
      setError('Failed to create order');
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
        <div className="flex items-center h-14 mb-2 shadow">
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
            {userData?.address?.map(addr => (
              <div 
                key={addr._id}
                className={`border p-4 rounded-lg mb-4 cursor-pointer ${
                  selectedAddress === addr._id 
                    ? 'border-primary bg-blue-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedAddress(addr._id)}
              >
                <p>{addr.fullName}</p>
                <p>{addr.addressLine}</p>
                <p>{addr.city}, {addr.pinCode}</p>
              </div>
            ))}
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

          {/* Order Button */}
          <button
            onClick={handleCreateOrder}
            className={`w-full mt-6 py-2 text-sm rounded-lg transition-colors flex items-center justify-center ${
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
  );
};

export default CheckoutPage;