import React, { useState } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    watches,
    formatPrice,
    setSelectedWatch,
    updateFilter,
  } = useStore();

  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const popularQueries = [
    'Chronograph',
    'Emerald Dial',
    'Automatic Skeleton',
    'Sapphire Glass',
    'Submariner Diver',
    'Genuine Leather',
  ];

  const searchResults = query.trim()
    ? watches.filter((w) => {
        const q = query.toLowerCase();
        return (
          w.name.toLowerCase().includes(q) ||
          w.tagline.toLowerCase().includes(q) ||
          w.collection.toLowerCase().includes(q) ||
          w.dialColor.toLowerCase().includes(q) ||
          w.movement.toLowerCase().includes(q)
        );
      })
    : [];

  const handleSelectWatch = (watch: any) => {
    setSelectedWatch(watch);
    setIsSearchOpen(false);
  };

  const handleSelectTag = (tag: string) => {
    updateFilter('searchQuery', tag);
    setIsSearchOpen(false);
    const el = document.getElementById('collection-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div
        className="fixed inset-0"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-neutral-800 bg-neutral-950">
          <Search className="w-5 h-5 text-amber-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search by model, collection, movement, dial color..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-neutral-400 hover:text-white rounded ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {/* Trending Searches */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {popularQueries.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSelectTag(term)}
                  className="px-3 py-1.5 rounded-md bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 hover:text-amber-400 hover:border-amber-400/50 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Results List */}
          {query.trim() && (
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Found {searchResults.length} Matches
              </p>
              {searchResults.length === 0 ? (
                <p className="text-xs text-neutral-400 py-4 text-center">
                  No timepieces match "{query}". Try checking your spelling or search by collection.
                </p>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((w) => (
                    <div
                      key={w.id}
                      onClick={() => handleSelectWatch(w)}
                      className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={w.primaryImage}
                          alt={w.name}
                          className="w-12 h-12 object-contain bg-neutral-900 rounded p-1"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-semibold text-xs text-neutral-100">{w.name}</p>
                          <p className="text-[11px] text-neutral-400">
                            {w.collection} · {w.movement} · {w.dialColor} Dial
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono font-bold text-amber-400">
                          {formatPrice(w.pricePKR)}
                        </p>
                        <span className="text-[10px] text-neutral-400">View Details →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
