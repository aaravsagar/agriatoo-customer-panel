import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  maxQuantity?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  maxQuantity = 99,
  disabled = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base'
  };

  const buttonSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  if (quantity === 0) {
    return (
      <button
        onClick={() => onQuantityChange(1)}
        disabled={disabled}
        className={`
          flex items-center justify-center px-4 py-2 bg-white border-2 border-green-600 text-green-600 rounded-lg 
          hover:bg-green-600 hover:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed 
          transition-all duration-200 font-semibold shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95
          ${sizeClasses[size]} ${className}
        `}
      >
        <span className="text-xs font-bold">ADD</span>
      </button>
    );
  }

  return (
    <div className={`flex items-center bg-green-600 rounded-lg shadow-md ${className}`}>
      <button
        onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
        disabled={disabled || quantity <= 0}
        className={`
          flex items-center justify-center bg-green-600 text-white rounded-l-lg
          hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 transform hover:scale-110 active:scale-95
          ${buttonSizeClasses[size]}
        `}
      >
        <Minus className={iconSizeClasses[size]} strokeWidth={3} />
      </button>
      
      <div className={`
        flex items-center justify-center bg-green-600 text-white font-bold min-w-[2rem] px-2
        ${sizeClasses[size]}
      `}>
        {quantity}
      </div>
      
      <button
        onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
        disabled={disabled || quantity >= maxQuantity}
        className={`
          flex items-center justify-center bg-green-600 text-white rounded-r-lg
          hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 transform hover:scale-110 active:scale-95
          ${buttonSizeClasses[size]}
        `}
      >
        <Plus className={iconSizeClasses[size]} strokeWidth={3} />
      </button>
    </div>
  );
};

export default QuantitySelector;
