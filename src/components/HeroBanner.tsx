import React from 'react';
import { ArrowRight, ShieldCheck, Plus, Sparkles } from 'lucide-react';
import { HERO_IMAGE } from '../data/watches';
import { useStore } from '../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { formatPrice, setIsAdminOpen, watches } = useStore();

  const handleExplore = () => {
    const el = document.getElementById('collection-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sampleWatch = watches[0];

  return (
    <section className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Narrative */}
          <div className="lg:col-span-6 z-10 space-y-6">
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-amber-400 font-semibold">
              <span>Mustafa Iqbal Horology</span>
              <span aria-hidden="true">·</span>
              <span>Boutique Timepieces</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-100 font-display leading-[1.12]">
              Mustafa Iqbal. Distinction in Every Second.
            </h1>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Precision horology curated by Mustafa Iqbal. Engineered with 316L surgical steel, sapphire crystal, and Japanese movements. Discover our flagship exhibition models or add your own custom timepieces via the Admin Portal.
            </p>

            {/* Editorial Feature Specs */}
            <div className="pt-2 pb-4 grid grid-cols-3 gap-4 border-y border-neutral-800/80">
              <div>
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Movement</p>
                <p className="text-sm font-semibold text-neutral-200 mt-0.5">Japanese Caliber</p>
              </div>
              <div>
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Crystal</p>
                <p className="text-sm font-semibold text-neutral-200 mt-0.5">Sapphire Glass</p>
              </div>
              <div>
                <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Warranty</p>
                <p className="text-sm font-semibold text-neutral-200 mt-0.5">1-Year Official</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleExplore}
                className="px-6 py-3 text-xs sm:text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors flex items-center gap-2 shadow-lg shadow-amber-950/20 cursor-pointer"
              >
                <span>Browse Timepieces</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-5 py-3 text-xs sm:text-sm font-medium text-amber-400 hover:text-amber-300 bg-neutral-900 hover:bg-neutral-850 border border-amber-400/30 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add My Products</span>
              </button>
            </div>

            {/* Quiet trust markers */}
            <div className="flex items-center gap-6 pt-2 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Multi-Payment Moods Supported</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Verified & Email Confirmed</span>
              </div>
            </div>
          </div>

          {/* Right Product Hero Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/60 shadow-2xl group">
              <img
                src={sampleWatch ? sampleWatch.primaryImage : HERO_IMAGE}
                alt="Mustafa Iqbal Luxury Watch"
                className="w-full h-auto object-cover aspect-[4/3] sm:aspect-[16/10] transform transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent pointer-events-none" />

              {/* In-image caption card */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase">
                    Mustafa Iqbal Signature
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-neutral-100">
                    {sampleWatch ? sampleWatch.name : 'Mustafa Iqbal Chronograph'}
                  </p>
                  <p className="text-xs text-neutral-400">
                    Price: <span className="font-mono text-neutral-200 font-medium">{sampleWatch ? formatPrice(sampleWatch.pricePKR) : formatPrice(18500)}</span>
                  </p>
                </div>
                <button
                  onClick={handleExplore}
                  className="px-3.5 py-1.5 text-xs font-medium text-neutral-200 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded transition-colors whitespace-nowrap"
                >
                  View Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
