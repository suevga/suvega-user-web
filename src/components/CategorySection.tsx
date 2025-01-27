import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import CategoryCard from './CategoryCard';
import useCategoryStore from '../store/useCategoryStore';



const CategorySection = () => {
  const { categories } = useCategoryStore();

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm md:text-2xl font-bold text-gray-800">Shop by Category</h2>
        <Link 
          to="/categories" 
          className="text-primary text-sm md:text-base flex items-center gap-1 hover:text-secondary underline"
        >
          see all
          <ChevronRight size={14} />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        {categories && categories.slice(0, 6).map((category) => (
          <div key={category._id} className="w-full max-w-[200px] mx-auto h-full">
            <CategoryCard
              _id={category._id}
              categoryName={category.categoryName}
              featuredImage={category.featuredImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;