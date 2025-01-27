import { CategoryListItemProps } from "../types/types";

export const CategoryListItem = ({ category, isSelected, onPress }: CategoryListItemProps) => {
  const secureImageUrl = category.featuredImage?.replace('http://', 'https://');
 
  return (
    <button 
      onClick={onPress}
      className={`w-full flex items-center px-4 py-3 transition-colors duration-200 hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50 hover:bg-blue-100' : ''
      }`}
    >
      <img 
        src={secureImageUrl}
        alt={category.categoryName}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />
      <span className={`ml-3 text-sm font-medium ${
        isSelected ? 'text-blue-600' : 'text-gray-700'
      }`}>
        {category.categoryName}
      </span>
    </button>
  );
};