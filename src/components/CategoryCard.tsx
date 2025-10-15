import { Link } from 'react-router';
import { Clock } from 'lucide-react';

interface CategoryCardProps {
  _id: string;
  categoryName: string;
  featuredImage: string;
  deliveryTime: string;
}

const CategoryCard = ({ _id, categoryName, featuredImage, deliveryTime }:CategoryCardProps) => {
  const formatDeliveryTime = (value: string) => {
    if (value === '1hour') return '1 hour';
    if (value === '1day') return '1 day';
    if (/^\d+$/.test(value)) return `${value} minutes`;
    return value;
  };

  const deliveryLabel = formatDeliveryTime(deliveryTime);
  return (
    <Link to={`/categories/${_id}`} className="block w-full h-full">
      <div className="bg-white rounded-lg p-3 md:p-4 transition-all shadow-md h-full flex flex-col relative">
        {/* delivery time badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center gap-1.5 bg-primary text-white text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full shadow-md">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {deliveryLabel}
          </span>
        </div>
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