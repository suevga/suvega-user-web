export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface LocationErrorProps {
  message: string;
  onRetry: () => void;
  onOpenSettings: () => void;
}

export interface CustomButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
  disabled: boolean;
  loading: boolean;
}

export interface LocationProps {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  setLocation: (lat: number, lon: number) => void;
  requestLocation: () => void; 
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface UserData {
  id?: string;
  phoneNumber?: string;
  email?: string;
  name?: string;
}

export interface OrderData {
  id?: string;
  items?: any[];
  total?: number;
  status?: string;
}

export interface ImageViewerProps {
  src: string;
  alt: string;
  className: string;
  key?: string;
}

export interface Category {
  _id: string;
  categoryName: string;
  featuredImage: string;
}

export interface CategoryListItemProps {
  category: {
    _id: string;
    categoryName: string;
    featuredImage: string;
  };
  isSelected: boolean;
  onPress: () => void;
}

export interface ProductCardProps {
  _id: string;
  productName: string;
  productImages: { imageUrl: string; _id?: string }[];
  price: number;
  discountPrice?: number;
  description: string;
  quantity?: number;
}

export interface CartItem {
  _id: string;
  productName: string;
  productImage: string;
  price: number;
  discountPrice?: number;
  quantity: number;
}
export interface CartState {
  items: CartItem[];
  deliveryCharge: number;
  addToCart: (item: { 
    _id: string;
    productName: string;
    productImage: string;
    price: number;
    discountPrice?: number;
  }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Calculation methods
  getSubtotalBeforeDiscount: () => number;
  getSubtotalAfterDiscount: () => number;
  getDeliveryCharge: () => number;
  getTotalAmount: () => number;
  getTotalSavings: () => number;
  getSavingsPercentage: () => number;
}