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
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg'
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
          flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-full 
          hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed 
          transition-all duration-200 font-medium shadow-md hover:shadow-lg
          ${sizeClasses[size]} ${className}
        `}
      >
        <ShoppingCart className={iconSizeClasses[size]} />
        <span className="whitespace-nowrap">Add</span>
      </button>
    );
  }

  return (
    <div className={`flex items-center bg-green-50 rounded-full border-2 border-green-200 ${className}`}>
      <button
        onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
        disabled={disabled || quantity <= 0}
        className={`
          flex items-center justify-center bg-white border-r border-green-200 rounded-l-full
          hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 text-green-600 hover:text-green-700
          ${buttonSizeClasses[size]}
        `}
      >
        <Minus className={iconSizeClasses[size]} strokeWidth={2.5} />
      </button>
      
      <div className={`
        flex items-center justify-center bg-white text-green-700 font-semibold min-w-[3rem] px-2
        ${sizeClasses[size]}
      `}>
        {quantity}
      </div>
      
      <button
        onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
        disabled={disabled || quantity >= maxQuantity}
        className={`
          flex items-center justify-center bg-white border-l border-green-200 rounded-r-full
          hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 text-green-600 hover:text-green-700
          ${buttonSizeClasses[size]}
        `}
      >
        <Plus className={iconSizeClasses[size]} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default QuantitySelector;