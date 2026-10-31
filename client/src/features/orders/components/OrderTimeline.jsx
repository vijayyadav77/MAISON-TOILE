import React from 'react';
import { CheckCircle2, Clock, Truck, Check, XCircle } from 'lucide-react';

export const OrderTimeline = ({ orderStatus = 'processing', timeline = [] }) => {
  if (orderStatus === 'cancelled') {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans flex items-center gap-2">
        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <span>This order was cancelled. Restocked in atelier.</span>
      </div>
    );
  }

  const steps = [
    { key: 'processing', label: 'Order Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'shipped', label: 'In Transit' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const statusHierarchy = {
    processing: 1,
    confirmed: 2,
    shipped: 3,
    delivered: 4,
  };

  const currentLevel = statusHierarchy[orderStatus] || 1;

  return (
    <div className="py-6">
      <div className="relative flex items-center justify-between">
        {/* Progress bar background line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-luxury-200 z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-luxury-950 transition-all duration-500 z-0"
          style={{ width: `${((currentLevel - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const stepLevel = idx + 1;
          const isCompleted = stepLevel <= currentLevel;
          const isCurrent = stepLevel === currentLevel;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                  isCompleted
                    ? 'bg-luxury-950 border-luxury-950 text-white'
                    : 'bg-white border-luxury-300 text-luxury-400'
                } ${isCurrent ? 'ring-4 ring-luxury-200' : ''}`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider font-semibold mt-2 ${
                  isCompleted ? 'text-luxury-950' : 'text-luxury-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
