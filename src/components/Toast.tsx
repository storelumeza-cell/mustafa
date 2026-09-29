import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-neutral-900/95 backdrop-blur-md border border-neutral-700 shadow-2xl text-xs text-neutral-100 max-w-sm">
        {toast.type === 'success' && (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        {toast.type === 'error' && (
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
        )}
        {toast.type === 'info' && (
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
        )}
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
