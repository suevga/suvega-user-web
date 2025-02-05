import { useNavigate } from "react-router";
import useCartStore from "../store/useCartStore";
import CustomButton from "./CustomButton";

const CartItems = () => {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const handleIncreaseQuantity = (id: string, quantity: number) => {
    updateQuantity(id, Math.min(quantity + 1, 5));
  };
  const navigate = useNavigate();

  const handleDecreaseQuantity = (id: string, quantity: number) => {
    updateQuantity(id, Math.max(quantity - 1, 0));
  };

  return (
  <div className="space-y-4 w-full">
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
                    className="p-1.5 md:p-2 bg-gray-200 rounded text-sm md:text-base cursor-pointer"
                    onClick={() => handleDecreaseQuantity(item._id, item.quantity)}
                  >
                    -
                  </button>
                  <span className="mx-3 md:mx-4 text-sm md:text-base">
                    {item.quantity}
                  </span>
                  <button
                    className="p-1.5 md:p-2 bg-gray-200 rounded text-sm md:text-base cursor-pointer"
                    onClick={() => handleIncreaseQuantity(item._id, item.quantity)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="text-sm md:text-base text-red-500 hover:text-red-600 transition-colors cursor-pointer"
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
  )
};

export default CartItems;