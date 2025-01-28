import useCategoryStore from '../store/useCategoryStore';
import useProductStore from '../store/useProductStore';
import ProductCard from '../components/ProductCard';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router';
import { Product } from '../types/types';

const CategoryPage = () => {
  const { categories } = useCategoryStore();
  const { products } = useProductStore();
  const { categoryId } = useParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-14">
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
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Categories Sidebar */}
        <aside className="w-20 flex-shrink-0 border-r bg-white">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            {categories?.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryPress(category._id)}
                className={`w-full flex flex-col items-center p-3 transition-colors ${
                  category._id === selectedCategoryId 
                    ? 'bg-green-50 border-l-4 border-primary' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <img 
                  src={category.featuredImage}
                  alt={category.categoryName}
                  className="w-10 h-10 object-cover rounded-lg mb-1"
                />
                <span className={`text-xs font-bold text-center line-clamp-2 ${
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
          <div className="p-4">
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
  );
};

export default CategoryPage;