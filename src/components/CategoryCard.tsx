import React from 'react';
import { Link } from 'react-router';
import { Category } from '../types/types';


const CategoryCard: React.FC<Category> = ({ _id, categoryName, featuredImage }) => {
  return (
    <Link to={`/categories/${_id}`} className="block w-full h-full">
      <div className="bg-white rounded-lg p-3 md:p-4 transition-all shadow-md h-full flex flex-col">
        <div className="aspect-square mb-2 md:mb-4 overflow-hidden rounded-lg flex-shrink-0">
          <img
            src={featuredImage}
            alt={categoryName}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col flex-grow justify-between min-h-[3rem]">
          <h3 className="text-sm md:text-base text-gray-800 font-medium text-center line-clamp-2 mb-1">{categoryName}</h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;