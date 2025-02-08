import { useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import SearchBar from '../components/SearchBar';
import ImageViewer from '../components/ImageViewer';
import CustomButton from '../components/CustomButton';
import useUserStore from '../store/useUserStore';

const SingleProductPage = () => {
  const { productId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { userData } = useUserStore();
  const { products, getProductById } = useProductStore();
  const { items, addToCart, updateQuantity } = useCartStore();
  
  const product = getProductById(productId || '');
  const cartItem = items.find(item => item._id === productId);
  const quantity = cartItem?.quantity || 0;

  const defaultAddress = userData?.address?.[0];
  const formatAddress = () => {
    if (!defaultAddress) return 'Add delivery address';
    
    const parts = [];
    if (defaultAddress.city) parts.push(defaultAddress.city);
    if (defaultAddress.pinCode) parts.push(defaultAddress.pinCode);
    
    return parts.join(', ');
  };

  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const handleProductClick = (productId: string) => {
  //   setIsSearchActive(false);
  //   setSearchQuery('');
  //   window.location.href = `/product/${productId}`;
  // };

  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      productName: product.productName,
      productImage: product.productImages[0].imageUrl,
      price: product.price,
      discountPrice: product.discountPrice,
    });
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(product._id, newQuantity);
  };

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white p-4 z-10">
        <div className="flex items-center h-14 mb-2">
          <button 
            onClick={() => window.history.back()}
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

        {/* Search Bar */}
        <SearchBar
          className="w-full"
          isMobile={true}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchActive={isSearchActive}
          setIsSearchActive={setIsSearchActive}
          // onProductClick={handleProductClick}
          filteredProducts={filteredProducts}
        />
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-24">
        <div className="bg-white rounded-none">
          {/* Product Images */}
          <div className="relative">
            {/* Main Image */}
            <div className="aspect-square">
              <ImageViewer
                src={product.productImages[selectedImageIndex].imageUrl}
                alt={product.productName}
                className="w-full h-full object-contain"
                key={`product-image-${selectedImageIndex}`}
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.productImages.length > 1 && (
              <div className="flex overflow-x-auto p-4 gap-2">
                {product.productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 
                      ${selectedImageIndex === index ? 'border-primary' : 'border-gray-200'}`}
                  >
                    <ImageViewer
                      key={image._id}
                      src={image.imageUrl}
                      alt={`${product.productName} - ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">{product.productName}</h2>
            
            <div className="flex items-baseline gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">₹{product.discountPrice || product.price}</span>
                {product.discountPrice && (
                  <>
                    <span className="text-sm text-gray-500 line-through">MRP ₹{product.price}</span>
                    <span className="text-sm text-utility-color">{discountPercentage}% OFF</span>
                  </>
                )}
              </div>
            </div>

            {/* Product Description */}
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="fixed bottom-10 left-0 right-0 p-4 bg-white border-t">
        {quantity === 0 ? (
          <CustomButton 
            onClick={handleAddToCart}
            className="w-full text-white py-3 rounded-lg font-medium"
          >
            Add to cart
          </CustomButton>
        ) : (
          <div className="flex items-stretch h-12 bg-gray-100 rounded-lg overflow-hidden">
            <CustomButton 
              onClick={() => handleUpdateQuantity(Math.max(quantity - 1, 0))}
              className="flex-1 font-bold"
            >
              −
            </CustomButton>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-gray-900 font-bold">{quantity}</span>
            </div>
            <CustomButton 
              onClick={() => handleUpdateQuantity(Math.min(quantity + 1, 5))}
              className="flex-1 font-bold"
            >
              +
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProductPage;