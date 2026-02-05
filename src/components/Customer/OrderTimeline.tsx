import React from 'react';
import { Check, Clock, Truck, Package, MapPin } from 'lucide-react';
import { Order } from '../../types';

interface OrderTimelineProps {
  order: Order;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const getStatusSteps = () => {
    const steps = [
      {
        id: 'received',
        title: 'Order Placed',
        description: 'Your order has been received',
        icon: Package,
        timestamp: order.createdAt
      },
      {
        id: 'packed',
        title: 'Packed',
        description: 'Your order has been packed',
        icon: Package,
        timestamp: order.packedAt
      },
      {
        id: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Your order is on the way',
        icon: Truck,
        timestamp: order.outForDeliveryAt
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered',
        icon: Check,
        timestamp: order.deliveredAt
      }
    ];

    return steps;
  };

  const getCurrentStepIndex = () => {
    const statusOrder = ['received', 'packed', 'out_for_delivery', 'delivered'];
    return statusOrder.indexOf(order.status);
  };

  const steps = getStatusSteps();
  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  const getEstimatedDeliveryDate = () => {
    const deliveryDate = new Date(order.createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    return deliveryDate;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Timeline</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>Estimated Delivery: {getEstimatedDeliveryDate().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="relative flex items-start mb-8 last:mb-0">
              {/* Icon Circle */}
              <div className={`
                relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 
                ${status === 'completed' 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : status === 'current'
                  ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                  : 'bg-white border-gray-300 text-gray-400'
                }
              `}>
                {status === 'completed' ? (
                  <Check className="w-6 h-6" />
                ) : status === 'current' ? (
                  <Clock className="w-6 h-6" />
                ) : (
                  <StepIcon className="w-6 h-6" />
                )}
              </div>

              {/* Content */}
              <div className="ml-6 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`
                    text-lg font-medium 
                    ${status === 'completed' || status === 'current' 
                      ? 'text-gray-900' 
                      : 'text-gray-500'
                    }
                  `}>
                    {step.title}
                  </h4>
                  {step.timestamp && (
                    <span className="text-sm text-gray-500">
                      {step.timestamp.toLocaleDateString()} {step.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className={`
                  text-sm mt-1 
                  ${status === 'completed' || status === 'current' 
                    ? 'text-gray-600' 
                    : 'text-gray-400'
                  }
                `}>
                  {step.description}
                </p>

                {/* Additional Info for Current Step */}
                {status === 'current' && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {step.id === 'received' && 'Your order is being processed by the seller.'}
                      {step.id === 'packed' && 'Your order is ready and will be picked up soon.'}
                      {step.id === 'out_for_delivery' && 'Your order is on the way to your address.'}
                      {step.id === 'delivered' && 'Your order has been successfully delivered.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Order ID:</span>
            <p className="font-mono font-medium">{order.orderId}</p>
          </div>
          <div>
            <span className="text-gray-600">Total Amount:</span>
            <p className="font-medium text-green-600">₹{order.totalAmount.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-gray-600">Payment:</span>
            <p className="font-medium">Cash on Delivery</p>
          </div>
          <div>
            <span className="text-gray-600">Seller:</span>
            <p className="font-medium">{order.sellerName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;