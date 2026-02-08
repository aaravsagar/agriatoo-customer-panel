import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { Product } from '../../types';
import { PRODUCT_CATEGORIES } from '../../config/constants';
import { Search, ShoppingCart, Truck, Shield, Users } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useStockManager } from '../../hooks/useStockManager';
import ProductCard from '../../components/Customer/ProductCard';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { totalItems } = useCart();
  const { subscribeToProductStock, isProductInStock, getProductStock } = useStockManager();
  const navigate = useNavigate();

  // Get search term from URL
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get('search') || '';

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [selectedCategory, user]);

  // Subscribe to real-time stock updates for displayed products
  useEffect(() => {
    if (products.length > 0) {
      const productIds = products.map(p => p.id);
      const unsubscribe = subscribeToProductStock(productIds, (stockMap) => {
        setProducts(prevProducts => 
          prevProducts.map(product => ({
            ...product,
            stock: stockMap.get(product.id) ?? product.stock
          }))
        );
      });

      return unsubscribe;
    }
  }, [products.map(p => p.id).join(','), subscribeToProductStock]);

  const fetchProducts = async () => {
    if (!user || !user.pincode) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, 'products'),
        where('isActive', '==', true)
      );

      const snapshot = await getDocs(q);
      let productsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          price: data.price || 0,
          originalPrice: data.originalPrice,
          discountedPrice: data.discountedPrice,
          category: data.category || '',
          unit: data.unit || 'unit',
          stock: data.stock || 0,
          images: data.images || [],
          sellerName: data.sellerName || '',
          sellerId: data.sellerId || '',
          coveredPincodes: data.coveredPincodes || [],
          isActive: data.isActive || false,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Product;
      });

      productsData = productsData.filter(product => 
        product.name && product.id && typeof product.price === 'number'
      );

      if (selectedCategory) {
        productsData = productsData.filter(product => product.category === selectedCategory);
      }

      if (user && user.pincode) {
        productsData = productsData.filter(product => 
          Array.isArray(product.coveredPincodes) && 
          product.coveredPincodes.includes(user.pincode)
        );
      }

      // Filter by search term if present
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        productsData = productsData.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        );
      }

      productsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      productsData = productsData.slice(0, 20);

      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Fresh Agricultural Products
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Quality fertilizers, seeds, and farming tools delivered to your doorstep
            </p>
            
            {/* Search Results Info */}
            {searchTerm && (
              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6 inline-block">
                <p className="text-lg">
                  Showing results for: <span className="font-bold">"{searchTerm}"</span>
                </p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex items-center justify-center space-x-3">
                <Truck className="w-8 h-8" />
                <div className="text-left">
                  <p className="font-semibold">Fast Delivery</p>
                  <p className="text-green-100 text-sm">Next day delivery</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Shield className="w-8 h-8" />
                <div className="text-left">
                  <p className="font-semibold">Quality Assured</p>
                  <p className="text-green-100 text-sm">Verified products</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Users className="w-8 h-8" />
                <div className="text-left">
                  <p className="font-semibold">Trusted Sellers</p>
                  <p className="text-green-100 text-sm">Verified partners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === ''
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Products
            </button>
            {PRODUCT_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchTerm && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results for "{searchTerm}"
              </h2>
              <p className="text-gray-600 mt-1">
                {loading ? 'Searching...' : `${products.length} products found`}
              </p>
            </div>
          )}

          {!searchTerm && (
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {selectedCategory ? `${selectedCategory} Products` : 'Featured Products'}
            </h2>
          )}

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map(product => (
                product && product.id ? (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ) : null
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No products found' : 'No products available'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No products match your search for "${searchTerm}"`
                  : user?.pincode 
                    ? `No products available for PIN code ${user.pincode}` 
                    : 'No products found'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => navigate('/')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  View All Products
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;