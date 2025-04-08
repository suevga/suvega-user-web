import { useState } from 'react';
import { Link } from 'react-router';
import useCategoryStore from '../store/useCategoryStore';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Footer = () => {
  const { categories } = useCategoryStore();
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Show only first 12 categories by default
  const visibleCategories = showAllCategories 
    ? categories 
    : categories?.slice(0, 20);

  return (
    <footer className="bg-white border-t mt-auto">
      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Mobile Categories Accordion */}
        <div className="sm:hidden mb-6">
          <button 
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 rounded-lg"
          >
            <h3 className="text-md font-bold text-primary-text">Shop by Category</h3>
            {showAllCategories ? (
              <ChevronUp className="w-5 h-5 text-primary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-primary" />
            )}
          </button>
          
          {showAllCategories && (
            <div className="mt-2 grid grid-cols-2 gap-1 px-2">
              {categories?.map((category) => (
                <Link
                  key={category._id}
                  to={`/categories/${category._id}`}
                  className="text-sm text-gray-600 hover:text-primary py-2"
                >
                  {category.categoryName}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Categories Grid */}
        <div className="hidden sm:block mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Shop by Category</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {visibleCategories?.map((category) => (
              <Link
                key={category._id}
                to={`/categories/${category._id}`}
                className="text-sm text-gray-600 hover:text-primary truncate py-1"
              >
                {category.categoryName}
              </Link>
            ))}
          </div>
          {categories?.length > 12 && !showAllCategories && (
            <button 
              onClick={() => setShowAllCategories(true)}
              className="mt-2 text-sm text-primary hover:text-secondary flex items-center"
            >
              Show all categories
              <ChevronDown className="ml-1 w-4 h-4" />
            </button>
          )}
        </div>

        {/* Links Section */}
        <div className="border-t pt-6">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:gap-8 mb-4">
            <Link
              to={'https://docs.google.com/document/d/e/2PACX-1vTHQG99Ur0oFmGIfzeMo48MY2DL2mB2aN5O59jT-Yg4pthe7RvQKbfaqIGSs9Ge6abmtNA1j395PJXo/pub'}
              className="text-sm text-gray-600 hover:text-primary underline"
            >
              Privacy Policy
            </Link>
            <Link
              to={'https://docs.google.com/document/d/e/2PACX-1vSao2TGyrzJPEONls9UkVlHIQyquDzmP4qmVfoKevu7pqBeUoinBesvGLdD0lBUyxCgCVhs_p3BmmkS/pub'}
              className="text-sm text-gray-600 hover:text-primary underline"
            >
              Terms & Conditions
            </Link>
            <Link
              to={'https://docs.google.com/document/d/e/2PACX-1vSao2TGyrzJPEONls9UkVlHIQyquDzmP4qmVfoKevu7pqBeUoinBesvGLdD0lBUyxCgCVhs_p3BmmkS/pub'}
              className="text-sm text-gray-600 hover:text-primary underline"
            >
              About Us
            </Link>
            <Link
              to={'https://docs.google.com/document/d/e/2PACX-1vSao2TGyrzJPEONls9UkVlHIQyquDzmP4qmVfoKevu7pqBeUoinBesvGLdD0lBUyxCgCVhs_p3BmmkS/pub'}
              className="text-sm text-gray-600 hover:text-primary underline"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Suvega. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 