import React, { useEffect } from 'react'
import { 
  ClerkProvider, 
  SignedIn, 
  SignedOut,
  useUser
} from '@clerk/clerk-react'
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Navigate, 
  useLocation
} from 'react-router'
import { ProtectedRouteProps } from './types/types';
import HomePage from './pages/home';
import CategoryPage from './pages/categories';
import { envConfig } from './utilits/envConfig';
import LoginPage from './pages/login';
import SingleProductPage from './pages/singleProduct';
import { useLocation  as useLocationHook } from './hooks/useLocation';
import { LocationError } from './components/LocationError';
import { useApiStore } from './hooks/useApiStore';
import CartPage from './pages/cart';
import ProfilePage from './pages/profile';
import { withCartIndicator } from './components/ViewCart';
import OrderHistory from './pages/orderHistory';
import AddressPage from './pages/address';
import CheckoutPage from './pages/checkout';
import useUserStore from './store/useUserStore';
import OnboardPage from './pages/onboard';
import ServiceAreaPopup from './components/ServiceAreaPopUp';
import { HelmetProvider } from 'react-helmet-async';


const publishableKey = envConfig.clerkPulishableKey;

if (!publishableKey) {
  throw new Error('Clerk publishable key is not defined');
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useUser();
  const phoneNumber = useUserStore(state => state.phoneNumber);
  const location = useLocation();
  console.log("phone number in protected route::", phoneNumber);
  
  // Check if user needs to complete onboarding
  const needsOnboarding = user && !phoneNumber;
  const isOnboardingPage = location.pathname === '/onboard';

  if (needsOnboarding && !isOnboardingPage) {
    return <Navigate to="/onboard" replace />;
  }

  // If user has completed onboarding and is on the onboarding page, redirect to home
  if (!needsOnboarding && isOnboardingPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SignedIn>
        { children }
      </SignedIn>
      <SignedOut>
        <Navigate to="/login" replace />
      </SignedOut>
    </>
  );
};

const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return (
    <>
      <SignedOut>{children}</SignedOut>
      <SignedIn>
        <Navigate to="/" replace />
      </SignedIn>
    </>
  );
};

// Create wrapped versions of components that need the cart indicator
const HomePageWithCart = withCartIndicator(HomePage);
const CategoryPageWithCart = withCartIndicator(CategoryPage);
const SingleProductPageWithCart = withCartIndicator(SingleProductPage);
const ProfilePageWithCart = withCartIndicator(ProfilePage);
const OrderHistoryPageWithCart = withCartIndicator(OrderHistory)
const AddressPageWithCart = withCartIndicator(AddressPage)

function App() {
  const { latitude, longitude, error, requestLocation } = useLocationHook();
  const { findNearestStore } = useApiStore();


  console.log("latitude in app loading::", latitude);
  console.log("longitude in app loading::", longitude);
  
  useEffect(() => {
    requestLocation(); // Always fetch location on mount
  }, []);

  
  useEffect(() => {
    if (latitude && longitude) {
      const findStore = async () => {
        const res = await findNearestStore(latitude, longitude);
        console.log("response in loading state", res);
      };
      findStore();
    } else {

    }
  }, [latitude, longitude, findNearestStore]);

  const handleOpenSettings = () => {
    if (window.confirm('Would you like to open your browser settings to enable location access?')) {
      window.open('chrome://settings/content/location', '_blank');
    }
  };

  return (
    <HelmetProvider>
      <ClerkProvider publishableKey={publishableKey}>
        <Router>
        {error ? (
          <LocationError
          message={error}
          onRetry={requestLocation}
          onOpenSettings={handleOpenSettings}
          />
        ) : (
          <div className="relative min-h-screen">
            <ServiceAreaPopup/>
            <Routes>
              <Route 
                path="/onboard" 
                element={
                  <ProtectedRoute>
                    <OnboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePageWithCart />
                </ProtectedRoute>
              } />

              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />

              <Route 
                path="/categories" 
                element={
                  <ProtectedRoute>
                    <CategoryPageWithCart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/categories/:categoryId" 
                element={
                  <ProtectedRoute>
                    <CategoryPageWithCart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePageWithCart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/address" 
                element={
                  <ProtectedRoute>
                    <AddressPageWithCart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <OrderHistoryPageWithCart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/product/:productId" element={
                <ProtectedRoute>
                  <SingleProductPageWithCart />
                </ProtectedRoute>
              } />
              <Route path="*" element={
                <SignedIn>
                  <Navigate to="/" replace />
                </SignedIn>
              } />
            </Routes>
          </div>
        )}
        </Router>
      </ClerkProvider>
    </HelmetProvider>
  )
}

export default App