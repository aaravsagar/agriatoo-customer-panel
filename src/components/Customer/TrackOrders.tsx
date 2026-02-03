import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ORDER_STATUSES } from '../../config/constants';
import { useStockManager } from '../../hooks/useStockManager';

interface SavedOrder {
  orderId: string;
  docId?: string;
  createdAt?: string;
  status?: string;
}

const TrackOrders: React.FC = () => {
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [customer, setCustomer] = useState<Record<string, string> | null>(null);
  const { restoreStockForOrder } = useStockManager();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('agriatoo_orders') || '[]';
      const parsed: SavedOrder[] = JSON.parse(raw);
      setOrders(parsed.reverse());
    } catch (err) {
      console.warn('Failed to load orders from localStorage', err);
      setOrders([]);
    }

    try {
      const rawC = localStorage.getItem('agriatoo_customer');
      if (rawC) setCustomer(JSON.parse(rawC));
    } catch (err) {
      console.warn('Failed to load customer from localStorage', err);
    }
  }, []);

  // NOTE: clearAll removed by user request

  const cancelOrder = async (orderId: string, docId?: string) => {
    if (!confirm(`Cancel order ${orderId}?`)) return;

    // Update remote order status if we have a docId
    if (docId) {
      try {
        const orderRef = doc(db, 'orders', docId);
        await updateDoc(orderRef, { status: 'cancelled', updatedAt: new Date() });
        // Attempt to restore stock based on order items
        try {
          const snap = await getDoc(orderRef as any);
          if (snap.exists()) {
            const data = snap.data();
            if (Array.isArray(data.items) && data.items.length > 0) {
              // Map to CartItem-like objects expected by restoreStockForOrder
              const cartItems = data.items.map((it: any) => ({ productId: it.productId, quantity: it.quantity }));
              await restoreStockForOrder(cartItems, orderId);
            }
          }
        } catch (err) {
          console.warn('Failed to restore stock from Firestore order items', err);
        }
      } catch (err) {
        console.warn('Failed to update order status in Firestore', err);
      }
    }

    // Update localStorage
    try {
      const raw = localStorage.getItem('agriatoo_orders') || '[]';
      const parsed: SavedOrder[] = JSON.parse(raw);
      const updated = parsed.map(o => o.orderId === orderId ? { ...o, status: 'cancelled' } : o);
      localStorage.setItem('agriatoo_orders', JSON.stringify(updated));
      setOrders(updated.reverse());
    } catch (err) {
      console.warn('Failed to update local orders', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Track Your Orders</h1>
          <Link to="/" className="text-green-600 hover:underline">Back to shop</Link>
        </div>

        {customer && (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="font-semibold mb-2">Saved Customer</h2>
            <p className="text-sm text-gray-700">{customer.name} • {customer.phone}</p>
            <p className="text-sm text-gray-600">{customer.address}</p>
            <p className="text-xs text-gray-500">PIN: {customer.pincode}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
            <div className="space-x-2">
              <button onClick={() => window.location.reload()} className="text-sm text-gray-600 hover:underline">Refresh</button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No tracked orders found. Place an order and it will appear here.</div>
          ) : (
            <ul className="space-y-3">
              {orders.map(o => (
                <li key={o.orderId} className="border rounded p-3 flex justify-between items-start">
                  <div>
                    <div className="font-medium">Order ID: <span className="text-green-600">{o.orderId}</span></div>
                    <div className="text-sm text-gray-600">Status: {o.status || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">Created: {o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}</div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <button onClick={() => cancelOrder(o.orderId, o.docId)} className="text-sm text-red-600 hover:underline">Cancel</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrders;
