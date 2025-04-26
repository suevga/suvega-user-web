import { useNavigate } from "react-router";
import useCartStore from "../store/useCartStore";
import CustomButton from "./CustomButton";

const CartItems = () => {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();
  
  const handleIncreaseQuantity = (id: string, quantity: number) => {
    updateQuantity(id, Math.min(quantity + 1, 5));
  };

  const handleDecreaseQuantity = (id: string, quantity: number) => {
    updateQuantity(id, Math.max(quantity - 1, 0));
  };
  
  const navigateToProduct = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${productId}`);
  };

  return (
  <div className="space-y-3 w-full">
    <h1 className="text-xl md:text-2xl font-bold">My Cart</h1>
    <h2 className="text-sm md:text-base font-bold text-gray-500">
      Delivery in 15 minutes
    </h2>

    {/* Empty cart state */}
    {items.length === 0 ? (
      <div className="text-center space-y-4 py-6">
        <p className="text-lg md:text-xl">Your cart is empty</p>
        <div className="max-w-xs mx-auto">
          <CustomButton
            title="Shop Now"
            onClick={() => navigate('/')}
          />
        </div>
      </div>
    ) : (
      // Cart items list
      <div className="space-y-2">
        {items.map((item) => (
          <div 
            key={item._id} 
            className="flex items-center p-2 bg-white rounded-lg shadow justify-between"
          >
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={(e) => navigateToProduct(item._id, e)}
            >
              {/* Product image */}
              <img 
                src={item.productImage} 
                alt={item.productName} 
                className="w-10 h-10 rounded object-contain"
              />
              
              {/* Product name */}
              <h3 className="text-xs font-semibold max-w-[80px] truncate">{item.productName}</h3>
            </div>

            {/* Price */}
            <p className="text-xs text-gray-600 mx-1">₹{item.price}</p>

            {/* Quantity controls */}
            <div className="flex items-center">
              <button
                className="p-1 bg-gray-200 rounded text-xs cursor-pointer"
                onClick={() => handleDecreaseQuantity(item._id, item.quantity)}
              >
                -
              </button>
              <span className="mx-1 text-xs">
                {item.quantity}
              </span>
              <button
                className="p-1 bg-gray-200 rounded text-xs cursor-pointer"
                onClick={() => handleIncreaseQuantity(item._id, item.quantity)}
              >
                +
              </button>
            </div>

            {/* Remove button */}
            <button
              className="text-xs text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              onClick={() => removeFromCart(item._id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
  )
};

export default CartItems;