import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Package, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { totalItems } = useCart();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart', badge: totalItems },
    { path: '/orders', icon: Package, label: 'Orders' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-bottom shadow-2xl">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center relative transition-all duration-200 ${
                isActive ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-500'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform duration-200`} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-green-600 rounded-t-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
