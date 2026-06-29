import { Loader2 } from 'lucide-react';

export function AdminTabLoader({ active, label }: { active: boolean; label?: string }) {
  if (!active) return null;
  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#E8D4C0]/60">
      <div className="h-1.5 bg-[#F5E6D8] overflow-hidden relative">
        <div
          className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#D4854A] to-transparent"
          style={{ animation: 'adminTabLoad 1.1s ease-in-out infinite' }}
        />
      </div>
      <div className="px-4 py-2.5 text-sm text-[#635241] flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 text-[#D4854A] animate-spin shrink-0" />
        <span>{label || 'Betöltés…'}</span>
      </div>
      <style>{`
        @keyframes adminTabLoad {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(420%); }
        }
      `}</style>
    </div>
  );
}