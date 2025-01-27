import React, { useEffect } from 'react'
import { 
  ClerkProvider, 
  SignedIn, 
  SignedOut
} from '@clerk/clerk-react'
import { 
  BrowserRouter as Router, 
  Route, 
  Routes, 
  Navigate 
} from 'react-router'
import { ProtectedRouteProps } from './types/types';
import HomePage from './pages/home';
import CategoryPage from './pages/categories';
import { envConfig } from './utilits/envConfig';
import LoginPage from './pages/login';
import SingleProductPage from './pages/singleProduct';
import { useLocation } from './hooks/useLocation';
import { LocationError } from './components/LocationError';
import { useApiStore } from './hooks/useApiStore';
import { useLocationStore } from './store/useLocationStore';
import CartPage from './pages/cart';
import ProfilePage from './pages/profile';
import { withCartIndicator } from './components/ViewCart';

const publishableKey = envConfig.clerkPulishableKey;

if (!publishableKey) {
  throw new Error('Clerk publishable key is not defined');
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return (
    <>
      <SignedIn>
          {children}
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


const AppRoutes = withCartIndicator(({ children }) => (
  <div className="relative min-h-screen">
    {children}
  </div>
));

function App() {
  const { error, requestLocation, openLocationSettings } = useLocation();
  const { latitude, longitude} = useLocationStore();
  const { findNearestStore } = useApiStore();

  useEffect(() => {
    if (latitude && longitude) {
      const findStore = async () => {
        await findNearestStore(latitude, longitude);
      };
      findStore();
    }
  }, [latitude, longitude, findNearestStore]);

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Router>
        {
          error ? (
            <LocationError
              message={error}
              onRetry={requestLocation}
              onOpenSettings={openLocationSettings}
            />
          ) : (
          <AppRoutes>
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
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
                    <CategoryPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/categories/:categoryId" 
                element={
                  <ProtectedRoute>
                    <CategoryPage />
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
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route path="product/:productId" element={<SingleProductPage />} />
              <Route path="*" element={
                <SignedIn>
                  <Navigate to="/" replace />
                </SignedIn>
              } />
            </Routes>
          </AppRoutes>
          )
        }
      </Router>
    </ClerkProvider>
  )
}


export default App