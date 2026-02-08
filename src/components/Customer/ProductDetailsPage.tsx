import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useStockManager } from '../../hooks/useStockManager';
import { ArrowLeft, ImageOff, ChevronDown, ChevronUp } from 'lucide-react';
import QuantitySelector from '../UI/QuantitySelector';
import LoadingSpinner from '../UI/LoadingSpinner';

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [error, setError] = useState('');

  const { addToCart, updateQuantity, getCartItemQuantity } = useCart();
  const { isProductInStock, getProductStock } = useStockManager();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;

    setLoading(true);
    try {
      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const data = productSnap.data();
        setProduct({
          id: productSnap.id,
          name: data.name || '',
          description: data.description || '',
          price: data.price || 0,
          originalPrice: data.originalPrice,
          category: data.category || '',
          unit: data.unit || 'unit',
          stock: data.stock || 0,
          images: data.images || [],
          sellerName: data.sellerName || '',
          sellerId: data.sellerId || '',
          coveredPincodes: data.coveredPincodes || [],
          isActive: data.isActive || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as Product);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            to="/"
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const cartQuantity = getCartItemQuantity(product.id);
  const stockFromManager = getProductStock(product.id);
  const productStock = stockFromManager ?? product.stock ?? 0;
  const isInStock = isProductInStock(product.id, 1);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      updateQuantity(product.id, 0);
    } else if (cartQuantity === 0) {
      try {
        addToCart(product, newQuantity);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      updateQuantity(product.id, newQuantity);
    }
  };

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const validImages = product.images.filter(img => img && img.trim() !== '');
  const hasMultipleImages = validImages.length > 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {validImages.length > 0 ? (
                  <img
                    src={validImages[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <ImageOff className="w-16 h-16 mb-4" />
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {hasMultipleImages && (
              <div className="flex space-x-2 overflow-x-auto">
                {validImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-green-600 ring-2 ring-green-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Title and Category */}
              <div className="mb-4">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full mb-3">
                  {product.category}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600">{product.unit}</p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toFixed(0)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.originalPrice.toFixed(0)}
                    </span>
                    <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {productStock > 0 ? (
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">
                      {productStock > 10 ? 'In Stock' : `Only ${productStock} left`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex justify-end mb-6">
                {!product.coveredPincodes?.length ? (
                  <div className="px-6 py-3 bg-gray-100 text-gray-500 rounded-lg font-medium">
                    No Delivery Available
                  </div>
                ) : !isInStock ? (
                  <div className="px-6 py-3 bg-red-100 text-red-600 rounded-lg font-medium">
                    Out of Stock
                  </div>
                ) : (
                  <QuantitySelector
                    quantity={cartQuantity}
                    onQuantityChange={handleQuantityChange}
                    maxQuantity={productStock}
                    disabled={!isInStock}
                    size="lg"
                  />
                )}
              </div>

              {/* Description */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="text-gray-700 leading-relaxed">
                  {showFullDescription ? (
                    <p>{product.description}</p>
                  ) : (
                    <p>{product.description.substring(0, 200)}{product.description.length > 200 ? '...' : ''}</p>
                  )}
                  
                  {product.description.length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="flex items-center text-green-600 hover:text-green-700 font-medium mt-2 transition-colors"
                    >
                      {showFullDescription ? (
                        <>
                          View less details
                          <ChevronUp className="w-4 h-4 ml-1" />
                        </>
                      ) : (
                        <>
                          View more details
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Seller Info */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Seller Information</h3>
                <p className="text-gray-600">Sold by: <span className="font-medium">{product.sellerName}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
