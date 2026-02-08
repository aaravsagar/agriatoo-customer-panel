import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStockManager } from '../../hooks/useStockManager';
import QuantitySelector from '../UI/QuantitySelector';

interface ProductCardProps {
  product: Product;
}

const getOptimizedImageUrl = (url: string, transformation: string = 'w_300,h_300,c_fill,q_auto,f_auto'): string => {
  if (!url) return '';
  
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/${transformation}/`);
  }
  
  return url;
};

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
  const navigate = useNavigate();

  if (!product) {
    return null;
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on quantity selector
    if ((e.target as HTMLElement).closest('.quantity-selector')) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const productName = product.name ?? 'Unnamed Product';
  const productPrice = product.price ?? 0;
  const productOriginalPrice = product.originalPrice;
  const productUnit = product.unit ?? 'unit';
  const productImages = product.images ?? [];
  const productDescription = product.description ?? '';

  const primaryImage = productImages.length > 0 && isValidImageUrl(productImages[0]) 
    ? productImages[0] 
    : '';
  
  const optimizedImageUrl = primaryImage ? getOptimizedImageUrl(primaryImage) : '';

  const discountPercentage = productOriginalPrice && productOriginalPrice > productPrice
    ? Math.round(((productOriginalPrice - productPrice) / productOriginalPrice) * 100)
    : 0;

  // Truncate description to 2 lines (approximately 80 characters)
  const truncatedDescription = productDescription.length > 80 
    ? productDescription.substring(0, 80) + '...' 
    : productDescription;

  return (
    <div 
      className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="relative bg-gray-50 h-40 overflow-hidden rounded-t-xl">
        {optimizedImageUrl && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={optimizedImageUrl}
              alt={productName}
              className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
            <ImageOff className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Stock Status */}
        {productStock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 pb-16">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-green-600 transition-colors">
          {productName}
        </h3>

        {/* Size/Unit */}
        <p className="text-gray-500 text-xs mb-2">{productUnit}</p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-900 font-bold text-sm">
            ₹{productPrice.toFixed(0)}
          </span>
          {productOriginalPrice && productOriginalPrice > productPrice && (
            <span className="text-gray-400 line-through text-xs">
              ₹{productOriginalPrice.toFixed(0)}
            </span>
          )}
        </div>

        {/* Description - 2 lines max */}
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-2">
          {truncatedDescription}
        </p>
      </div>

      {/* Quantity Selector - Bottom Right */}
      <div className="absolute bottom-3 right-3 quantity-selector">
        {!product.coveredPincodes?.length ? (
          <div className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium">
            No Delivery
          </div>
        ) : !isInStock ? (
          <div className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-medium">
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
  );
};

export default ProductCard;
