import React from 'react';
import { Link } from 'react-router';
import useProductStore from '../store/useProductStore';
import useCategoryStore from '../store/useCategoryStore';
import ProductCard from './ProductCard'; // Import the ProductCard component

interface ProductSectionProps {
  categoryId: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({ categoryId }) => {
  const { getProductsByCategory } = useProductStore();
  const { getCategoryById } = useCategoryStore();

  const products = getProductsByCategory(categoryId);
  const category = getCategoryById(categoryId);

  if (!products.length || !category) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-900">{category.categoryName}</h2>
        <Link
          to={`/categories/${categoryId}`}
          className="text-primary hover:text-secondary text-xs font-semibold"
        >
          see all
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(0, 8).map((product) => (
          <ProductCard
            key={product._id}
            _id={product._id}
            productName={product.productName}
            productImages={product.productImages}
            price={product.price}
            discountPrice={product.discountPrice}
            description={product.description}
            deliveryTime={product.deliveryTime}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSection;