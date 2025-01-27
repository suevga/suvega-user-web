import { useState } from 'react';
import { Search, ShoppingCart, MapPin, Menu, X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useUser, useClerk } from '@clerk/clerk-react';
import ImageViewer from './ImageViewer';
import { Images } from '../constants/images';
import CustomButton from './CustomButton';
import useCartStore from '../store/useCartStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useState('Pocket 25, Subhash Place');
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { items }= useCartStore();

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

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
              <span className="text-sm truncate text-ellipsis">{location}</span>
            </div>
          </div>

          {/* Location (Desktop) */}
          <div className="hidden sm:flex flex-col items-start gap-1 text-sm">
            <span className="font-bold text-primary-text">Delivery in 15 minutes</span>
            <div className="flex items-center text-gray-700">
              <MapPin className="w-4 h-4" color="#FF0A81"/>
              <span className="max-w-[200px] truncate font-semibold">{location}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search product here"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
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
                    Profile
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search product here"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
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
                    className="block w-full text-left py-2 text-gray-700 hover:text-primary"
                  >
                    Profile
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