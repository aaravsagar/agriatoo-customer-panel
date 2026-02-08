import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useStockManager } from '../../hooks/useStockManager';
import { generateUniqueOrderId, generateOrderQR } from '../../utils/qrUtils';
import { Trash2, ArrowLeft, CheckCircle } from 'lucide-react';
import { ORDER_STATUSES } from '../../config/constants';
import OrderProgress from './OrderProgress';
import QuantitySelector from '../UI/QuantitySelector';

const Cart: React.FC = () => {
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount, isInitialized } = useCart();
  const { reduceStockForOrder, isProductInStock } = useStockManager();
  const navigate = useNavigate();
  
  const [showProgress, setShowProgress] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [cancelTimer, setCancelTimer] = useState(5);

  // Success screen timer
  useEffect(() => {
    if (showSuccess && cancelTimer > 0) {
      const timer = setTimeout(() => {
        setCancelTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && cancelTimer === 0) {
      navigate('/orders');
    }
  }, [showSuccess, cancelTimer, navigate]);

  const validateCheckout = () => {
    if (!user) return 'User not authenticated';
    if (!user.name?.trim()) return 'Name is required in profile';
    if (!user.phone?.trim()) return 'Phone number is required in profile';
    if (!user.address?.trim()) return 'Address is required in profile';
    if (!user.pincode?.trim()) return 'PIN code is required in profile';
    
    for (const item of cartItems) {
      if (!isProductInStock(item.productId, item.quantity)) {
        return `${item.product.name} is out of stock or insufficient quantity available`;
      }
    }
    
    const sellers = [...new Set(cartItems.map(item => item.product.sellerId))];
    for (const sellerId of sellers) {
      const sellerItems = cartItems.filter(item => item.product.sellerId === sellerId);
      const firstProduct = sellerItems[0]?.product;
      
      if (!firstProduct) {
        return 'Invalid product data found in cart';
      }
      
      if (!firstProduct.coveredPincodes || !Array.isArray(firstProduct.coveredPincodes)) {
        return `Products from ${firstProduct.sellerName} don't have delivery information.`;
      }
      
      if (!firstProduct.coveredPincodes.includes(user.pincode!)) {
        return `Delivery not available to PIN code ${user.pincode} for products from ${firstProduct.sellerName}`;
      }
    }
    
    return null;
  };

  const handlePlaceOrder = async () => {
    const validationError = validateCheckout();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user) return;

    setError('');
    setShowProgress(true);

    setTimeout(async () => {
      setLoading(true);
      
      try {
        const sellerGroups = cartItems.reduce((groups, item) => {
          const sellerId = item.product.sellerId;
          if (!groups[sellerId]) {
            groups[sellerId] = [];
          }
          groups[sellerId].push(item);
          return groups;
        }, {} as Record<string, typeof cartItems>);

        const orderPromises = Object.entries(sellerGroups).map(async ([sellerId, items]) => {
          const sellerProduct = items[0].product;
          const orderId = generateUniqueOrderId(user.pincode!);
          
          const orderData = {
            orderId,
            customerName: user.name,
            customerPhone: user.phone,
            customerAddress: user.address,
            customerPincode: user.pincode,
            sellerId,
            sellerName: sellerProduct.sellerName,
            sellerShopName: sellerProduct.sellerName,
            sellerAddress: sellerProduct.sellerAddress || '',
            sellerPincode: sellerProduct.sellerPincode || '',
            items: items.map(item => ({
              productId: item.productId,
              productName: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              unit: item.product.unit
            })),
            totalAmount: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
            status: ORDER_STATUSES.RECEIVED,
            paymentMethod: 'cod',
            createdAt: new Date(),
            updatedAt: new Date(),
            qrCode: generateOrderQR(orderId)
          };

          const orderRef = await addDoc(collection(db, 'orders'), orderData);
          const stockReduced = await reduceStockForOrder(items, orderId);
          
          if (!stockReduced) {
            console.warn(`Failed to reduce stock for order ${orderId}`);
          }
          
          return { ref: orderRef, data: orderData };
        });

        const orderResults = await Promise.all(orderPromises);
        
        if (orderResults.length > 0) {
          setOrderData(orderResults[0].data);
        }
        
        clearCart();
        setShowProgress(false);
        setShowSuccess(true);
        
      } catch (error) {
        console.error('Error placing orders:', error);
        setError('Failed to place orders. Please try again.');
        setShowProgress(false);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  const handleCancelOrder = () => {
    setShowSuccess(false);
    setCancelTimer(5);
    // Here you would implement order cancellation logic
    navigate('/orders');
  };

  // Show order progress
  if (showProgress) {
    return <OrderProgress onComplete={() => {}} />;
  }

  // Show success screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">Your order has been confirmed and is being processed.</p>
          
          {orderData && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono font-bold text-lg">{orderData.orderId}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={handleCancelOrder}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Cancel Order
            </button>
            
            <p className="text-sm text-gray-500">
              Redirecting to orders in {cancelTimer} seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArrowLeft className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link
              to="/"
              className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const originalTotal = cartItems.reduce((sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity, 0);
  const discount = originalTotal - totalAmount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h1>
          <Link
            to="/"
            className="flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
              if (!item || !item.product) {
                return null;
              }

              return (
                <div key={item.productId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                      {item.product.images && item.product.images.length > 0 && item.product.images[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.product.name || 'Unknown Product'}</h3>
                      <p className="text-sm text-gray-600 mb-2">By {item.product.sellerName || 'Unknown Seller'}</p>
                      <p className="text-sm text-gray-500">{item.product.unit || 'unit'}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{((item.product.price || 0) * item.quantity).toFixed(0)}
                          </span>
                          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{(item.product.originalPrice * item.quantity).toFixed(0)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <QuantitySelector
                            quantity={item.quantity}
                            onQuantityChange={(newQuantity) => updateQuantity(item.productId, newQuantity)}
                            maxQuantity={item.product.stock}
                            disabled={!isProductInStock(item.productId, 1)}
                            size="sm"
                          />
                          
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Original Total</span>
                  <span>₹{originalTotal.toFixed(0)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Final Total</span>
                    <span>₹{totalAmount.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="border-t pt-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Delivery Details</h4>
                <div className="bg-gray-50 rounded-xl p-4 text-sm">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-gray-600">{user?.phone}</p>
                  <p className="text-gray-600">{user?.address}</p>
                  <p className="text-gray-600 font-medium">PIN: {user?.pincode}</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">Payment Method: Cash on Delivery</p>
                
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  {loading ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
