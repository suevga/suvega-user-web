import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import useProductStore from '../store/useProductStore';
import useCartStore from '../store/useCartStore';
import SearchBar from '../components/SearchBar';
import ImageViewer from '../components/ImageViewer';
import CustomButton from '../components/CustomButton';
import useUserStore from '../store/useUserStore';
import { Helmet } from 'react-helmet-async';
import { formatDeliveryTime } from '../utilits/deliveryTime';

const SingleProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { userData } = useUserStore();
  const { products, getProductById } = useProductStore();
  const { items, addToCart, updateQuantity } = useCartStore();
  
  useEffect(() => {
    console.log("SingleProductPage mounted with productId:", productId);
    
    // Verify the product exists
    const product = getProductById(productId || '');
    if (!product && productId) {
      console.log("Product not found in store, id:", productId);
    } else if (product) {
      console.log("Product found in store:", product.productName);
    }
    
    // Force a re-render when productId changes to ensure the component updates
    if (productId) {
      setSelectedImageIndex(0); // Reset selected image when product changes
    }
  }, [productId, getProductById]);
  
  const handleProductClick = (newProductId: string) => {
    try {
      console.log('SingleProductPage navigating to product:', newProductId);
      setIsSearchActive(false);
      setSearchQuery('');
      
      // Force a navigation to refresh the component
      window.location.href = `/product/${newProductId}`;
      // navigate(`/product/${newProductId}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  
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

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold mb-4">Product not found</h2>
        <CustomButton onClick={() => navigate('/')} className="text-white py-2 px-4 rounded-lg">
          Return to Home
        </CustomButton>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16 sm:pb-0">
      <Helmet>
        <title>suvega | {product.productName}</title>
        <meta name="description" content={`Buy ${product.productName} online at the best price on suvega.`} />
        <link rel="canonical" href={`https://suveganow.com/product/${product._id}`} />
        <meta property="og:title" content={`suvega | ${product.productName}`} />
        <meta property="og:description" content={`Buy ${product.productName} online at the best price on suvega.`} />
        <meta property="og:image" content={product.productImages[0].imageUrl} />
        <meta property="og:url" content={`https://suveganow.com/product/${product._id}`} />
        <meta property="og:site_name" content="suvega" />
        <meta property="og:type" content="product" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`suvega | ${product.productName}`} />
        <meta property="og:image:type" content="image/png" />
      </Helmet>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white p-4 z-10 sm:hidden">
        <div className="flex items-center h-14 mb-2">
          <button 
            onClick={() => navigate(-1)}
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
    

      {/* Main Content */}
      <div className="pt-32 sm:pt-6 flex-grow mb-24 sm:mb-0">
        <div className="bg-white rounded-none sm:rounded-lg sm:max-w-6xl sm:mx-auto sm:my-4 sm:shadow-sm">
          <div className="sm:flex sm:flex-row">
            {/* Product Images - Smaller on desktop */}
            <div className="sm:w-1/2">
              {/* Main Image */}
              <div className="aspect-square sm:max-h-[500px]">
                <ImageViewer
                  src={product.productImages[selectedImageIndex].imageUrl}
                  alt={product.productName}
                  className="w-full h-full object-contain"
                  key={`product-image-${selectedImageIndex}`}
                />
              </div>

              {/* Thumbnail Gallery */}
              {product.productImages.length > 1 && (
                <div className="flex overflow-x-auto p-4 gap-2 justify-center">
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
            <div className="p-4 space-y-4 sm:w-1/2 sm:p-6">
              <h2 className="text-xl font-semibold sm:text-2xl">{product.productName}</h2>
              
              {/* Delivery Time Badge */}
              <div className="inline-block">
                <span className="bg-primary text-white text-sm px-3 py-1 rounded-full">
                  {formatDeliveryTime(product.deliveryTime)} delivery
                </span>
              </div>
              
              <div className="flex items-baseline gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg sm:text-xl">₹{product.discountPrice || product.price}</span>
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
              
              {/* Add to Cart Button for desktop */}
              <div className="hidden sm:block pt-4">
                {quantity === 0 ? (
                  <CustomButton 
                    onClick={handleAddToCart}
                    className="w-full max-w-xs text-white py-3 rounded-lg font-medium"
                  >
                    Add to cart
                  </CustomButton>
                ) : (
                  <div className="flex items-stretch h-12 bg-gray-100 rounded-lg overflow-hidden max-w-xs">
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
          </div>
        </div>
      </div>

      {/* Add to Cart Button - Mobile only, positioned at the bottom */}
      <div className={`fixed ${items.length > 0 ? 'bottom-16' : 'bottom-0'} left-0 right-0 p-4 bg-white border-t sm:hidden`}>
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