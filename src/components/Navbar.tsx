import { useState } from 'react';
import { ShoppingCart, MapPin, Menu, X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useUser, useClerk } from '@clerk/clerk-react';
import ImageViewer from './ImageViewer';
import { Images } from '../constants/images';
import CustomButton from './CustomButton';
import useCartStore from '../store/useCartStore';
import useProductStore from '../store/useProductStore';
import { Product } from '../types/types';
import SearchBar from './SearchBar';
import useUserStore from '../store/useUserStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userData } = useUserStore();
  const { isSignedIn } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { items }= useCartStore();
  const { products } = useProductStore();

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const defaultAddress = userData?.address?.[0];
  const formatAddress = () => {
    if (!defaultAddress) return 'Add delivery address';
    
    const parts = [];
    if (defaultAddress.addressLine) parts.push(defaultAddress.addressLine);
    if (defaultAddress.city) parts.push(defaultAddress.city);
    if (defaultAddress.pinCode) parts.push(defaultAddress.pinCode);
    
    return parts.join(', ');
  };

  const handleAddressClick = () => {
    if (!isSignedIn) {
      navigate('/login');
      return;
    }
    navigate('/address');
  };

  const handleAuthAction = () => {
    if (isSignedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  const handleProductClick = (productId: string) => {
    try {
      console.log('Attempting navigation to product:', productId);
      setIsSearchActive(false);
      setSearchQuery('');
      navigate(`/product/${productId}`, { replace: true });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const filteredProducts = searchQuery
    ? (products || []).filter((product: Product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
 
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow z-50 rounded">
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Hidden on mobile */}
          <Link to="/" className="hidden sm:flex items-center">
            <ImageViewer
              src={Images.logo}
              alt="logo"
              className="w-full h-10"
            />
          </Link>

          {/* Mobile Header */}
          <div className="flex sm:hidden items-center space-x-1 flex-1">
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold">Delivery in 15 minutes</span>
              <button 
                onClick={handleAddressClick}
                className="text-sm text-gray-600 truncate text-ellipsis max-w-[200px] hover:text-primary"
              >
                {formatAddress()}
              </button>
            </div>
          </div>

          {/* Location (Desktop) */}
          <div className="hidden sm:flex flex-col items-start gap-1 text-sm">
            <span className="font-bold text-primary-text">Delivery in 15 minutes</span>
            <div className="flex items-center text-gray-700">
              <MapPin className="w-4 h-4" color="#FF0A81"/>
              <button 
                onClick={handleAddressClick}
                className="text-sm text-gray-600 truncate text-ellipsis max-w-[200px] hover:text-primary"
              >
                {formatAddress()}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <SearchBar
                className=""
                isMobile={false}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isSearchActive={isSearchActive}
                setIsSearchActive={setIsSearchActive}
                onProductClick={handleProductClick}
                filteredProducts={filteredProducts}
              />
            </div>
          </div>

          {/* Login & Cart (Desktop) */}
          <div className="hidden sm:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="relative group">
                <CustomButton 
                  onClick={handleAuthAction}
                  className="bg-white flex items-center space-x-2 text-gray-700 hover:text-secondary cursor-pointer"
                >
                  <User className="w-5 h-5 text-primary" />
                </CustomButton>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    my account
                  </Link>
                  <Link
                    to="/address"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    my addresses
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    my orders
                  </Link>
                  <CustomButton
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </CustomButton>
                </div>
              </div>
            ) : (
              <CustomButton 
                onClick={handleAuthAction}
                className="text-gray-700 bg-white hover:text-primary"
              >
                <p className="text-primary-text">Login</p>
              </CustomButton>
            )}
            <Link
              to="/cart"
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors delay-75"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>My Cart</span>
              {cartItemsCount > 0 && (
                <div className="absolute font-bold top-2 right-2 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </div>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <CustomButton
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 bg-white"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-primary-text" /> : <Menu className="w-5 h-5 text-primary-text" />}
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-1 py-2 border-t">
        <div className="relative">
          <SearchBar
            className=""
            isMobile={true}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchActive={isSearchActive}
            setIsSearchActive={setIsSearchActive}
            onProductClick={handleProductClick}
            filteredProducts={filteredProducts}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-t">
          <div className="px-4 py-2">
            {/* Mobile Menu Items */}
            <div className="py-2 space-y-2">
              {isSignedIn ? (
                <>
                  <Link 
                    to="/profile"
                    className="block px-4  w-full text-sm py-2 text-gray-700 hover:text-primary"
                  >
                    my account
                  </Link>
                  <Link
                    to="/address"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    my addresses
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    my orders
                  </Link>
                  <CustomButton 
                    onClick={handleSignOut}
                    className="bg-white block w-full text-left py-2 text-gray-700 hover:text-primary"
                  >
                    <p className="text-primary-text">Sign out</p>
                  </CustomButton>
                </>
              ) : (
                <CustomButton 
                  onClick={handleAuthAction}
                  className="block w-full text-left py-2 text-gray-700 hover:text-primary bg-white"
                >
                  <p className="text-primary-text">Login</p>
                </CustomButton>
              )}
              <Link
                to="/cart"
                className="w-full flex items-center justify-between py-2 text-primary"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <div className="bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;