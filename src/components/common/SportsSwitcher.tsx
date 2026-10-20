import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import type { SportId } from '../../types/index.ts';

interface SportsSwitcherProps {
  personalizedOnly?: boolean;
}

export const SportsSwitcher: React.FC<SportsSwitcherProps> = ({ personalizedOnly = false }) => {
  const { sports, preferences, activeSportFilter, setActiveSportFilter } = useApp();

  const displayedSports = personalizedOnly
    ? sports.filter(s => preferences.selectedSports.includes(s.id))
    : sports;

  return (
    <div className="py-2 px-4 bg-neutral-950/60 border-b border-neutral-900/40 overflow-x-auto no-scrollbar select-none">
      <div className="flex items-center gap-1.5 min-w-max">
        {/* All Sports Chip */}
        <button
          type="button"
          onClick={() => setActiveSportFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 font-bold border ${
            activeSportFilter === 'all'
              ? 'bg-neutral-100 text-neutral-950 border-neutral-100 shadow-md'
              : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border-neutral-800'
          }`}
          aria-pressed={activeSportFilter === 'all'}
        >
          الكل
        </button>

        {/* Dynamic Sports Chips */}
        {displayedSports.map(s => {
          const isSelected = activeSportFilter === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSportFilter(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-200 font-bold border ${
                isSelected
                  ? 'bg-neutral-100 text-neutral-950 border-neutral-100 shadow-md'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border-neutral-800'
              }`}
              aria-pressed={isSelected}
            >
              <span>{s.nameAr}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
