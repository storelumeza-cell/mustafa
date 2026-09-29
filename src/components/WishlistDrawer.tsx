import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    watches,
    formatPrice,
    addToCart,
    toggleWishlist,
    setSelectedWatch,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistWatches = watches.filter((w) => wishlist.includes(w.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h2 className="font-display font-bold text-sm tracking-wider uppercase text-neutral-100">
                Saved Wishlist ({wishlistWatches.length})
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {wishlistWatches.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Heart className="w-10 h-10 text-neutral-700 mx-auto" />
                <p className="text-sm font-semibold text-neutral-300">Your wishlist is empty</p>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Save timepieces you love to track availability or buy later.
                </p>
              </div>
            ) : (
              wishlistWatches.map((watch) => (
                <div
                  key={watch.id}
                  className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={watch.primaryImage}
                      alt={watch.name}
                      className="w-18 h-18 object-contain bg-neutral-900 rounded-lg p-1 border border-neutral-800 shrink-0 cursor-pointer"
                      onClick={() => {
                        setSelectedWatch(watch);
                        setIsWishlistOpen(false);
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className="text-xs font-semibold text-neutral-100 truncate cursor-pointer hover:text-amber-400"
                          onClick={() => {
                            setSelectedWatch(watch);
                            setIsWishlistOpen(false);
                          }}
                        >
                          {watch.name}
                        </h3>
                        <button
                          onClick={() => toggleWishlist(watch.id)}
                          className="text-neutral-400 hover:text-red-400 transition-colors p-0.5"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {watch.collection} · {watch.movement}
                      </p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-xs font-bold font-mono text-amber-400">
                          {formatPrice(watch.pricePKR)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(watch);
                      toggleWishlist(watch.id);
                    }}
                    className="w-full py-2 bg-neutral-900 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 border border-neutral-800 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-neutral-950 border-t border-neutral-800">
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-full py-2.5 bg-neutral-900 text-neutral-300 hover:text-white rounded text-xs font-medium border border-neutral-800"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
