import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Search } from 'lucide-react';
import { MatchPlusLogo } from './common/MatchPlusLogo.tsx';

export const Header: React.FC = () => {
  const { openModal, matches } = useApp();

  const liveMatchesCount = matches.filter(m => m.status === 'LIVE' || m.status === 'HALFTIME').length;

  return (
    <header className="sticky top-0 z-30 bg-[#0d111b]/95 backdrop-blur-md border-b border-neutral-900/80 px-4 py-3 select-none">
      <div className="flex items-center justify-between">
        {/* Brand Logo & Name - Bespoke Creative Identity */}
        <div className="flex items-center gap-3">
          <MatchPlusLogo size="md" showText={true} />

          {liveMatchesCount > 0 && (
            <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full mr-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-[10px] font-bold text-rose-400 font-mono">
                {liveMatchesCount} مباشر
              </span>
            </div>
          )}
        </div>

        {/* Right Action: Clean Search Trigger (no phone frame, no bell) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openModal({ type: 'search' })}
            className="flex items-center gap-2 bg-neutral-900/90 hover:bg-neutral-850 text-neutral-400 hover:text-white px-3.5 py-1.5 rounded-xl border border-neutral-800 transition text-xs"
            aria-label="البحث عن مباريات وفرق وبطولات"
          >
            <Search className="w-3.5 h-3.5 text-[#7ec815]" />
            <span className="font-medium text-neutral-300">بحث...</span>
          </button>
        </div>
      </div>
    </header>
  );
};
