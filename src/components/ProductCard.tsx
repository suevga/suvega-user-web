import { Link } from 'react-router';
import useCartStore from "../store/useCartStore";
import ImageViewer from './ImageViewer';
import CustomButton from './CustomButton';
import React from 'react';
import { ProductImage } from '../types/types';
import { formatDeliveryTime } from '../utilits/deliveryTime';

interface ProductCardProps {
  _id: string;
  productName: string;
  productImages: ProductImage[];
  price: number;
  discountPrice?: number;
  description: string;
  quantity?: number;
  deliveryTime?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ _id, productName, productImages, price, discountPrice, deliveryTime }) => {
  const { items, addToCart, updateQuantity } = useCartStore();
  const cartItem = items.find(item => item._id === _id);
  const quantity = cartItem?.quantity || 0;

  const convertToSecureUrl = (url: string) => {
    return url.replace('http://', 'https://');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      _id,
      productName,
      productImage: convertToSecureUrl(productImages[0].imageUrl),
      price: price,
      discountPrice: discountPrice
    });
  };
  
  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(_id, Math.min(quantity + 1, 5));
  };

  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(_id, Math.max(quantity - 1, 0));
  };

  const discountPercentage = discountPrice 
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  return (
    <Link to={`/product/${_id}`} className="block w-full max-w-xs mx-auto">
      <div className="relative bg-white rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-full">
        {/* Discount Badge */}
        {discountPrice && discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs sm:text-sm px-2 py-1 rounded-full z-10">
            {discountPercentage}% off
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-square w-full bg-gray-50 max-h-[180px] sm:max-h-[200px] lg:max-h-[160px]">
          {productImages?.[0]?.imageUrl ? (
            <ImageViewer
              src={convertToSecureUrl(productImages[0].imageUrl)}
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
              alt={productName}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Image unavailable
            </div>
          )}

          {/* Delivery Time Badge (overlay on image) */}
          {deliveryTime && (
            <span className="absolute bottom-3 right-2 bg-primary text-white text-[10px] sm:text-xs px-2 py-1 rounded-full">
              {formatDeliveryTime(deliveryTime)}
            </span>
          )}
        </div>

        {/* Content Container */}
        <div className="p-2 sm:p-3 space-y-1 sm:space-y-2">
          {/* Product Name */}
          <h2 className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2 min-h-[2.5em]">
            {productName}
          </h2>

          {/* Price Section */}
          <div className="flex items-center gap-2">
            {discountPrice ? (
              <>
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  ₹{discountPrice.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ₹{price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base font-bold text-gray-900">
                ₹{price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="pt-1 sm:pt-2">
            {quantity === 0 ? (
              <CustomButton
                onClick={handleAddToCart}
                className="w-full h-8 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 hover:opacity-90"
              >
                Add
              </CustomButton>
            ) : (
              <div className="flex items-stretch h-8 bg-secondaryBtnColor rounded-lg overflow-hidden">
                <CustomButton
                  onClick={handleDecreaseQuantity}
                  className="flex-1 font-bold flex items-center justify-center text-sm"
                >
                  −
                </CustomButton>
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-primary-text text-sm font-bold">
                    {quantity}
                  </span>
                </div>
                <CustomButton
                  onClick={handleIncreaseQuantity}
                  className="flex-1 font-bold flex items-center justify-center text-sm"
                >
                  +
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
