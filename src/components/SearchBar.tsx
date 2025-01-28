import { useEffect, useRef } from "react";
import { Product, SearchBarProps } from "../types/types";
import { Search } from "lucide-react";
import { Link } from "react-router";

const SearchBar: React.FC<SearchBarProps> = ({
  className = '',
  isMobile = false,
  searchQuery,
  setSearchQuery,
  isSearchActive,
  setIsSearchActive,
  onProductClick,
  filteredProducts,
}) => {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsSearchActive]);

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search product here"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchActive(true)}
        />
      </div>

      {isSearchActive && searchQuery && (
        <div className={`absolute w-full bg-white rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50 ${isMobile ? 'top-full' : 'top-12'}`}>
          {filteredProducts.length > 0 ? (
            <div className="py-2">
              {filteredProducts.map((product: Product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onProductClick) {
                      onProductClick(product._id);
                    }
                  }}
                  className="block w-full px-4 py-3 text-left cursor-pointer hover:bg-gray-50 items-center gap-3 border-b border-gray-100"
                >
                  {product.productImages && product.productImages[0] && (
                    <img 
                      src={product.productImages[0].imageUrl} 
                      alt={product.productName}
                      className="w-10 h-10 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                    <p className="text-sm text-gray-500">₹{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;