import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import Logo from '../UI/Logo';
import { PRODUCT_CATEGORIES } from '../../config/constants';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const initialSearch = params.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Keep input synced with URL
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
    <header className="bg-white sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP BAR */}
        <div className="flex items-center justify-between h-16 gap-4">

          {/* LOGO */}
          <Link to="/" className="flex-shrink-0">
            <Logo size="md" />
          </Link>


          {/* RIGHT ICONS */}
          <div className="flex items-center space-x-4">

            {/* ORDERS */}
            <Link
              to="/orders"
              className="p-2 text-gray-600 hover:text-green-600 transition-colors hidden md:block"
            >
              <Package className="w-6 h-6" />
            </Link>

            {/* CART */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-green-600 transition-colors hidden md:block"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* PROFILE */}
            <Link
              to="/profile"
              className="p-2 text-gray-600 hover:text-green-600 transition-colors hidden md:block"
              title={user?.name || 'Profile'}
            >
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>

       

      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </header>
  );
};

export default Header;
