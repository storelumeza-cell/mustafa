import React from 'react';
import { ShieldCheck, Truck, CreditCard, RefreshCw } from 'lucide-react';

export const TrustBar: React.FC = () => {
  return (
    <section className="bg-neutral-900/50 border-b border-neutral-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                100% Authentic Guaranteed
              </h3>
              <p className="text-[12px] text-neutral-400 mt-0.5 leading-snug">
                Direct authorized factory pieces with verifiable hologram seal.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                Express Courier Delivery
              </h3>
              <p className="text-[12px] text-neutral-400 mt-0.5 leading-snug">
                Insured transit packaging with live SMS & tracking ID.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                Flexible Payment Options
              </h3>
              <p className="text-[12px] text-neutral-400 mt-0.5 leading-snug">
                Cash on Delivery, Cards, JazzCash, EasyPaisa & Bank Transfer.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RefreshCw className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                1-Year Official Warranty
              </h3>
              <p className="text-[12px] text-neutral-400 mt-0.5 leading-snug">
                Full movement coverage with nationwide service network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
