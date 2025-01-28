import React from 'react';
import useCartStore from '../store/useCartStore';
import CustomButton from '../components/CustomButton';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart } = useCartStore();

  const handleIncreaseQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecreaseQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity - 1);
  };

  const CartItems = () => (
    <div className="space-y-4 w-full">
      {/* Header section with responsive text sizes */}
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">My Cart</h1>
      <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-500">
        Delivery in 15 minutes
      </h2>

      {/* Empty cart state */}
      {items.length === 0 ? (
        <div className="text-center space-y-4 py-8">
          <p className="text-xl md:text-2xl">Your cart is empty</p>
          <div className="max-w-xs mx-auto">
            <CustomButton
              title="Shop Now"
              onClick={() => navigate('/')}
            />
          </div>
        </div>
      ) : (
        // Cart items list
        <div className="space-y-4">
          {items.map((item) => (
            <div 
              key={item._id} 
              className="flex flex-col sm:flex-row items-start sm:items-center p-3 md:p-4 bg-white rounded-lg shadow gap-4 sm:gap-0"
            >
              {/* Product image - responsive size */}
              <div className="w-full sm:w-auto flex justify-center sm:block">
                <img 
                  src={item.productImage} 
                  alt={item.productName} 
                  className="w-24 h-24 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded object-contain"
                />
              </div>

              {/* Product details */}
              <div className="flex-1 w-full sm:ml-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                  <h3 className="text-base md:text-lg font-semibold">{item.productName}</h3>
                  <p className="text-sm md:text-base text-gray-600">₹{item.price}</p>
                </div>

                {/* Quantity controls and remove button */}
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center">
                    <button
                      className="p-1.5 md:p-2 bg-gray-200 rounded text-sm md:text-base"
                      onClick={() => handleDecreaseQuantity(item._id, item.quantity)}
                    >
                      -
                    </button>
                    <span className="mx-3 md:mx-4 text-sm md:text-base">
                      {item.quantity}
                    </span>
                    <button
                      className="p-1.5 md:p-2 bg-gray-200 rounded text-sm md:text-base"
                      onClick={() => handleIncreaseQuantity(item._id, item.quantity)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="text-sm md:text-base text-red-500 hover:text-red-600 transition-colors"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const BillDetails = () => {
    const subtotalBeforeDiscount = useCartStore(state => state.getSubtotalBeforeDiscount());
    const subtotalAfterDiscount = useCartStore(state => state.getSubtotalAfterDiscount());
    const deliveryCharge = useCartStore(state => state.getDeliveryCharge());
    const totalAmount = useCartStore(state => state.getTotalAmount());
    const totalSavings = useCartStore(state => state.getTotalSavings());
    const savingsPercentage = useCartStore(state => state.getSavingsPercentage());

    return items.length > 0 ? (
      <div className="space-y-4">
        <h2 className="font-extrabold text-base md:text-lg lg:text-xl underline mt-6">
          Bill Details
        </h2>
        <div className="p-3 md:p-4 bg-white rounded-lg shadow space-y-2">
          <div className="flex justify-between">
            <span className="text-xs md:text-sm font-bold text-gray-600">Total MRP:</span>
            <span className="text-xs md:text-sm">₹{subtotalBeforeDiscount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-xs md:text-sm font-bold text-gray-600">Discounted Price:</span>
            <span className="text-xs md:text-sm text-primary font-semibold">₹{subtotalAfterDiscount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-xs md:text-sm font-bold text-gray-600">You Save:</span>
            <span className="text-xs md:text-sm text-primary font-semibold">
              ₹{totalSavings} ({savingsPercentage.toFixed(1)}% OFF)
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-xs md:text-sm font-bold text-gray-600">Delivery Charge:</span>
            <span className="text-xs md:text-sm">₹{deliveryCharge}</span>
          </div>
          
          <div className="h-px bg-gray-200 my-2" />
          
          <div className="flex justify-between">
            <span className="text-base md:text-lg font-bold">Total Amount:</span>
            <span className="text-base md:text-lg font-bold text-primary">
              ₹{totalAmount}
            </span>
          </div>
        </div>
      </div>
    ) : null;
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
            
            {/* Location Selector */}
            <div className="flex-1">
              <div className="flex flex-col">
                <h1 className="text-sm font-medium">Delivery in 15 minutes</h1>
                <p className="text-xs text-gray-500">Lakwa, India</p>
              </div>
            </div>
          </div>
          <CartItems />
          <BillDetails />
        </div>
      </div>
    </div>
  );
};

export default CartPage;