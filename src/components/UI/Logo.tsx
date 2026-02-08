import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src="/assets/logo.jpeg" 
        alt="AGRIATOO Logo" 
        className={`${sizes[size]} rounded-lg object-cover flex-shrink-0`}
        onError={(e) => {
          // Fallback to text logo if image fails to load
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallback) {
            fallback.style.display = 'flex';
          }
        }}
      />
      <div 
        className={`${sizes[size]} bg-green-600 rounded-xl items-center justify-center flex-shrink-0 hidden`}
        style={{ display: 'none' }}
      >
        <span className="text-white font-bold text-xl">A</span>
      </div>
      <span className={`${textSizes[size]} font-bold text-green-800 hidden sm:inline`}>AGRIATOO</span>
    </div>
  );
};

export default Logo;