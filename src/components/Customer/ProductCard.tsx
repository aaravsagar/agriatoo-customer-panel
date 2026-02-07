import React, { useState } from 'react';
import { MapPin, AlertTriangle, ImageOff } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useStockManager } from '../../hooks/useStockManager';
import QuantitySelector from '../UI/QuantitySelector';

interface ProductCardProps {
  product: Product;
}

/**
 * Get optimized Cloudinary image URL with transformations
 * @param url - Original image URL
 * @param transformation - Cloudinary transformation parameters
 * @returns Optimized image URL or original URL if not a Cloudinary image
 */
const getOptimizedImageUrl = (url: string, transformation: string = 'w_400,h_300,c_fill,q_auto,f_auto'): string => {
  if (!url) return '';
  
  // Check if it's a Cloudinary URL
  if (url.includes('res.cloudinary.com')) {
    // Insert transformation before /upload/
    return url.replace('/upload/', `/upload/${transformation}/`);
  }
  
  // For non-Cloudinary URLs, return as is
  return url;
};

/**
 * Validate if image URL is from an allowed domain
 * @param url - Image URL to validate
 * @returns Boolean indicating if URL is valid
 */
const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const validDomains = [
      'cloudinary.com',
      'res.cloudinary.com',
      'images.unsplash.com',
      'unsplash.com',
      'pexels.com',
      'images.pexels.com',
      'pixabay.com',
      'cdn.pixabay.com'
    ];
    
    return validDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { addToCart, updateQuantity, getCartItemQuantity } = useCart();
  const { isProductInStock, getProductStock } = useStockManager();

  // Defensive check
  if (!product) {
    console.error('ProductCard received undefined product');
    return null;
  }

  const cartQuantity = getCartItemQuantity(product.id);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity === 0) {
      // Remove from cart logic is handled by updateQuantity
      updateQuantity(product.id, 0);
    } else if (cartQuantity === 0) {
      // Add to cart
      try {
        addToCart(product, newQuantity);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      // Update quantity
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Safe defaults
  const productName = product.name ?? 'Unnamed Product';
  const productDescription = product.description ?? 'No description available';
  const productCategory = product.category ?? 'Uncategorized';
  const productPrice = product.price ?? 0;
  const productOriginalPrice = product.originalPrice;
  const productUnit = product.unit ?? 'unit';
  const productSellerName = product.sellerName ?? 'Unknown Seller';
  const productImages = product.images ?? [];

  // Stock management
  const stockFromManager = getProductStock(product.id);
  const productStock = stockFromManager ?? product.stock ?? 0;
  const isInStock = isProductInStock(product.id, 1);
  const isLowStock = productStock > 0 && productStock <= 5;

  // Get primary image with validation
  const primaryImage = productImages.length > 0 && isValidImageUrl(productImages[0]) 
    ? productImages[0] 
    : '';
  
  // Get optimized image URL for display
  const optimizedImageUrl = primaryImage ? getOptimizedImageUrl(primaryImage) : '';

  // Calculate discount percentage if applicable
  const discountPercentage = productOriginalPrice && productOriginalPrice > productPrice
    ? Math.round(((productOriginalPrice - productPrice) / productOriginalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Product Image Section */}
      <div className="relative bg-gray-200 h-48">
        {optimizedImageUrl && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <div className="animate-pulse">
                  <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )}
            <img
              src={optimizedImageUrl}
              alt={productName}
              className={`w-full h-48 object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex flex-col items-center justify-center">
            <ImageOff className="w-12 h-12 text-green-600 mb-2" />
            <span className="text-green-600 text-sm font-medium">
              {imageError ? 'Image Not Available' : 'No Image'}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Stock Status Badge */}
        {productStock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            OUT OF STOCK
          </div>
        )}
        {isLowStock && productStock > 0 && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            LOW STOCK
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-5">
        {/* Product Name and Category */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 flex-1">
            {productName}
          </h3>
          <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full ml-2 whitespace-nowrap font-medium">
            {productCategory}
          </span>
        </div>

        {/* Product Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {productDescription}
        </p>

        {/* Seller Info and Stock Status */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">By {productSellerName}</span>
          </div>

          <div
            className={`flex items-center ${
              productStock === 0
                ? 'text-red-600'
                : isLowStock
                ? 'text-orange-600'
                : 'text-gray-500'
            }`}
          >
            {productStock === 0 && <AlertTriangle className="inline w-3 h-3 mr-1" />}
            <span className="whitespace-nowrap">
              Stock: {productStock} {productUnit}
            </span>
          </div>
        </div>

        {/* Price and Add to Cart Section */}
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
          {/* Price Display */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-green-600">
                ₹{productPrice.toFixed(2)}
              </span>
              {productOriginalPrice && productOriginalPrice > productPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{productOriginalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">per {productUnit}</span>
          </div>

          {/* Quantity Selector */}
          <div className="flex-shrink-0">
            {!product.coveredPincodes?.length ? (
              <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
                No Delivery
              </div>
            ) : !isInStock ? (
              <div className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                Out of Stock
              </div>
            ) : (
              <QuantitySelector
                quantity={cartQuantity}
                onQuantityChange={handleQuantityChange}
                maxQuantity={productStock}
                disabled={!isInStock}
                size="sm"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;