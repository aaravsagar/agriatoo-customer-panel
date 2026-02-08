import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import Logo from '../UI/Logo';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { totalItems, totalAmount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const initialSearch = params.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP BAR */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* LOGO */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* SEARCH BAR - Hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
            </div>
          </form>

          {/* RIGHT ICONS */}
          <div className="flex items-center space-x-2">
            {/* ORDERS */}
            <Link
              to="/orders"
              className="p-2 text-gray-600 hover:text-green-600 transition-all duration-200 rounded-lg hover:bg-green-50 hidden md:block"
            >
              <Package className="w-6 h-6" />
            </Link>

            {/* CART WITH FLOATING PILL */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-green-600 transition-all duration-200 rounded-lg hover:bg-green-50 hidden md:block"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* PROFILE */}
            <Link
              to="/profile"
              className="p-2 text-gray-600 hover:text-green-600 transition-all duration-200 rounded-lg hover:bg-green-50 hidden md:block"
              title={user?.name || 'Profile'}
            >
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH BAR */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
            </div>
          </form>
        </div>
      </div>

      {/* FLOATING CART PILL - Top Right */}
      {totalItems > 0 && (
        <Link
          to="/cart"
          className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 animate-bounce"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="text-sm font-semibold">{totalItems} items</span>
          <span className="text-sm">₹{totalAmount.toFixed(0)}</span>
        </Link>
      )}
    </header>
  );
};

export default Header;
