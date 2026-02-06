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

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizes[size]} bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0`}>
        <span className="text-white font-bold text-xl">A</span>
      </div>
      <span className="text-xl font-bold text-green-800 hidden sm:inline">AGRIATOO</span>
    </div>
  );
};

export default Logo;
