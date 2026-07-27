import React, { useEffect } from 'react';
import { Trophy, Sparkles, CheckCircle2 } from 'lucide-react';

interface MilestoneCelebrationProps {
  title: string | null;
  onClose: () => void;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({ title, onClose }) => {
  useEffect(() => {
    if (title) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [title, onClose]);

  if (!title) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 px-5 rounded-2xl border border-amber-400/50 shadow-2xl flex items-center gap-3.5 max-w-sm">
        <div className="p-3 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 shrink-0 animate-bounce">
          <Trophy className="w-6 h-6" />
        </div>

        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Milestone Achieved! 🎉</span>
          </div>
          <p className="font-semibold text-white text-xs line-clamp-2">{title}</p>
          <p className="text-[10px] text-slate-300">Great progress towards your college readiness goals!</p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white font-bold text-xs p-1 ml-auto shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
