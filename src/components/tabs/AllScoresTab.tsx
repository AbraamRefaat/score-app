import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { filterAllScoresMatches } from '../../utils/sportsLogic.ts';
import { SportsSwitcher } from '../common/SportsSwitcher.tsx';
import { DateStrip } from '../common/DateStrip.tsx';
import { MatchCard } from '../common/MatchCard.tsx';
import { TournamentGroupCard } from '../common/TournamentGroupCard.tsx';
import { Flame, Globe, AlertCircle } from 'lucide-react';

export const AllScoresTab: React.FC = () => {
  const { matches, tournaments, activeSportFilter, selectedDate } = useApp();

  const { liveMatches, groupedByTournament, totalMatchesCount } = filterAllScoresMatches(
    matches,
    tournaments,
    activeSportFilter,
    selectedDate
  );

  return (
    <div className="pb-24 select-none">
      {/* 1. Global Sports Switcher */}
      <SportsSwitcher personalizedOnly={false} />

      {/* 2. Date Strip */}
      <DateStrip />

      <div className="p-4 space-y-5">
        {totalMatchesCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-neutral-900/30 border border-neutral-900 rounded-3xl mt-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-500 mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">لا توجد مباريات مجدولة لهذا التاريخ</h3>
            <p className="text-xs text-neutral-400">يرجى اختيار يوم آخر من شريط التواريخ أعلاه.</p>
          </div>
        ) : (
          <>
            {/* Live Matches Section */}
            {liveMatches.length > 0 && (
              <section aria-labelledby="all-live-heading">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      <Flame className="w-4 h-4" />
                    </span>
                    <h2 id="all-live-heading" className="text-sm font-black text-white">
                      المباريات المباشرة الآن
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full">
                    {liveMatches.length} مباشر
                  </span>
                </div>
                <div className="space-y-2">
                  {liveMatches.map(m => (
                    <MatchCard key={`all-live-${m.id}`} match={m} />
                  ))}
                </div>
              </section>
            )}

            {/* Tournaments list */}
            <section aria-labelledby="all-tournaments-heading">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Globe className="w-4 h-4" />
                  </span>
                  <h2 id="all-tournaments-heading" className="text-sm font-black text-white">
                    كافة البطولات والدوريات
                  </h2>
                </div>
                <span className="text-xs font-mono text-neutral-400 bg-neutral-900 px-2.5 py-0.5 rounded-full border border-neutral-800">
                  {groupedByTournament.length} بطولة
                </span>
              </div>

              <div className="space-y-3">
                {groupedByTournament.map(group => (
                  <TournamentGroupCard
                    key={`all-group-${group.tournament.id}`}
                    tournament={group.tournament}
                    matches={group.matches}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
