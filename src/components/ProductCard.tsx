import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Check, Scale } from 'lucide-react';
import { Watch } from '../types/watch';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  watch: Watch;
}

export const ProductCard: React.FC<ProductCardProps> = ({ watch }) => {
  const [isHovered, setIsHovered] = useState(false);
  const {
    formatPrice,
    setSelectedWatch,
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
  } = useStore();

  const isFavorited = isInWishlist(watch.id);
  const isCompared = isInCompare(watch.id);

  // Discount percentage calculation
  const discountPercent = watch.originalPricePKR
    ? Math.round(((watch.originalPricePKR - watch.pricePKR) / watch.originalPricePKR) * 100)
    : 0;

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-neutral-900/40 rounded-xl border border-neutral-800/80 overflow-hidden transition-all duration-300 hover:border-neutral-700 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Visual Image Container (takes ~68% height) */}
      <div className="relative aspect-[4/3] bg-neutral-925 overflow-hidden flex items-center justify-center p-4">
        <img
          src={isHovered && watch.secondaryImage ? watch.secondaryImage : watch.primaryImage}
          alt={watch.name}
          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Quiet Subtle Text Tag */}
        {watch.badgeText && (
          <div className="absolute top-3 left-3 text-[10px] uppercase font-mono tracking-widest text-amber-400 bg-neutral-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-neutral-800">
            {watch.badgeText}
          </div>
        )}

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(watch.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isFavorited
                ? 'bg-amber-400 text-neutral-950'
                : 'bg-neutral-950/80 text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          {/* Quick View */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedWatch(watch);
            }}
            className="p-2 rounded-full bg-neutral-950/80 backdrop-blur-md text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
            aria-label="Quick view watch specifications"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Compare */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(watch.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isCompared
                ? 'bg-neutral-800 text-amber-400 border border-amber-400/40'
                : 'bg-neutral-950/80 text-neutral-300 hover:text-white hover:bg-neutral-900'
            }`}
            aria-label={isCompared ? 'Remove from comparison' : 'Compare watch'}
            title="Compare"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hover Quick Add to Bag bar */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:block transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={() => addToCart(watch)}
            className="w-full py-2 px-3 bg-neutral-950/95 hover:bg-amber-400 text-neutral-100 hover:text-neutral-950 border border-neutral-700 hover:border-amber-400 rounded-md text-xs font-semibold tracking-wide uppercase transition-colors flex items-center justify-center gap-1.5 shadow-lg"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Content & Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mb-1.5">
            <span className="uppercase tracking-wider font-medium">{watch.collection}</span>
            <span aria-hidden="true">·</span>
            <span>{watch.caseDiameter}</span>
            <span aria-hidden="true">·</span>
            <span>{watch.waterResistance}</span>
          </div>

          {/* Title */}
          <h2
            onClick={() => setSelectedWatch(watch)}
            className="text-sm sm:text-base font-semibold text-neutral-100 hover:text-amber-400 cursor-pointer transition-colors line-clamp-1"
          >
            {watch.name}
          </h2>

          <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
            {watch.tagline}
          </p>

          {/* Color Display */}
          <div className="flex items-center gap-1.5 mt-2 text-[11px]">
            <span className="text-neutral-500">Color:</span>
            <span className="text-neutral-300 font-medium">{watch.dialColor}</span>
            {watch.availableColors && watch.availableColors.length > 1 && (
              <span className="text-[10px] text-amber-400/80 font-mono">
                (+{watch.availableColors.length - 1} more)
              </span>
            )}
          </div>
        </div>

        {/* Price & Discount Section */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-neutral-100 font-mono tabular-nums">
              {formatPrice(watch.pricePKR)}
            </span>
            {watch.originalPricePKR && watch.originalPricePKR > watch.pricePKR && (
              <span className="text-xs text-neutral-500 line-through font-mono tabular-nums">
                {formatPrice(watch.originalPricePKR)}
              </span>
            )}
          </div>

          {discountPercent > 0 && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <div className="mt-3 sm:hidden">
          <button
            onClick={() => addToCart(watch)}
            className="w-full py-2 bg-neutral-800 text-neutral-200 active:bg-amber-400 active:text-neutral-950 rounded text-xs font-medium flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </article>
  );
};
