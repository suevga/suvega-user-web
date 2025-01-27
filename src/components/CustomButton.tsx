import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface CustomButtonProps {
  title?: string;
  onClick?: (event: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  loadingIcon?: ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onClick,
  className = '',
  disabled = false,
  loading = false,
  children,
  type = 'button',
  loadingIcon
}) => {
  return (
    <button 
      className={`w-full bg-primary text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`} 
      onClick={onClick} 
      disabled={disabled}
      type={type}
    >
      {loading ? (
        loadingIcon || <Loader2 className="animate-spin mx-auto" width={24} height={24} />
      ) : (
        children || title
      )}
    </button>
  )
}

export default CustomButton;