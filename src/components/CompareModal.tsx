import React from 'react';
import { X, Scale, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CompareModal: React.FC = () => {
  const {
    isCompareOpen,
    setIsCompareOpen,
    compareList,
    removeFromCompare,
    watches,
    formatPrice,
    addToCart,
    setSelectedWatch,
  } = useStore();

  if (!isCompareOpen) return null;

  const comparedWatches = watches.filter((w) => compareList.includes(w.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8">
      <div
        className="fixed inset-0"
        onClick={() => setIsCompareOpen(false)}
      />

      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-bold text-sm tracking-wider uppercase text-neutral-100">
              Compare Timepiece Specifications ({comparedWatches.length}/3)
            </h2>
          </div>
          <button
            onClick={() => setIsCompareOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {comparedWatches.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Scale className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-sm font-semibold text-neutral-300">
                No timepieces selected for comparison
              </p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Click the compare icon on any watch card to evaluate side-by-side technical parameters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="p-3 w-40 text-neutral-400 uppercase tracking-wider font-semibold">
                      Specification
                    </th>
                    {comparedWatches.map((w) => (
                      <th key={w.id} className="p-3 min-w-[200px] text-neutral-100 align-top">
                        <div className="space-y-3">
                          <div className="relative aspect-square bg-neutral-950 rounded-lg p-2 border border-neutral-800 flex items-center justify-center">
                            <img
                              src={w.primaryImage}
                              alt={w.name}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                            <button
                              onClick={() => removeFromCompare(w.id)}
                              className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-red-400 bg-neutral-900 rounded"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div>
                            <p className="font-semibold text-sm line-clamp-1">{w.name}</p>
                            <p className="text-amber-400 font-mono text-sm mt-0.5">
                              {formatPrice(w.pricePKR)}
                            </p>
                          </div>
                          <button
                            onClick={() => addToCart(w)}
                            className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Collection</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3">{w.collection}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Movement</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3 font-semibold text-neutral-100">{w.movement}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Case Diameter</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3">{w.caseDiameter}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Case Thickness</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3">{w.caseThickness}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Crystal Glass</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3 font-semibold text-neutral-100">{w.glassType}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Water Resistance</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3">{w.waterResistance}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Strap Material</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3">{w.strapMaterial}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Weight</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3">{w.weight}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-neutral-400">Warranty</td>
                    {comparedWatches.map((w) => (
                      <td key={w.id} className="p-3 text-emerald-400 font-medium">
                        {w.warrantyYears} Year Official International
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
