import React, { useState, useEffect, useRef } from 'react';
import { Truck, Sprout, Wheat, Tractor, X, CheckCircle, XCircle } from 'lucide-react';

interface OrderProgressProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const OrderProgress: React.FC<OrderProgressProps> = ({ onComplete, onCancel }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const particleIdRef = useRef(0);

  const steps = [
    { icon: Sprout, text: "Preparing your order...", color: "#10b981" },
    { icon: Wheat, text: "Selecting quality products...", color: "#f59e0b" },
    { icon: Tractor, text: "Processing from farm to you...", color: "#8b5cf6" },
    { icon: Truck, text: "Finalizing delivery details...", color: "#3b82f6" }
  ];

  // Create particles
  const createParticles = (x: number, y: number, count: number = 15) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 60,
        maxLife: 60,
        color: `hsl(${120 + Math.random() * 60}, 70%, 60%)`,
        size: Math.random() * 4 + 2
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Animate particles
  const animateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setParticles(prevParticles => {
      const updatedParticles = prevParticles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1,
          vy: particle.vy + 0.1 // gravity
        }))
        .filter(particle => particle.life > 0);

      // Draw particles
      updatedParticles.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      return updatedParticles;
    });

    animationRef.current = requestAnimationFrame(animateParticles);
  };

  useEffect(() => {
    animateParticles();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isCancelled || isCompleted) return;

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1.5; // Slower progress for better UX
        
        // Update step based on progress
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        const newStepIndex = Math.min(stepIndex, steps.length - 1);
        
        if (newStepIndex !== currentStep) {
          setCurrentStep(newStepIndex);
          // Create particles when step changes
          createParticles(window.innerWidth / 2, window.innerHeight / 2, 20);
        }
        
        if (newProgress >= 100) {
          setIsCompleted(true);
          createParticles(window.innerWidth / 2, window.innerHeight / 2, 30);
          setTimeout(() => onComplete(), 1000);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentStep, isCancelled, isCompleted, onComplete, steps.length]);

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    setIsCancelled(true);
    setShowCancelConfirm(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    // Create red particles for cancellation
    createParticles(window.innerWidth / 2, window.innerHeight / 2, 25);
    setTimeout(() => onCancel(), 1500);
  };

  const handleCancelConfirmClose = () => {
    setShowCancelConfirm(false);
  };

  const CurrentIcon = steps[currentStep]?.icon || Sprout;
  const currentColor = steps[currentStep]?.color || "#10b981";

  if (isCancelled) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center z-50">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />
        <div className="text-center text-white max-w-md mx-auto px-6 relative z-10">
          <div className="mb-8">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <XCircle className="w-16 h-16 text-white animate-bounce" />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4 animate-fade-in">Order Cancelled</h2>
          <p className="text-red-100 mb-8 text-lg animate-fade-in-delay">
            Your order has been cancelled successfully
          </p>

          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-4">
            <div className="bg-white h-2 rounded-full transition-all duration-500 ease-out w-full opacity-50" />
          </div>
          
          <p className="text-red-100 text-sm animate-pulse">
            Returning to cart...
          </p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center z-50">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />
        <div className="text-center text-white max-w-md mx-auto px-6 relative z-10">
          <div className="mb-8">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4">Order Placed Successfully!</h2>
          <p className="text-green-100 mb-8 text-lg">
            Your order is being processed
          </p>

          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-4">
            <div className="bg-white h-2 rounded-full transition-all duration-500 ease-out w-full" />
          </div>
          
          <p className="text-green-100 text-sm">
            Redirecting to orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center z-50">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
      
      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelConfirmClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Continue Order
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-white max-w-md mx-auto px-6 relative z-10">
        {/* Cancel Button */}
        <button
          onClick={handleCancelClick}
          className="absolute top-0 right-0 p-3 text-white hover:text-red-200 transition-colors transform hover:scale-110 active:scale-95"
          aria-label="Cancel Order"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Animated Icon */}
        <div className="mb-8">
          <div 
            className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
            style={{
              boxShadow: `0 0 30px ${currentColor}40`,
              animation: 'pulse-glow 2s ease-in-out infinite'
            }}
          >
            <CurrentIcon 
              className="w-16 h-16 text-white animate-bounce" 
              style={{ 
                filter: `drop-shadow(0 0 10px ${currentColor})`,
                animation: 'bounce 1s ease-in-out infinite, rotate-subtle 3s ease-in-out infinite'
              }}
            />
            
            {/* Rotating ring */}
            <div 
              className="absolute inset-0 border-4 border-transparent border-t-white rounded-full"
              style={{ animation: 'spin 2s linear infinite' }}
            />
          </div>
          
          {/* Floating Elements Animation */}
          <div className="relative h-16">
            <div className="absolute inset-0 flex justify-center items-center space-x-8">
              <Sprout 
                className="w-6 h-6 text-green-200" 
                style={{ 
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: '0s'
                }} 
              />
              <Wheat 
                className="w-6 h-6 text-yellow-200" 
                style={{ 
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: '0.5s'
                }} 
              />
              <Tractor 
                className="w-6 h-6 text-purple-200" 
                style={{ 
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: '1s'
                }} 
              />
              <Truck 
                className="w-6 h-6 text-blue-200" 
                style={{ 
                  animation: 'float 3s ease-in-out infinite',
                  animationDelay: '1.5s'
                }} 
              />
            </div>
          </div>
        </div>

        {/* Progress Text */}
        <h2 className="text-3xl font-bold mb-2 animate-fade-in">Placing Your Order</h2>
        <p 
          className="text-green-100 mb-8 text-lg transition-all duration-500 ease-in-out"
          style={{ 
            animation: 'fade-in-up 0.5s ease-out',
            color: currentColor + '20'
          }}
        >
          {steps[currentStep]?.text || "Processing..."}
        </p>

        {/* Enhanced Progress Bar */}
        <div className="w-full bg-white bg-opacity-20 rounded-full h-4 mb-4 overflow-hidden relative">
          <div 
            className="h-4 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
            style={{ 
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${currentColor}, ${currentColor}dd)`,
              boxShadow: `0 0 20px ${currentColor}80`
            }}
          >
            {/* Shimmer effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              style={{ animation: 'shimmer 2s ease-in-out infinite' }}
            />
          </div>
          
          {/* Progress indicator dots */}
          <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 transform -translate-y-1/2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep ? 'bg-white shadow-lg' : 'bg-white bg-opacity-40'
                }`}
                style={{
                  transform: index <= currentStep ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: index <= currentStep ? `0 0 8px ${currentColor}` : 'none'
                }}
              />
            ))}
          </div>
        </div>
        
        <p className="text-green-100 text-sm">
          {Math.round(progress)}% Complete
        </p>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2 mt-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-white bg-opacity-20 text-white scale-110' 
                    : 'bg-white bg-opacity-10 text-white text-opacity-50'
                }`}
                style={{
                  boxShadow: index <= currentStep ? `0 0 15px ${step.color}60` : 'none'
                }}
              >
                <StepIcon className="w-4 h-4" />
              </div>
            );
          })}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border border-white border-opacity-20 rounded-full animate-spin-slow" />
        <div className="absolute bottom-10 right-10 w-16 h-16 border border-white border-opacity-20 rounded-full animate-spin-reverse" />
        <div className="absolute top-1/2 left-5 w-12 h-12 border border-white border-opacity-20 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 right-5 w-8 h-8 border border-white border-opacity-20 rounded-full animate-ping" style={{ animationDelay: '3s' }} />
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px ${currentColor}40; }
          50% { box-shadow: 0 0 50px ${currentColor}80; }
        }
        
        @keyframes rotate-subtle {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.5s ease-out 0.2s both;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrderProgress;