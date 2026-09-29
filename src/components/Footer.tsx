import React from 'react';
import { ShieldCheck, Truck, Phone, Mail, MapPin, Shield, Lock, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DEFAULT_CONTACT_PHONE } from '../data/watches';

export const Footer: React.FC = () => {
  const { updateFilter, categories, setIsAdminOpen, setIsAuthModalOpen, setAuthModalTab } = useStore();

  const handleCollectionClick = (collection: string) => {
    updateFilter('collection', collection);
    const el = document.getElementById('collection-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <span className="text-xl font-bold tracking-[0.25em] text-neutral-100 font-display">
              MUSTAFA IQBAL
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Mustafa Iqbal is a boutique horology house offering distinguished luxury wrist watches. Each timepiece is constructed with 316L surgical stainless steel, Japanese precision calibers, and scratch-resistant sapphire crystal glass.
            </p>
            <div className="pt-2 text-neutral-400 space-y-1.5 text-[11px]">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Year Official Warranty & Certified Authenticity</span>
              </p>
              <p className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Insured Nationwide Delivery with Flexible Payment Moods</span>
              </p>
            </div>
          </div>

          {/* Dynamic Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Collections
            </h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCollectionClick(cat)}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Store Management */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Store & Management
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal (Orders & Catalog)</span>
                </button>
              </li>
              <li>
                <span className="hover:text-amber-400 transition-colors cursor-pointer">
                  1-Year Official Warranty Claim
                </span>
              </li>
              <li>
                <span className="hover:text-amber-400 transition-colors cursor-pointer">
                  7-Day Return Policy
                </span>
              </li>
              <li>
                <span className="hover:text-amber-400 transition-colors cursor-pointer">
                  Watch Sizing & Strap Guide
                </span>
              </li>
            </ul>
          </div>

          {/* Contact with random 10-digit number for show */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Mustafa Iqbal Concierge
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2 text-neutral-300">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">{DEFAULT_CONTACT_PHONE}</span>
              </p>
              <p className="flex items-center gap-2 text-neutral-300">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>mustafaiqbal@store.com</span>
              </p>
              <p className="flex items-start gap-2 text-neutral-400 text-[11px] leading-snug">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Mustafa Iqbal Horology House, Lahore / Islamabad, Pakistan</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400">
            <span>Payment Moods:</span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono">
              EasyPaisa
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono">
              JazzCash
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono">
              Direct Bank Transfer (Meezan / HBL)
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono">
              Cash on Delivery (COD)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
            <button
              onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              title="Customer Sign In & Registration"
            >
              <User className="w-3 h-3 text-neutral-500" />
              <span>Customer Account</span>
            </button>
            <span className="text-neutral-700">·</span>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              title="Administrator Login (Mustafa Iqbal)"
            >
              <Lock className="w-3 h-3 text-neutral-500" />
              <span>Admin Portal</span>
            </button>
            <span className="text-neutral-700">·</span>
            <p>
              © {new Date().getFullYear()} Mustafa Iqbal Watches. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
