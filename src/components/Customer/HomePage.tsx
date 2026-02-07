import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { totalItems } = useCart();
  const { subscribeToProductStock, isProductInStock, getProductStock } = useStockManager();
  const navigate = useNavigate();

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
        // Update products with real-time stock
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
      // Query active products
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

      // Filter out any invalid products
      productsData = productsData.filter(product => 
        product.name && product.id && typeof product.price === 'number'
      );

      // Frontend filtering by category
      if (selectedCategory) {
        productsData = productsData.filter(product => product.category === selectedCategory);
      }

      // Filter by user's pincode
      if (user && user.pincode) {
        productsData = productsData.filter(product => 
          Array.isArray(product.coveredPincodes) && 
          product.coveredPincodes.includes(user.pincode)
        );
      }

      // Sort by creation date (newest first) and limit to 20
      productsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      productsData = productsData.slice(0, 20);

      console.log('Fetched products:', productsData.length);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  const filteredProducts = products.filter(product => {
    if (!product || !product.name) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = product.name.toLowerCase().includes(searchLower);
    const descMatch = product.description?.toLowerCase().includes(searchLower) || false;
    
    return nameMatch || descMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Product Search and Filter */}
      <section className="py-8 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
            >
              <option value="">All Categories</option>
              {PRODUCT_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {selectedCategory ? `${selectedCategory} Products` : 'Featured Products'}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                product && product.id ? (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ) : null
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {user?.pincode 
                  ? `No products available for PIN code ${user.pincode}` 
                  : 'No products found'
                }
              </p>
              <p className="text-gray-500 mt-2">
                Try searching with a different category
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 text-green-100">
            Browse our complete catalog and find the best agricultural products
          </p>
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            View Cart ({totalItems} items)
          </button>
        </div>
      </section>

    </div>
  );
};

export default HomePage;