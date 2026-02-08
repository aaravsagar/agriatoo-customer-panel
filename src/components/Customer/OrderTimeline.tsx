import React from 'react';
import { Check, Clock, Truck, Package, MapPin, CheckCircle } from 'lucide-react';
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
        title: 'Out For Delivery',
        description: 'Your order is on the way',
        icon: Truck,
        timestamp: order.outForDeliveryAt
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Your order has been delivered',
        icon: CheckCircle,
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
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Order Timeline</h3>
          <div className="flex items-center space-x-2 text-sm bg-green-50 px-4 py-2 rounded-xl">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">
              Est. Delivery: <span className="font-semibold text-green-700">{getEstimatedDeliveryDate().toLocaleDateString()}</span>
            </span>
          </div>
        </div>

        {/* Mobile Timeline (Vertical) */}
        <div className="block md:hidden">
          <div className="relative">
            {/* Vertical Progress Line */}
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-gray-200 rounded-full">
              <div
                className="bg-green-600 w-full transition-all duration-500 ease-out rounded-full"
                style={{
                  height: `${(currentStepIndex / (steps.length - 1)) * 100}%`
                }}
              />
            </div>

            <div className="space-y-8">
              {steps.map((step, index) => {
                const status = getStepStatus(index);
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="relative flex items-start">
                    {/* Step Circle */}
                    <div
                      className={`
                        relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 bg-white transition-all duration-300 shadow-lg
                        ${status === 'completed'
                          ? 'border-green-600 text-green-600'
                          : status === 'current'
                          ? 'border-green-600 text-green-600 ring-4 ring-green-100'
                          : 'border-gray-300 text-gray-400'
                        }
                      `}
                    >
                      {status === 'completed' ? (
                        <Check className="w-8 h-8 font-bold" strokeWidth={3} />
                      ) : status === 'current' ? (
                        <div className="relative">
                          <StepIcon className="w-7 h-7" />
                          <div className="absolute inset-0 animate-ping">
                            <StepIcon className="w-7 h-7 opacity-50" />
                          </div>
                        </div>
                      ) : (
                        <Clock className="w-7 h-7" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="ml-6 flex-1">
                      <h4
                        className={`
                          text-lg font-semibold mb-1
                          ${status === 'completed' || status === 'current'
                            ? 'text-gray-900'
                            : 'text-gray-500'
                          }
                        `}
                      >
                        {step.title}
                      </h4>
                      <p
                        className={`
                          text-sm mb-2
                          ${status === 'completed' || status === 'current'
                            ? 'text-gray-600'
                            : 'text-gray-400'
                          }
                        `}
                      >
                        {step.description}
                      </p>
                      {step.timestamp && (
                        <p className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full inline-block">
                          {step.timestamp.toLocaleDateString()} {step.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}

                      {status === 'current' && (
                        <div className="mt-3 inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          In Progress
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop Timeline (Horizontal) */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Horizontal Progress Line */}
            <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 rounded-full">
              <div
                className="bg-green-600 h-full transition-all duration-500 ease-out rounded-full"
                style={{
                  width: `${(currentStepIndex / (steps.length - 1)) * 100}%`
                }}
              />
            </div>

            <div className="grid grid-cols-4 gap-0">
              {steps.map((step, index) => {
                const status = getStepStatus(index);
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="relative flex flex-col items-center text-center">
                    {/* Step Circle */}
                    <div
                      className={`
                        relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 bg-white transition-all duration-300 shadow-lg mb-4
                        ${status === 'completed'
                          ? 'border-green-600 text-green-600'
                          : status === 'current'
                          ? 'border-green-600 text-green-600 ring-4 ring-green-100'
                          : 'border-gray-300 text-gray-400'
                        }
                      `}
                    >
                      {status === 'completed' ? (
                        <Check className="w-8 h-8 font-bold" strokeWidth={3} />
                      ) : status === 'current' ? (
                        <div className="relative">
                          <StepIcon className="w-7 h-7" />
                          <div className="absolute inset-0 animate-ping">
                            <StepIcon className="w-7 h-7 opacity-50" />
                          </div>
                        </div>
                      ) : (
                        <Clock className="w-7 h-7" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="max-w-32">
                      <h4
                        className={`
                          text-base font-semibold mb-1
                          ${status === 'completed' || status === 'current'
                            ? 'text-gray-900'
                            : 'text-gray-500'
                          }
                        `}
                      >
                        {step.title}
                      </h4>
                      <p
                        className={`
                          text-sm mb-2
                          ${status === 'completed' || status === 'current'
                            ? 'text-gray-600'
                            : 'text-gray-400'
                          }
                        `}
                      >
                        {step.description}
                      </p>
                      {step.timestamp && (
                        <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                          {step.timestamp.toLocaleDateString()} {step.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}

                      {status === 'current' && (
                        <div className="mt-3 inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          In Progress
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 p-4 rounded-xl">
            <span className="text-gray-600 block mb-1">Order ID</span>
            <p className="font-mono font-semibold text-gray-900">{order.orderId}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <span className="text-gray-600 block mb-1">Total Amount</span>
            <p className="font-semibold text-green-600 text-lg">₹{order.totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <span className="text-gray-600 block mb-1">Payment</span>
            <p className="font-medium text-gray-900">Cash on Delivery</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <span className="text-gray-600 block mb-1">Seller</span>
            <p className="font-medium text-gray-900">{order.sellerName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;