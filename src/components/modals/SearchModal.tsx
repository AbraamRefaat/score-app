import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { searchEntities } from '../../utils/sportsLogic.ts';
import { MatchCard } from '../common/MatchCard.tsx';
import { ClubBadge, TournamentBadge } from '../common/ClubBadge.tsx';
import { Search, X, Trophy, Users, Calendar } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { teams, tournaments, matches, closeModal, openModal } = useApp();
  const [query, setQuery] = useState('');

  const { matchedTeams, matchedTournaments, matchedMatches } = searchEntities(
    query,
    teams,
    tournaments,
    matches
  );

  const hasResults =
    matchedTeams.length > 0 || matchedTournaments.length > 0 || matchedMatches.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-md p-4 pt-10 select-none animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-neutral-950 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        role="dialog"
        aria-label="البحث الشامل في تطبيق ماتش+"
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-neutral-800 flex items-center gap-3 bg-neutral-900/90">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن فريق، بطولة، أو مباراة (مثال: الأهلي، ريال مدريد، الدوري الإنجليزي)..."
            className="flex-1 bg-transparent text-white placeholder-neutral-500 text-sm focus:outline-none text-right font-medium"
          />
          <button
            type="button"
            onClick={closeModal}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-neutral-800"
            aria-label="إغلاق البحث"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-right">
          {!query.trim() ? (
            <div className="text-center py-12 text-neutral-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
              <p className="text-xs">اكتب اسم الفريق أو البطولة للبحث الفوري</p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['الأهلي', 'الزمالك', 'ريال مدريد', 'ليفربول', 'NBA'].map(keyword => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => setQuery(keyword)}
                    className="text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full border border-neutral-800"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              لم نعثر على نتائج مطابقة لـ "{query}".
            </div>
          ) : (
            <>
              {/* Teams Results */}
              {matchedTeams.length > 0 && (
                <section>
                  <h3 className="text-xs font-black text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>الفرق ({matchedTeams.length})</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {matchedTeams.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          closeModal();
                          openModal({ type: 'team_profile', teamId: t.id });
                        }}
                        className="p-3 bg-neutral-900/60 hover:bg-neutral-850 rounded-2xl border border-neutral-800 cursor-pointer flex items-center gap-2.5 transition"
                      >
                        <ClubBadge teamId={t.id} size="sm" />
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{t.nameAr}</h4>
                          <span className="text-[10px] text-neutral-400">{t.stadiumAr}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tournaments Results */}
              {matchedTournaments.length > 0 && (
                <section>
                  <h3 className="text-xs font-black text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>البطولات ({matchedTournaments.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {matchedTournaments.map(tourney => (
                      <div
                        key={tourney.id}
                        onClick={() => {
                          closeModal();
                          openModal({ type: 'tournament_page', tournamentId: tourney.id });
                        }}
                        className="p-3 bg-neutral-900/60 hover:bg-neutral-850 rounded-2xl border border-neutral-800 cursor-pointer flex items-center justify-between transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <TournamentBadge tournamentId={tourney.id} size="sm" />
                          <div>
                            <h4 className="text-xs font-bold text-white">{tourney.nameAr}</h4>
                            <span className="text-[10px] text-neutral-400">{tourney.countryAr}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Matches Results */}
              {matchedMatches.length > 0 && (
                <section>
                  <h3 className="text-xs font-black text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>المباريات ({matchedMatches.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {matchedMatches.map(m => (
                      <MatchCard key={m.id} match={m} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
