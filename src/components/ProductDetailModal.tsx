import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Scale,
  Check,
  Gift,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { Watch } from '../types/watch';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedWatch,
    setSelectedWatch,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    setIsCheckoutOpen,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [includeGiftBox, setIncludeGiftBox] = useState(true);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'wrist'>('specs');
  const [wristSize, setWristSize] = useState(7.0); // inches
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const [selectedColor, setSelectedColor] = useState<string>(selectedWatch?.dialColor || 'Emerald');

  if (!selectedWatch) return null;

  const colorOptions = selectedWatch.availableColors && selectedWatch.availableColors.length > 0
    ? selectedWatch.availableColors
    : [selectedWatch.dialColor];

  const hasDiscount = selectedWatch.originalPricePKR && selectedWatch.originalPricePKR > selectedWatch.pricePKR;
  const discountPct = hasDiscount
    ? Math.round(((selectedWatch.originalPricePKR! - selectedWatch.pricePKR) / selectedWatch.originalPricePKR!) * 100)
    : 0;
  const savings = hasDiscount ? selectedWatch.originalPricePKR! - selectedWatch.pricePKR : 0;

  const images = selectedWatch.galleryImages?.length
    ? selectedWatch.galleryImages
    : [selectedWatch.primaryImage, selectedWatch.secondaryImage].filter(Boolean);

  const isFavorited = isInWishlist(selectedWatch.id);
  const isCompared = isInCompare(selectedWatch.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({ x, y });
  };

  const handleBuyNow = () => {
    addToCart({ ...selectedWatch, dialColor: selectedColor }, quantity, includeGiftBox);
    setSelectedWatch(null);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = () => {
    addToCart({ ...selectedWatch, dialColor: selectedColor }, quantity, includeGiftBox);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-10">
      <div
        className="fixed inset-0"
        onClick={() => setSelectedWatch(null)}
      />

      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Top bar with close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/50">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="uppercase tracking-wider font-semibold text-amber-400">
              {selectedWatch.collection} Series
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-neutral-300">SKU: {selectedWatch.sku}</span>
          </div>

          <button
            onClick={() => setSelectedWatch(null)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split 2-Column layout */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Column: Interactive Product Gallery */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main Zoomable Image Frame */}
              <div
                className="relative aspect-[4/3] bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden flex items-center justify-center cursor-crosshair group select-none"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={images[activeImageIndex] || selectedWatch.primaryImage}
                  alt={selectedWatch.name}
                  className={`w-full h-full object-contain transition-transform duration-200 pointer-events-none ${
                    isZoomed ? 'scale-175' : 'scale-100'
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                        }
                      : undefined
                  }
                  referrerPolicy="no-referrer"
                />

                {/* Subtle zoom guide affordance */}
                <div className="absolute bottom-3 right-3 text-[11px] text-neutral-400 bg-neutral-900/80 px-2.5 py-1 rounded backdrop-blur-sm pointer-events-none flex items-center gap-1.5 border border-neutral-800">
                  <Maximize2 className="w-3 h-3" />
                  <span>Hover to zoom 1.75x</span>
                </div>
              </div>

              {/* Multi-angle Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-16 rounded-lg overflow-hidden border bg-neutral-950 shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-amber-400 ring-1 ring-amber-400'
                          : 'border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Angle ${idx + 1}`}
                        className="w-full h-full object-contain p-1"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Tabs for Tabs: Specs, Wrist Fit, Reviews */}
              <div className="pt-4 border-t border-neutral-800">
                <div className="flex border-b border-neutral-800 gap-6">
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                      activeTab === 'specs'
                        ? 'text-amber-400 border-amber-400'
                        : 'text-neutral-400 border-transparent hover:text-neutral-200'
                    }`}
                  >
                    Technical Specs
                  </button>
                  <button
                    onClick={() => setActiveTab('wrist')}
                    className={`pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                      activeTab === 'wrist'
                        ? 'text-amber-400 border-amber-400'
                        : 'text-neutral-400 border-transparent hover:text-neutral-200'
                    }`}
                  >
                    Wrist Fit Visualizer
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                      activeTab === 'reviews'
                        ? 'text-amber-400 border-amber-400'
                        : 'text-neutral-400 border-transparent hover:text-neutral-200'
                    }`}
                  >
                    Verified Reviews ({selectedWatch.reviews?.length || 0})
                  </button>
                </div>

                {/* Tab Content */}
                <div className="pt-4">
                  {activeTab === 'specs' && (
                    <div className="space-y-4">
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {selectedWatch.description}
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800/80">
                          <span className="text-neutral-400">Movement Caliber:</span>
                          <p className="font-semibold text-neutral-200 mt-0.5">{selectedWatch.movement}</p>
                        </div>
                        <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800/80">
                          <span className="text-neutral-400">Case Diameter:</span>
                          <p className="font-semibold text-neutral-200 mt-0.5">{selectedWatch.caseDiameter}</p>
                        </div>
                        <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800/80">
                          <span className="text-neutral-400">Case Thickness:</span>
                          <p className="font-semibold text-neutral-200 mt-0.5">{selectedWatch.caseThickness}</p>
                        </div>
                        <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800/80">
                          <span className="text-neutral-400">Crystal Glass:</span>
                          <p className="font-semibold text-neutral-200 mt-0.5">{selectedWatch.glassType}</p>
                        </div>
                        <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800/80">
                          <span className="text-neutral-400">Water Resistance:</span>
                          <p className="font-semibold text-neutral-200 mt-0.5">{selectedWatch.waterResistance}</p>
                        </div>
                        <div className="p-2.5 rounded bg-neutral-950/60 border border-neutral-800/80">
                          <span className="text-neutral-400">Strap / Bracelet:</span>
                          <p className="font-semibold text-neutral-200 mt-0.5">{selectedWatch.strapMaterial}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'wrist' && (
                    <div className="space-y-4 p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-200">
                          Simulate Wrist Size: <span className="font-mono text-amber-400">{wristSize.toFixed(1)} inches</span> ({(wristSize * 2.54).toFixed(1)} cm)
                        </span>
                        <span className="text-[11px] text-neutral-400">Standard Men: 6.5" - 7.5"</span>
                      </div>
                      <input
                        type="range"
                        min="6.0"
                        max="8.5"
                        step="0.1"
                        value={wristSize}
                        onChange={(e) => setWristSize(parseFloat(e.target.value))}
                        className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
                      />
                      <div className="p-3 bg-neutral-900 rounded-lg text-xs space-y-1.5 border border-neutral-800">
                        <p className="text-neutral-300">
                          <span className="font-semibold text-amber-400">Fit Recommendation: </span>
                          {parseFloat(selectedWatch.caseDiameter) <= 41
                            ? 'Excellent balanced fit on this wrist size.'
                            : wristSize < 6.5
                            ? 'Bold commanding presence on wrist. Micro-adjustment links included in packaging.'
                            : 'Optimal wrist ratio with exceptional comfort and silhouette.'}
                        </p>
                        <p className="text-[11px] text-neutral-400">
                          Package includes complimentary link-removal adjustment tool.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-3">
                      {selectedWatch.reviews?.map((rev) => (
                        <div key={rev.id} className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-neutral-200">{rev.author}</span>
                              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Verified Buyer
                              </span>
                            </div>
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-neutral-300 leading-relaxed">{rev.comment}</p>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                            <span>{rev.location}</span>
                            <span>·</span>
                            <span>{rev.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Title & Tagline */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold font-display text-neutral-100">
                    {selectedWatch.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                    {selectedWatch.tagline}
                  </p>
                </div>

                {/* Rating & Review Counter */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-semibold text-neutral-200">{selectedWatch.rating}</span>
                  <span className="text-neutral-400">({selectedWatch.reviewCount} customer reviews)</span>
                </div>

                {/* Price & Discount Module */}
                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2.5">
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold text-neutral-100 font-mono tabular-nums">
                        {formatPrice(selectedWatch.pricePKR)}
                      </span>
                      {selectedWatch.originalPricePKR && selectedWatch.originalPricePKR > selectedWatch.pricePKR && (
                        <span className="text-sm text-neutral-500 line-through font-mono tabular-nums">
                          {formatPrice(selectedWatch.originalPricePKR)}
                        </span>
                      )}
                    </div>
                    {discountPct > 0 && (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  {savings > 0 && (
                    <div className="text-xs text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900/50 rounded px-2.5 py-1 flex items-center justify-between">
                      <span>Real / MSRP Price: {formatPrice(selectedWatch.originalPricePKR!)}</span>
                      <span className="font-bold">You Save {formatPrice(savings)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium pt-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>In Stock · Available for Cash on Delivery & Express Courier</span>
                  </div>
                </div>

                {/* Colour Variant Options */}
                {colorOptions.length > 0 && (
                  <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-300">
                        Colour Option: <strong className="text-amber-400">{selectedColor}</strong>
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {colorOptions.length} variant{colorOptions.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {colorOptions.map((c) => {
                        const isSelected = selectedColor === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setSelectedColor(c)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-amber-400 text-neutral-950 font-bold border-amber-400 shadow-md'
                                : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'
                            }`}
                          >
                            <span>{c}</span>
                            {isSelected && <Check className="w-3 h-3 text-neutral-950" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Key Bullet Features */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Key Highlights
                  </p>
                  <ul className="space-y-1 text-xs text-neutral-300">
                    {selectedWatch.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Luxury Presentation Packaging Option */}
                <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-start gap-3">
                  <Gift className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-200">
                        Official Mustafa Iqbal Luxury Gift Box
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px]">Complimentary</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Includes serialized guarantee card, warranty certificate, & microfiber polishing cloth.
                    </p>
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-neutral-300">Quantity</span>
                  <div className="flex items-center border border-neutral-800 rounded-md bg-neutral-950">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-neutral-300 hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-mono font-semibold text-neutral-100">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-1.5 text-neutral-300 hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Purchase Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-800">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs tracking-wider uppercase rounded-md transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag · {formatPrice(selectedWatch.pricePKR * quantity)}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 bg-neutral-950 hover:bg-neutral-850 text-neutral-100 border border-neutral-700 hover:border-amber-400 font-semibold text-xs tracking-wider uppercase rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Express Checkout (COD / Online)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Wishlist & Compare Quick Toggles */}
                <div className="flex items-center justify-center gap-6 pt-2 text-xs text-neutral-400">
                  <button
                    onClick={() => toggleWishlist(selectedWatch.id)}
                    className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-amber-400 text-amber-400' : ''}`} />
                    <span>{isFavorited ? 'In Wishlist' : 'Save to Wishlist'}</span>
                  </button>
                  <span className="text-neutral-700">·</span>
                  <button
                    onClick={() => toggleCompare(selectedWatch.id)}
                    className="flex items-center gap-1.5 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Scale className={`w-3.5 h-3.5 ${isCompared ? 'text-amber-400' : ''}`} />
                    <span>{isCompared ? 'Comparing' : 'Compare Specifications'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
