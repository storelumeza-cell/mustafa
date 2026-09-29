import React, { useState } from 'react';
import { SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { FilterSidebar } from './FilterSidebar';

export const ProductGrid: React.FC = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const {
    filteredWatches,
    filterState,
    updateFilter,
    resetFilters,
  } = useStore();

  const sortOptions = [
    { label: 'Featured & Bestsellers', value: 'featured' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Customer Rating', value: 'rating' },
    { label: 'Newest Releases', value: 'newest' },
  ];

  // Active filters for dismiss tags
  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (filterState.collection !== 'All') {
    activeFilters.push({
      key: 'collection',
      label: `Category: ${filterState.collection}`,
      clear: () => updateFilter('collection', 'All'),
    });
  }
  if (filterState.dialColor !== 'All') {
    activeFilters.push({
      key: 'dialColor',
      label: `Dial: ${filterState.dialColor}`,
      clear: () => updateFilter('dialColor', 'All'),
    });
  }
  if (filterState.strapMaterial !== 'All') {
    activeFilters.push({
      key: 'strapMaterial',
      label: `Strap: ${filterState.strapMaterial}`,
      clear: () => updateFilter('strapMaterial', 'All'),
    });
  }
  if (filterState.searchQuery.trim()) {
    activeFilters.push({
      key: 'searchQuery',
      label: `Search: "${filterState.searchQuery}"`,
      clear: () => updateFilter('searchQuery', ''),
    });
  }

  return (
    <section id="collection-section" className="py-12 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title bar with quick Add Product action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
              <span>Mustafa Iqbal Watches</span>
              <span aria-hidden="true">·</span>
              <span>Store Gallery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-100">
              Curated Timepieces
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Displaying {filteredWatches.length} luxury models (Add more via the Admin Portal)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-md hover:bg-neutral-850"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Filters</span>
            </button>

            <div className="relative flex items-center">
              <span className="text-xs text-neutral-400 mr-2 hidden sm:inline">Sort:</span>
              <select
                value={filterState.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as any)}
                className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-md px-3 py-2 pr-7 focus:outline-none focus:border-amber-400 cursor-pointer appearance-none"
                aria-label="Sort products"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 pointer-events-none text-neutral-400 text-[10px]">
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-xs text-neutral-400">Active filters:</span>
            {activeFilters.map((af) => (
              <button
                key={af.key}
                onClick={af.clear}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 rounded transition-colors group cursor-pointer"
              >
                <span>{af.label}</span>
                <X className="w-3 h-3 text-neutral-400 group-hover:text-red-400" />
              </button>
            ))}
            <button
              onClick={resetFilters}
              className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Layout: Sidebar + Grid */}
        <div className="mt-8 flex gap-8 items-start">
          <FilterSidebar
            isOpenOnMobile={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          <div className="flex-1 min-w-0">
            {filteredWatches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredWatches.map((watch) => (
                  <ProductCard key={watch.id} watch={watch} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/30 p-8">
                <Sparkles className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-neutral-200">
                  No timepieces found in this category
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                  Try selecting a different category or resetting your filters.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-md"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
