import useCategoryStore from '../store/useCategoryStore';
import useProductStore from '../store/useProductStore';
import ProductCard from '../components/ProductCard';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Product } from '../types/types';
import useUserStore from '../store/useUserStore';
import SearchBar from '../components/SearchBar';
import { Helmet } from 'react-helmet-async';

const CategoryPage = () => {
  const { categories } = useCategoryStore();
  const { products } = useProductStore();
  const { categoryId } = useParams();
  const { userData } = useUserStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };


  console.log("categories in my category page::", categories);
  const defaultAddress = userData?.address?.[0];
  const formatAddress = () => {
    if (!defaultAddress) return 'Add delivery address';
    
    const parts = [];
    if (defaultAddress.city) parts.push(defaultAddress.city);
    if (defaultAddress.pinCode) parts.push(defaultAddress.pinCode);
    
    return parts.join(', ');
  };

  
  useEffect(() => {
    if (categoryId) {
      setSelectedCategoryId(categoryId)
    } else if(categories && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0]?._id)
    }
  }, [categories, categoryId]);
  
  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const filteredProducts = products?.filter(
    product => product.categoryId === selectedCategoryId
  );

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Suvega | {categories?.find(category => category._id === selectedCategoryId)?.categoryName}</title>
        <meta name="description" content={`Explore ${categories?.find(category => category._id === selectedCategoryId)?.categoryName} products on Suvega.`} />
        <link rel="canonical" href={`https://suveganow.com/categories/${selectedCategoryId}`} />
        <meta property="og:title" content={`Suvega | ${categories?.find(category => category._id === selectedCategoryId)?.categoryName}`} />
        <meta property="og:description" content={`Explore ${categories?.find(category => category._id === selectedCategoryId)?.categoryName} products on Suvega.`} />
        <meta property="og:image" content="https://suveganow.com/og-image.png" />
        <meta property="og:url" content={`https://suveganow.com/categories/${selectedCategoryId}`} />
        <meta property="og:site_name" content="Suvega" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
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

      {/* Add padding to account for fixed header */}
      <div className="pt-32 sm:pt-0">
        <div className="flex max-w-7xl mx-auto">
          {/* Categories Sidebar */}
          <aside className="w-[70px] flex-shrink-0 border-r bg-white">
            <div className="sticky top-32 sm:top-20 h-[calc(100vh-130px)] sm:h-[calc(100vh-5rem)] overflow-y-auto pb-20">
              {categories?.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryPress(category._id)}
                  className={`w-full flex flex-col items-center py-2.5 px-1 transition-colors ${
                    category._id === selectedCategoryId 
                      ? 'bg-green-50 border-l-4 border-primary' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <img 
                    src={category.featuredImage}
                    alt={category.categoryName}
                    className="w-8 h-8 object-cover rounded-lg mb-1"
                  />
                  <span className={`text-[10px] leading-tight font-medium cursor-pointer text-center line-clamp-2 ${
                    category._id === selectedCategoryId ? 'text-primary' : 'text-gray-600'
                  }`}>
                    {category.categoryName}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <div className="p-4 sm:pt-6">
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts?.map((product: Product) => (
                  <div key={product._id} className="w-full h-full">
                    <div className="h-full flex flex-col">
                      <ProductCard
                        _id={product._id}
                        productName={product.productName}
                        description={product.description}
                        productImages={product.productImages}
                        price={product.price}
                        discountPrice={product.discountPrice}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {(!filteredProducts || filteredProducts.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-base">
                    No products found in this category
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;