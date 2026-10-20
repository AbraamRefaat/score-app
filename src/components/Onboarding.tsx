import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import type { SportId } from '../types/index.ts';
import { Check, ChevronRight, ChevronLeft, ArrowRight, Trophy, Users, Activity } from 'lucide-react';
import { ClubBadge, TournamentBadge } from './common/ClubBadge.tsx';
import { MatchPlusLogo } from './common/MatchPlusLogo.tsx';

export const Onboarding: React.FC = () => {
  const {
    sports,
    tournaments,
    teams,
    completeOnboarding,
    preferences: existingPrefs,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Local selection state initialized with reasonable defaults or existing preferences
  const [selectedSports, setSelectedSports] = useState<SportId[]>(
    existingPrefs.selectedSports.length > 0 ? existingPrefs.selectedSports : ['football', 'basketball']
  );
  const [selectedTournaments, setSelectedTournaments] = useState<string[]>(
    existingPrefs.selectedTournaments.length > 0 ? existingPrefs.selectedTournaments : ['egy_pl', 'ucl']
  );
  const [selectedTeams, setSelectedTeams] = useState<string[]>(
    existingPrefs.selectedTeams.length > 0 ? existingPrefs.selectedTeams : ['ahly', 'realmadrid']
  );

  // Filter available tournaments: only tournaments of selected sports
  const availableTournaments = useMemo(() => {
    return tournaments.filter(t => selectedSports.includes(t.sportId));
  }, [tournaments, selectedSports]);

  // Filter available teams: only teams belonging to selected sports and tournaments
  const availableTeams = useMemo(() => {
    return teams.filter(team => {
      if (!selectedSports.includes(team.sportId)) return false;
      if (selectedTournaments.length > 0) {
        return selectedTournaments.includes(team.tournamentId);
      }
      return true;
    });
  }, [teams, selectedSports, selectedTournaments]);

  // Toggle helpers
  const toggleSport = (sportId: SportId) => {
    setSelectedSports(prev => {
      const exists = prev.includes(sportId);
      if (exists) {
        // If removing sport, also clean up tournaments & teams for that sport
        const next = prev.filter(s => s !== sportId);
        return next.length > 0 ? next : ['football']; // keep at least 1 sport
      } else {
        return [...prev, sportId];
      }
    });
  };

  const toggleTournament = (tId: string) => {
    setSelectedTournaments(prev => {
      return prev.includes(tId) ? prev.filter(id => id !== tId) : [...prev, tId];
    });
  };

  const toggleTeam = (tId: string) => {
    setSelectedTeams(prev => {
      return prev.includes(tId) ? prev.filter(id => id !== tId) : [...prev, tId];
    });
  };

  const handleFinish = () => {
    completeOnboarding({
      selectedSports,
      selectedTournaments,
      selectedTeams,
      starredTeamIds: selectedTeams.slice(0, 1),
      starredMatchIds: ['match-ahly-zamalek'],
    });
  };

  const handleSkipStep = () => {
    if (step < 3) {
      setStep((step + 1) as 2 | 3);
    } else {
      handleFinish();
    }
  };

  // Current count for primary button
  const currentCount =
    step === 1 ? selectedSports.length : step === 2 ? selectedTournaments.length : selectedTeams.length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col justify-between max-w-lg mx-auto border-x border-neutral-900 shadow-2xl relative select-none">
      {/* Top Header & Progress */}
      <div className="p-5 border-b border-neutral-900/80 bg-neutral-950/90 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400 tracking-wider">
              تخصيص تجربتك الرياضية
            </span>
          </div>
          <button
            type="button"
            onClick={handleSkipStep}
            className="text-xs text-neutral-400 hover:text-white px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 transition"
            aria-label="تخطي هذه الخطوة"
          >
            تخطي
          </button>
        </div>

        {/* Progress Bar & Step Counter */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-neutral-200">
              الخطوة {step} من 3:{' '}
              {step === 1 ? 'اختر الرياضات' : step === 2 ? 'اختر البطولات' : 'اختر الفرق المفضلة'}
            </span>
            <span className="text-neutral-500 font-mono">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Step Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">ما هي الرياضات التي تتابعها؟</h2>
              <p className="text-xs text-neutral-400 mt-1">
                حدد الرياضات المفضلة لبناء جدول المباريات والنتائج المخصص لك.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {sports.map(sport => {
                const isSelected = selectedSports.includes(sport.id);
                return (
                  <button
                    key={sport.id}
                    type="button"
                    onClick={() => toggleSport(sport.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-right transition-all duration-200 active:scale-[0.98] ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300 hover:border-neutral-700'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{sport.nameAr}</span>
                      <span className="text-[11px] text-neutral-500">{sport.nameEn}</span>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'border-neutral-700 bg-neutral-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">اختر أهم البطولات والدوريات</h2>
              <p className="text-xs text-neutral-400 mt-1">
                تعرض فقط بطولات الرياضات التي اخترتها في الخطوة السابقة.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {availableTournaments.map(tourney => {
                const isSelected = selectedTournaments.includes(tourney.id);
                return (
                  <button
                    key={tourney.id}
                    type="button"
                    onClick={() => toggleTournament(tourney.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-right transition-all duration-200 active:scale-[0.99] ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                        : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300 hover:border-neutral-700'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center border border-neutral-700/80 p-1">
                        <TournamentBadge tournamentId={tourney.id} size="sm" />
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-bold text-sm text-white">{tourney.nameAr}</span>
                        <span className="text-[11px] text-neutral-400">{tourney.countryAr}</span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'border-neutral-700 bg-neutral-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">اختر فرقك ونجومك المفضلين</h2>
              <p className="text-xs text-neutral-400 mt-1">
                ستظهر مباريات هذه الفرق في قسم مخصص بتبويب "نتائجي".
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {availableTeams.map(team => {
                const isSelected = selectedTeams.includes(team.id);
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => toggleTeam(team.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-200 relative active:scale-[0.98] ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300 hover:border-neutral-700'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="absolute top-2.5 left-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-400 text-black'
                            : 'border-neutral-700 bg-neutral-800'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center p-2 mb-2 border border-neutral-700/80 shadow-md">
                      <ClubBadge teamId={team.id} size="lg" />
                    </div>
                    <span className="font-bold text-sm text-white line-clamp-1">{team.nameAr}</span>
                    <span className="text-[11px] text-neutral-400 line-clamp-1">{team.stadiumAr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Actions */}
      <div className="p-5 border-t border-neutral-900 bg-neutral-950/95 backdrop-blur flex items-center gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((step - 1) as 1 | 2)}
            className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-sm transition min-w-[90px]"
            aria-label="الخطوة السابقة"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (step < 3) {
              setStep((step + 1) as 2 | 3);
            } else {
              handleFinish();
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-sm shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition"
          aria-label={step === 3 ? 'ابدأ استخدام تطبيق ماتش+' : 'المتابعة للخطوة التالية'}
        >
          {step === 3 ? (
            <>
              <span>ابدأ استخدام ماتش + ({currentCount})</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </>
          ) : (
            <>
              <span>متابعة ({currentCount})</span>
              <ChevronLeft className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
