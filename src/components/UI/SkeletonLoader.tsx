import React from 'react';

export const ProductSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-3 bg-gray-300 rounded w-full"></div>
      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
      <div className="flex justify-between items-center pt-3">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
        <div className="h-10 bg-gray-300 rounded w-24"></div>
      </div>
    </div>
  </div>
);

export const OrderSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="h-5 bg-gray-300 rounded w-32"></div>
        <div className="h-6 bg-gray-300 rounded w-24"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-48"></div>
      <div className="border-t pt-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
      <div className="flex justify-between pt-4 border-t">
        <div className="h-10 bg-gray-300 rounded w-32"></div>
        <div className="h-10 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  </div>
);
