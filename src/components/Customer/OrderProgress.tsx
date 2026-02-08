import React, { useState, useEffect } from 'react';
import { Truck, Sprout, Wheat, Tractor } from 'lucide-react';

interface OrderProgressProps {
  onComplete: () => void;
}

const OrderProgress: React.FC<OrderProgressProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Sprout, text: "Preparing your order..." },
    { icon: Wheat, text: "Selecting quality products..." },
    { icon: Tractor, text: "Processing from farm to you..." },
    { icon: Truck, text: "Finalizing delivery details..." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2; // 2% every 100ms = 5 seconds total
        
        // Update step based on progress
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Small delay before completion
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  const CurrentIcon = steps[currentStep]?.icon || Sprout;

  return (
    <div className="fixed inset-0 bg-green-600 flex items-center justify-center z-50">
      <div className="text-center text-white max-w-md mx-auto px-6">
        {/* Animated Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CurrentIcon className="w-12 h-12 text-white animate-bounce" />
          </div>
          
          {/* Floating Elements Animation */}
          <div className="relative h-16">
            <div className="absolute inset-0 flex justify-center items-center space-x-4">
              <Sprout className="w-6 h-6 text-green-200 animate-ping" style={{ animationDelay: '0s' }} />
              <Wheat className="w-6 h-6 text-green-200 animate-ping" style={{ animationDelay: '0.5s' }} />
              <Tractor className="w-6 h-6 text-green-200 animate-ping" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>

        {/* Progress Text */}
        <h2 className="text-2xl font-bold mb-2">Placing Your Order</h2>
        <p className="text-green-100 mb-8 text-lg">
          {steps[currentStep]?.text || "Processing..."}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-4">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-green-100 text-sm">
          {Math.round(progress)}% Complete
        </p>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border border-white border-opacity-20 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-10 right-10 w-16 h-16 border border-white border-opacity-20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
        <div className="absolute top-1/2 left-5 w-12 h-12 border border-white border-opacity-20 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 right-5 w-8 h-8 border border-white border-opacity-20 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
      </div>
    </div>
  );
};

export default OrderProgress;
