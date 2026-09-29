import React from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FilterSidebarProps {
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  const { filterState, updateFilter, resetFilters, formatPrice, categories } = useStore();

  const dialColors = [
    { label: 'All', value: 'All', hex: '' },
    { label: 'Emerald Green', value: 'Emerald', hex: '#0f5132' },
    { label: 'Midnight Blue', value: 'Blue', hex: '#1e3a8a' },
    { label: 'Obsidian Black', value: 'Black', hex: '#171717' },
    { label: 'Champagne Gold', value: 'Gold', hex: '#d97706' },
    { label: 'Silver Pearl', value: 'Silver', hex: '#9ca3af' },
  ];

  const strapMaterials = [
    { label: 'All Straps', value: 'All' },
    { label: '316L Stainless Steel', value: 'Stainless Steel' },
    { label: 'Genuine Leather', value: 'Genuine Leather' },
    { label: 'High-Tech Ceramic', value: 'Ceramic' },
    { label: 'Milanese Mesh', value: 'Mesh' },
  ];

  const content = (
    <div className="space-y-7">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-200">
          Filter Timepieces
        </h3>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-amber-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Dynamic Categories */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => updateFilter('collection', 'All')}
            className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between ${
              filterState.collection === 'All'
                ? 'bg-neutral-800 text-amber-400 font-semibold'
                : 'text-neutral-300 hover:bg-neutral-900 hover:text-neutral-100'
            }`}
          >
            <span>All Categories</span>
            {filterState.collection === 'All' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
          </button>
          {categories.map((cat) => {
            const active = filterState.collection === cat;
            return (
              <button
                key={cat}
                onClick={() => updateFilter('collection', cat)}
                className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between ${
                  active
                    ? 'bg-neutral-800 text-amber-400 font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-900 hover:text-neutral-100'
                }`}
              >
                <span>{cat}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dial Color Swatches */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Dial Color
          </label>
          <span className="text-xs text-neutral-400">{filterState.dialColor}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {dialColors.map((color) => {
            const active = filterState.dialColor === color.value;
            if (color.value === 'All') {
              return (
                <button
                  key={color.value}
                  onClick={() => updateFilter('dialColor', 'All')}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    active
                      ? 'border-amber-400 text-amber-400 bg-amber-400/10 font-medium'
                      : 'border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  All
                </button>
              );
            }
            return (
              <button
                key={color.value}
                onClick={() => updateFilter('dialColor', color.value)}
                title={color.label}
                aria-label={`Filter by ${color.label}`}
                className={`relative w-7 h-7 rounded-full border transition-all flex items-center justify-center ${
                  active
                    ? 'ring-2 ring-amber-400 scale-110 border-white'
                    : 'border-neutral-700 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {active && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Max Price
          </label>
          <span className="text-xs font-mono font-medium text-amber-400">
            {formatPrice(filterState.priceRange[1])}
          </span>
        </div>
        <input
          type="range"
          min={10000}
          max={40000}
          step={1000}
          value={filterState.priceRange[1]}
          onChange={(e) =>
            updateFilter('priceRange', [
              filterState.priceRange[0],
              Number(e.target.value),
            ])
          }
          className="w-full accent-amber-400 bg-neutral-800 h-1.5 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
          <span>{formatPrice(10000)}</span>
          <span>{formatPrice(40000)}</span>
        </div>
      </div>

      {/* Strap Material */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          Strap Material
        </label>
        <div className="space-y-1">
          {strapMaterials.map((strap) => {
            const active = filterState.strapMaterial === strap.value;
            return (
              <button
                key={strap.value}
                onClick={() => updateFilter('strapMaterial', strap.value)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                  active
                    ? 'bg-neutral-800 text-amber-400 font-medium'
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span>{strap.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64 shrink-0 pr-6 border-r border-neutral-800/80">
        {content}
      </div>

      {isOpenOnMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-xs bg-neutral-950 border-l border-neutral-800 h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
                <span className="font-display font-semibold tracking-wider text-sm text-neutral-100">
                  Filters
                </span>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-900"
                >
                  ✕
                </button>
              </div>
              {content}
            </div>
            <button
              onClick={onCloseMobile}
              className="mt-6 w-full py-3 bg-amber-400 text-neutral-950 font-semibold text-xs tracking-wider uppercase rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
};
