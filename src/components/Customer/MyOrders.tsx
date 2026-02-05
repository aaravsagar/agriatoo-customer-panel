import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { Order } from '../../types';
import { Eye, Download, Package, Clock, Truck, Check } from 'lucide-react';
import OrderTimeline from './OrderTimeline';
import OrderReceipt from './OrderReceipt';

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState<Order | null>(null);

  useEffect(() => {
    if (!user) return;

    // Real-time listener for user's orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('customerPhone', '==', user.phone),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          packedAt: data.packedAt?.toDate(),
          outForDeliveryAt: data.outForDeliveryAt?.toDate(),
          deliveredAt: data.deliveredAt?.toDate(),
        } as Order;
      });

      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <Package className="w-5 h-5 text-blue-600" />;
      case 'packed': return <Package className="w-5 h-5 text-orange-600" />;
      case 'out_for_delivery': return <Truck className="w-5 h-5 text-purple-600" />;
      case 'delivered': return <Check className="w-5 h-5 text-green-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-100 text-blue-800';
      case 'packed': return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstimatedDeliveryDate = (orderDate: Date) => {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    return deliveryDate;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← Back to Orders
            </button>
          </div>
          <OrderTimeline order={selectedOrder} />
        </div>
      </div>
    );
  }

  if (showReceipt) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Order Receipt</h1>
            <button
              onClick={() => setShowReceipt(null)}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← Back to Orders
            </button>
          </div>
          <OrderReceipt order={showReceipt} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your agricultural product orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping for agricultural products</p>
            <a
              href="/"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Order #{order.orderId}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-600">
                      Est. Delivery: {getEstimatedDeliveryDate(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Items ({order.items.length})</h4>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            {item.productName} × {item.quantity}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Seller</h4>
                      <p className="text-sm text-gray-600">{order.sellerName}</p>
                      <p className="text-lg font-semibold text-green-600 mt-2">
                        ₹{order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Track Order
                      </button>
                      <button
                        onClick={() => setShowReceipt(order)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Receipt
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Last updated: {order.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;