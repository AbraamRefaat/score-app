import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { filterMyScoresMatches } from '../../utils/sportsLogic.ts';
import { SportsSwitcher } from '../common/SportsSwitcher.tsx';
import { DateStrip } from '../common/DateStrip.tsx';
import { MatchCard } from '../common/MatchCard.tsx';
import { TournamentGroupCard } from '../common/TournamentGroupCard.tsx';
import { SlidersHorizontal, Flame, HeartHandshake, Trophy, AlertCircle } from 'lucide-react';

export const MyScoresTab: React.FC = () => {
  const {
    matches,
    tournaments,
    preferences,
    selectedDate,
    activeSportFilter,
    openModal,
  } = useApp();

  const categorized = filterMyScoresMatches(
    matches,
    tournaments,
    preferences.selectedSports,
    preferences.selectedTournaments,
    preferences.selectedTeams,
    selectedDate,
    activeSportFilter
  );

  const hasAnyMatches = categorized.allMatchesCount > 0;

  return (
    <div className="pb-24 select-none">
      {/* 1. Sports Switcher with only user's selected sports */}
      <SportsSwitcher personalizedOnly={true} />

      {/* 2. Date Strip */}
      <DateStrip />

      <div className="p-4 space-y-5">
        {/* Empty State */}
        {!hasAnyMatches ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-neutral-900/30 border border-neutral-900 rounded-3xl mt-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800/80 flex items-center justify-center text-neutral-400 mb-3 border border-neutral-700/60">
              <AlertCircle className="w-8 h-8 text-emerald-400/80" />
            </div>
            <h3 className="text-base font-extrabold text-white mb-1">
              لا توجد مباريات لفرقك أو بطولاتك في هذا اليوم
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mb-5">
              يمكنك متابعة المزيد من الفرق والبطولات، أو تصفح كافة المباريات في تبويب "جميع النتائج".
            </p>
            <button
              type="button"
              onClick={() => openModal({ type: 'favorites_page' })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>تعديل اختياراتك ومفضلاتك</span>
            </button>
          </div>
        ) : (
          <>
            {/* Live Now Section */}
            {categorized.liveMatches.length > 0 && (
              <section aria-labelledby="live-now-heading">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      <Flame className="w-4 h-4" />
                    </span>
                    <h2 id="live-now-heading" className="text-sm font-black text-white">
                      مباشر الآن من اهتماماتك
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full">
                    {categorized.liveMatches.length} جارية
                  </span>
                </div>
                <div className="space-y-2">
                  {categorized.liveMatches.map(match => (
                    <MatchCard key={`live-${match.id}`} match={match} />
                  ))}
                </div>
              </section>
            )}

            {/* Section: Teams & matches that are mine */}
            {categorized.teamsMatches.length > 0 && (
              <section aria-labelledby="my-teams-heading">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <HeartHandshake className="w-4 h-4" />
                  </span>
                  <h2 id="my-teams-heading" className="text-sm font-black text-white">
                    فرق ومباريات تخصني
                  </h2>
                </div>
                <div className="space-y-3">
                  {categorized.teamsMatches.map(group => (
                    <TournamentGroupCard
                      key={`team-group-${group.tournament.id}`}
                      tournament={group.tournament}
                      matches={group.matches}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Section: Favorite tournaments */}
            {categorized.favoriteTournamentsMatches.length > 0 && (
              <section aria-labelledby="my-tourneys-heading">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Trophy className="w-4 h-4" />
                  </span>
                  <h2 id="my-tourneys-heading" className="text-sm font-black text-white">
                    بطولاتي المفضلة
                  </h2>
                </div>
                <div className="space-y-3">
                  {categorized.favoriteTournamentsMatches.map(group => (
                    <TournamentGroupCard
                      key={`tourney-group-${group.tournament.id}`}
                      tournament={group.tournament}
                      matches={group.matches}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Persistent bottom link: Edit your choices */}
        <div className="pt-4 border-t border-neutral-900 flex justify-center">
          <button
            type="button"
            onClick={() => openModal({ type: 'favorites_page' })}
            className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-emerald-400 bg-neutral-900 hover:bg-neutral-850 px-4 py-2.5 rounded-full border border-neutral-800 transition shadow-sm active:scale-95"
            aria-label="تعديل اختياراتك الرياضية في المفضلة"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            <span>تعديل اختياراتك (الفرق والبطولات)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
