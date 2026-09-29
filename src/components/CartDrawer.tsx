import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Gift,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotalPKR,
    cartDiscountPKR,
    cartTotalPKR,
    freeShippingThresholdPKR,
    freeShippingProgress,
    formatPrice,
    updateCartQuantity,
    removeFromCart,
    appliedPromo,
    applyPromo,
    removePromo,
    setIsCheckoutOpen,
    toggleGiftBox,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, freeShippingThresholdPKR - cartSubtotalPKR);
  const shippingCostPKR = cartSubtotalPKR >= freeShippingThresholdPKR || cart.length === 0 ? 0 : 450;
  const finalPayablePKR = cartTotalPKR + shippingCostPKR;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyPromo(promoInput);
    setPromoInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-900 border-l border-neutral-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-display font-bold text-sm tracking-wider uppercase text-neutral-100">
                Shopping Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-neutral-950/90 border-b border-neutral-800 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-400 font-semibold">
                    You have unlocked Free Express Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-amber-400 font-mono">{formatPrice(remainingForFreeShipping)}</strong> for Free Express Delivery
                  </span>
                )}
              </span>
              <span className="font-mono text-neutral-400">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  remainingForFreeShipping === 0 ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Scrollable Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-neutral-700 mx-auto" />
                <p className="text-sm font-semibold text-neutral-300">Your shopping bag is empty</p>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Explore our luxury men's wrist watch collection to find your signature timepiece.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 text-xs font-semibold bg-amber-400 text-neutral-950 rounded-md hover:bg-amber-300"
                >
                  Explore Timepieces
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.watch.id}
                  className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.watch.primaryImage}
                      alt={item.watch.name}
                      className="w-18 h-18 object-contain bg-neutral-900 rounded-lg p-1 border border-neutral-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-semibold text-neutral-100 truncate">
                          {item.watch.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.watch.id)}
                          className="text-neutral-400 hover:text-red-400 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {item.watch.caseDiameter} · {item.watch.strapMaterial}
                      </p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-xs font-bold font-mono text-neutral-200">
                          {formatPrice(item.watch.pricePKR * item.quantity)}
                        </span>
                        <div className="flex items-center border border-neutral-800 rounded bg-neutral-900">
                          <button
                            onClick={() => updateCartQuantity(item.watch.id, -1)}
                            className="px-2 py-0.5 text-neutral-400 hover:text-white text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-medium text-neutral-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.watch.id, 1)}
                            className="px-2 py-0.5 text-neutral-400 hover:text-white text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gift Box Indicator */}
                  <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1.5 text-neutral-300">
                      <Gift className="w-3.5 h-3.5 text-amber-400" />
                      Official Sveston Gift Box
                    </span>
                    <span className="text-emerald-400 font-medium">Included</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {cart.length > 0 && (
            <div className="px-6 py-5 bg-neutral-950 border-t border-neutral-800 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter promo (e.g. SVESTON10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-amber-400 placeholder:text-neutral-500 font-mono uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-md transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Applied promo badge */}
              {appliedPromo && (
                <div className="flex items-center justify-between text-xs bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-md">
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Promo "{appliedPromo}" Applied</span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-neutral-400 hover:text-red-400 transition-colors text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-neutral-200">{formatPrice(cartSubtotalPKR)}</span>
                </div>
                {cartDiscountPKR > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Privilege Discount</span>
                    <span className="font-mono">-{formatPrice(cartDiscountPKR)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier Shipping</span>
                  <span className="font-mono text-neutral-200">
                    {shippingCostPKR === 0 ? (
                      <span className="text-emerald-400 font-semibold">FREE</span>
                    ) : (
                      formatPrice(shippingCostPKR)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-neutral-100 pt-2 border-t border-neutral-800">
                  <span>Total Payable</span>
                  <span className="font-mono text-amber-400 text-base">
                    {formatPrice(finalPayablePKR)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs tracking-wider uppercase rounded-md transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  SSL 256-Bit Encrypted
                </span>
                <span>·</span>
                <span>Cash on Delivery Supported</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
