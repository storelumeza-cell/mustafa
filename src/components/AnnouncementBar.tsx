import React, { useState } from 'react';
import { X, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { formatPrice, freeShippingThresholdPKR } = useStore();

  if (dismissed) return null;

  return (
    <aside aria-label="Store announcement" className="relative bg-neutral-900 border-b border-neutral-800 text-xs py-2 px-4 text-neutral-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-3 sm:gap-6 text-center overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <Truck className="w-3.5 h-3.5 text-amber-500" />
            <span>Complimentary Express Delivery on orders above {formatPrice(freeShippingThresholdPKR)}</span>
          </div>
          <span className="hidden md:inline text-neutral-600">·</span>
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mustafa Iqbal 1-Year Official Warranty & Authenticity Certified</span>
          </div>
          <span className="hidden lg:inline text-neutral-600">·</span>
          <span className="hidden lg:inline text-amber-400 font-medium">Use code MUSTAFA10 for 10% off</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="ml-2 text-neutral-400 hover:text-neutral-200 transition-colors p-1"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
