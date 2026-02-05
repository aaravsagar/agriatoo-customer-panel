import React from 'react';
import { Order } from '../../types';
import { generateOrderQR } from '../../utils/qrUtils';
import { Download, Printer } from 'lucide-react';

interface OrderReceiptProps {
  order: Order;
  onDownload?: () => void;
  onPrint?: () => void;
}

const OrderReceipt: React.FC<OrderReceiptProps> = ({ order, onDownload, onPrint }) => {
  const qrCodeDataUrl = generateOrderQR(order.orderId);
  
  const estimatedDeliveryDate = new Date(order.createdAt);
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 1);

  const handleDownload = () => {
    const receiptElement = document.getElementById('receipt-content');
    if (receiptElement) {
      // Create a new window for printing/downloading
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Order Receipt - ${order.orderId}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .receipt { max-width: 400px; margin: 0 auto; }
                .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 10px; margin-bottom: 20px; }
                .qr-code { text-align: center; margin: 20px 0; }
                .order-details { margin: 20px 0; }
                .items { border-top: 1px solid #ccc; padding-top: 10px; }
                .item { display: flex; justify-content: space-between; margin: 5px 0; }
                .total { border-top: 2px solid #16a34a; padding-top: 10px; font-weight: bold; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${receiptElement.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        
        // Auto download/print
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }
    onDownload?.();
  };

  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Order Receipt</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Download Receipt"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Print Receipt"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div id="receipt-content" className="receipt">
        {/* Header */}
        <div className="header text-center border-b-2 border-green-600 pb-4 mb-6">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
            <span className="text-white font-bold">A</span>
          </div>
          <h2 className="text-xl font-bold text-green-800">AGRIATOO</h2>
          <p className="text-sm text-gray-600">Agricultural Marketplace</p>
        </div>

        {/* QR Code */}
        <div className="qr-code text-center mb-6">
          <img 
            src={qrCodeDataUrl} 
            alt="Order QR Code" 
            className="w-32 h-32 mx-auto border border-gray-200 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-2">Scan for order tracking</p>
        </div>

        {/* Order Details */}
        <div className="order-details space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-mono font-semibold">{order.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span>{order.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span>{order.createdAt.toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="capitalize font-medium text-green-600">{order.status.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Est. Delivery:</span>
            <span className="font-medium">{estimatedDeliveryDate.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Customer Details */}
        <div className="border-t pt-4 mb-6">
          <h4 className="font-semibold mb-2">Delivery Details</h4>
          <p className="text-sm text-gray-600">{order.customerName}</p>
          <p className="text-sm text-gray-600">{order.customerPhone}</p>
          <p className="text-sm text-gray-600">{order.customerAddress}</p>
          <p className="text-sm text-gray-600">PIN: {order.customerPincode}</p>
        </div>

        {/* Items */}
        <div className="items border-t pt-4 mb-6">
          <h4 className="font-semibold mb-3">Order Items</h4>
          {order.items.map((item, index) => (
            <div key={index} className="item flex justify-between items-center py-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{item.productName}</p>
                <p className="text-xs text-gray-500">{item.quantity} {item.unit} × ₹{item.price}</p>
              </div>
              <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="total border-t-2 border-green-600 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total Amount:</span>
            <span className="text-lg font-bold text-green-600">₹{order.totalAmount.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Payment: Cash on Delivery</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">Thank you for choosing AGRIATOO!</p>
          <p className="text-xs text-gray-500">For support: +91-9999-AGRI-TOO</p>
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;