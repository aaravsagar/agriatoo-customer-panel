// orderNotificationUtils.ts
// Utility functions for order status change notifications

import { notificationService } from './notificationService';
import { Order } from '../../types';

export const getEstimatedDeliveryDate = (orderDate: Date): Date => {
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 1);
  return deliveryDate;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const getStatusMessage = (status: string, order: Order): { title: string; body: string } => {
  const estDelivery = formatDate(getEstimatedDeliveryDate(order.createdAt));
  
  switch (status) {
    case 'received':
      return {
        title: '🎉 Order Received!',
        body: `Order #${order.orderId} has been received and will be delivered by ${estDelivery}. Seller: ${order.sellerName}`,
      };
    
    case 'packed':
      return {
        title: '📦 Order Packed!',
        body: `Order #${order.orderId} has been packed and is ready for dispatch. Expected delivery: ${estDelivery}`,
      };
    
    case 'out_for_delivery':
      return {
        title: '🚚 Out for Delivery!',
        body: `Order #${order.orderId} is out for delivery. Your order will arrive soon!`,
      };
    
    case 'delivered':
      return {
        title: '✅ Order Delivered!',
        body: `Order #${order.orderId} has been successfully delivered. Thank you for your purchase!`,
      };
    
    default:
      return {
        title: 'Order Update',
        body: `Order #${order.orderId} status has been updated.`,
      };
  }
};

export const sendOrderStatusNotification = async (order: Order): Promise<void> => {
  try {
    const { title, body } = getStatusMessage(order.status, order);
    
    await notificationService.showNotification(title, {
      body,
      icon: '/logo192.png', // Update with your app icon
      badge: '/badge-icon.png', // Update with your badge icon
      data: {
        orderId: order.id,
        orderNumber: order.orderId,
        status: order.status,
        url: `/orders/${order.id}`, // Update with your order detail route
      },
      actions: [
        {
          action: 'view',
          title: 'View Order',
        },
        {
          action: 'close',
          title: 'Close',
        },
      ],
    });
  } catch (error) {
    console.error('Failed to send order notification:', error);
  }
};

export const requestNotificationPermissionOnMount = async (): Promise<boolean> => {
  try {
    const granted = await notificationService.requestPermission();
    if (granted) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
    return granted;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};