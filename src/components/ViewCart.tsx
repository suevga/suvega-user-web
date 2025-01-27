import React from 'react';
import useCartStore from '../store/useCartStore';
import { useNavigate } from 'react-router';
import CustomButton from './CustomButton';
import { ArrowRight, ShoppingCart } from 'lucide-react';

export function withCartIndicator<P extends { [key: string]: any }>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithCartIndicatorComponent(props: P) {
    const { items, getTotalAmount } = useCartStore();
    const navigate = useNavigate();
    const hasItems = items.length > 0;
    const totalAmount = getTotalAmount();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const handleCartPress = () => {
      navigate('/cart');
    };

    return (
      <div className="relative w-full">
        <WrappedComponent {...props} />
        
        {hasItems && (
          <div className="fixed bottom-0 left-0 w-full z-50 sm:hidden pb-2">
            <CustomButton
              onClick={handleCartPress}
              className="w-[95%] mx-auto block h-10 bg-secondary rounded-lg px-4 py-2 flex items-center justify-between shadow-md"
            >
              <div className="flex items-center space-x-2">
                <ShoppingCart width={24} height={24} color='#FF0A81'/>
                <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                  <p className="text-primary text-sm font-bold">
                    {itemCount}
                  </p>
                </div>
                <p className="text-white font-bold">
                  ₹{totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-white text-sm font-bold underline">
                  view cart
                </p>
                <ArrowRight width={16} height={16} color='#FF0A81'/>
              </div>
            </CustomButton>
          </div>
        )}
      </div>
    );
  };
}