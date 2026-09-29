import React from 'react';
import { Search, Heart, ShoppingBag, Shield, Scale, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Currency } from '../types/watch';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlist,
    compareList,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsCompareOpen,
    setIsSearchOpen,
    setIsAdminOpen,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalTab,
    currency,
    setCurrency,
    categories,
    updateFilter,
    resetFilters,
  } = useStore();

  const handleNavClick = (collection: string) => {
    if (collection === 'All') {
      resetFilters();
    } else {
      updateFilter('collection', collection);
    }
    const section = document.getElementById('collection-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            resetFilters();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-lg sm:text-2xl font-bold tracking-[0.25em] text-neutral-100 font-display hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
        >
          MUSTAFA IQBAL
        </a>

        {/* Zone 2: 4-6 clean text navigation links using dynamic categories */}
        <nav className="hidden lg:flex items-center gap-6 text-xs tracking-wider uppercase font-medium text-neutral-300">
          <button
            onClick={() => handleNavClick('All')}
            className="hover:text-amber-400 transition-colors cursor-pointer py-1 border-b border-transparent hover:border-amber-400 whitespace-nowrap"
          >
            All Products
          </button>
          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              onClick={() => handleNavClick(cat)}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1 border-b border-transparent hover:border-amber-400 whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions + User Account & Admin Access */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* User Account / Login & Admin Access */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer shadow"
                  title="Open Store Administrator Portal (Mustafa Iqbal)"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin Portal</span>
                </button>
              ) : null}

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-neutral-200 hover:text-amber-400 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-md transition-colors cursor-pointer"
                title="View My Account & Orders"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">
                  {currentUser.role === 'admin' ? 'Mustafa I.' : currentUser.name.split(' ')[0]}
                </span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:text-amber-400 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-amber-400/50 rounded-md transition-colors cursor-pointer"
              title="Sign In, Create Customer Account or Login as Store Admin"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Account / Sign In</span>
            </button>
          )}

          {/* Currency Switcher */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-md px-2 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer appearance-none pr-5 hover:bg-neutral-850"
              aria-label="Select Currency"
            >
              <option value="PKR">PKR (Rs.)</option>
              <option value="USD">USD ($)</option>
              <option value="AED">AED</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
            </select>
            <span className="absolute right-1.5 top-2 pointer-events-none text-neutral-400 text-[10px]">▼</span>
          </div>

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-neutral-300 hover:text-amber-400 transition-colors rounded-md hover:bg-neutral-900"
            aria-label="Search watches"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist Trigger */}
          {wishlist.length > 0 && (
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-neutral-300 hover:text-amber-400 transition-colors rounded-md hover:bg-neutral-900"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 bg-neutral-800 text-neutral-200 border border-neutral-700 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {wishlist.length}
              </span>
            </button>
          )}

          {/* Shopping Bag Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors cursor-pointer whitespace-nowrap"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono bg-neutral-950 text-amber-400 px-1.5 py-0.5 rounded text-[11px]">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
