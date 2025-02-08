export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface LocationErrorProps {
  message: string;
  onRetry: () => void;
  onOpenSettings?: () => void;
}

export interface CustomButtonProps {
  children?: React.ReactNode;  // Added to support button content
  title?: string;
  onClick?: (e: React.MouseEvent) => void;  // Made optional and added event type
  className?: string;
  disabled?: boolean;  // Made optional
  loading?: boolean;   // Made optional
}

export interface LocationProps {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  setLocation: (lat: number, lon: number) => void;
  requestLocation: () => void;
}


export interface UserData {
  id?: string;
  phoneNumber?: string;
  email?: string;
  name?: string;
  address: Address[];
  [key: string]: any;
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
  className?: string;
  key?: string;
}

// Updated Category interface to match usage
export interface Category {
  _id: string;
  categoryName: string;
  featuredImage: string;
  description?: string;
}

export interface CategoryListItemProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

// Updated Product interface to match usage
export interface Product {
  _id: string;
  productName: string;
  description: string;
  productImages: ProductImage[];
  price: number;
  discountPrice?: number;
  categoryId?: string;
}

export interface ProductImage {
  imageUrl: string;
  _id?: string;
}

export interface CartItem {
  _id: string;
  productName: string;
  productImage: string;
  price: number;
  discountPrice?: number;
  quantity: number;
}

// Separate interface for SearchBar props
export interface SearchBarProps {
  className?: string;
  isMobile?: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchActive: boolean;
  setIsSearchActive: (active: boolean) => void;
  // onProductClick: (productId: string) => void;
  filteredProducts: Product[];
}

export interface RegisterUserData {
  phoneNumber: string;
  email: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface LocationData {
  type: string;
  coordinates: [number | null, number | null]; 
}

export interface DarkStore {
  _id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Address {
  _id: string;
  type: 'Home' | 'Work' | 'Other';
  fullName: string;
  addressLine: string;
  city: string;
  pinCode: string;
  landmark?: string;
}

export interface AddressFormProps {
  onClose: () => void;
}

// Address Form Data
export interface AddressFormData extends Omit<Address, 'id'> {}