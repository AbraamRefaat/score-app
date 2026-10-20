import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import type { SportId, Team, Tournament } from '../../types/index.ts';
import {
  ArrowRight,
  Star,
  Trash2,
  Plus,
  Search,
  Check,
  X,
  SlidersHorizontal,
  Trophy,
  Users,
  Activity,
} from 'lucide-react';
import { ClubBadge, TournamentBadge } from '../common/ClubBadge.tsx';

interface FavoritesPageProps {
  initialTab?: 'all' | 'teams' | 'tournaments' | 'sports';
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ initialTab = 'all' }) => {
  const {
    teams,
    tournaments,
    sports,
    preferences,
    toggleTeamPreference,
    toggleTournamentPreference,
    toggleSportPreference,
    toggleStarTeam,
    closeModal,
    openModal,
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'teams' | 'tournaments' | 'sports'>(initialTab);

  // Bottom Sheet for adding entities
  const [sheetType, setSheetType] = useState<'teams' | 'tournaments' | 'sports' | null>(null);
  const [sheetSearch, setSheetSearch] = useState('');

  // Resolved entities
  const followedTeams = teams.filter(t => preferences.selectedTeams.includes(t.id));
  const starredTeams = teams.filter(t => preferences.starredTeamIds.includes(t.id));
  const followedTournaments = tournaments.filter(t => preferences.selectedTournaments.includes(t.id));
  const followedSports = sports.filter(s => preferences.selectedSports.includes(s.id));

  // Search filtered items in bottom sheet
  const sheetTeams = teams.filter(
    t =>
      t.nameAr.toLowerCase().includes(sheetSearch.toLowerCase()) ||
      t.nameEn.toLowerCase().includes(sheetSearch.toLowerCase())
  );
  const sheetTournaments = tournaments.filter(
    t =>
      t.nameAr.toLowerCase().includes(sheetSearch.toLowerCase()) ||
      t.nameEn.toLowerCase().includes(sheetSearch.toLowerCase())
  );
  const sheetSports = sports.filter(
    s =>
      s.nameAr.toLowerCase().includes(sheetSearch.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(sheetSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-white max-w-lg mx-auto shadow-2xl overflow-hidden select-none animate-in fade-in duration-200">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-neutral-900 bg-neutral-950 sticky top-0 z-20">
        <button
          type="button"
          onClick={closeModal}
          className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-800 transition"
          aria-label="الرجوع إلى الصفحة السابقة"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع</span>
        </button>

        <h1 className="text-sm font-black text-white">إدارة مفضلاتي (تعديل الاختيارات)</h1>

        <div className="w-12"></div>
      </div>

      {/* Filter Tabs with counts */}
      <div className="flex border-b border-neutral-900 bg-neutral-950 px-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'الكل', count: followedTeams.length + followedTournaments.length },
          { id: 'teams', label: 'الفرق', count: followedTeams.length },
          { id: 'tournaments', label: 'البطولات', count: followedTournaments.length },
          { id: 'sports', label: 'الرياضات', count: followedSports.length },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterTab(tab.id as any)}
            className={`py-3 px-4 text-xs font-bold transition relative flex items-center gap-1.5 whitespace-nowrap ${
              filterTab === tab.id ? 'text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                filterTab === tab.id ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-850 text-neutral-500'
              }`}
            >
              {tab.count}
            </span>
            {filterTab === tab.id && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        {/* SECTION 1: STARRED FAVORITES (Top Favorites) */}
        {(filterTab === 'all' || filterTab === 'teams') && starredTeams.length > 0 && (
          <section aria-labelledby="starred-favs-heading">
            <div className="flex items-center gap-2 mb-2.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h2 id="starred-favs-heading" className="text-xs font-black text-neutral-200">
                المفضلة المميزة (أولوية قصوى)
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {starredTeams.map(t => (
                <div
                  key={`star-${t.id}`}
                  className="bg-neutral-900/80 p-3 rounded-2xl border border-amber-500/30 flex items-center justify-between"
                >
                  <div
                    onClick={() => openModal({ type: 'team_profile', teamId: t.id })}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <ClubBadge teamId={t.id} size="sm" />
                    <span className="text-xs font-bold text-white line-clamp-1">{t.nameAr}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleStarTeam(t.id)}
                    className="text-amber-400 p-1 hover:bg-neutral-800 rounded-lg"
                    title="إلغاء التمييز بنجمة"
                  >
                    <Star className="w-4 h-4 fill-amber-400" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: TEAMS I FOLLOW */}
        {(filterTab === 'all' || filterTab === 'teams') && (
          <section aria-labelledby="followed-teams-heading">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h2 id="followed-teams-heading" className="text-xs font-black text-neutral-200">
                  الفرق التي أتابعها ({followedTeams.length})
                </h2>
              </div>
            </div>

            <div className="space-y-2">
              {followedTeams.map(team => {
                const isStarred = preferences.starredTeamIds.includes(team.id);
                return (
                  <div
                    key={`team-fav-${team.id}`}
                    className="bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800 flex items-center justify-between"
                  >
                    <div
                      onClick={() => openModal({ type: 'team_profile', teamId: team.id })}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <ClubBadge teamId={team.id} size="md" />
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-emerald-400">
                          {team.nameAr}
                        </h4>
                        <span className="text-[10px] text-neutral-400">{team.stadiumAr}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Star Button */}
                      <button
                        type="button"
                        onClick={() => toggleStarTeam(team.id)}
                        className={`p-2 rounded-xl transition ${
                          isStarred
                            ? 'text-amber-400 bg-amber-400/15'
                            : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
                        }`}
                        title={isStarred ? 'إزالة التمييز' : 'تمييز كفريق مفضل أول'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400' : ''}`} />
                      </button>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => toggleTeamPreference(team.id)}
                        className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                        title="إلغاء المتابعة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Team Card */}
              <button
                type="button"
                onClick={() => {
                  setSheetType('teams');
                  setSheetSearch('');
                }}
                className="w-full py-3 px-4 rounded-2xl border border-dashed border-neutral-700/80 hover:border-emerald-500 bg-neutral-900/30 hover:bg-emerald-500/5 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-[0.99] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>أضف فريقاً جديداً إلى اختياراتك</span>
              </button>
            </div>
          </section>
        )}

        {/* SECTION 3: TOURNAMENTS */}
        {(filterTab === 'all' || filterTab === 'tournaments') && (
          <section aria-labelledby="followed-tourneys-heading">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h2 id="followed-tourneys-heading" className="text-xs font-black text-neutral-200">
                  البطولات والدوريات المفضلة ({followedTournaments.length})
                </h2>
              </div>
            </div>

            <div className="space-y-2">
              {followedTournaments.map(tourney => (
                <div
                  key={`tourney-fav-${tourney.id}`}
                  className="bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800 flex items-center justify-between"
                >
                  <div
                    onClick={() => openModal({ type: 'tournament_page', tournamentId: tourney.id })}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <TournamentBadge tournamentId={tourney.id} size="sm" />
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-emerald-400">
                        {tourney.nameAr}
                      </h4>
                      <span className="text-[10px] text-neutral-400">{tourney.countryAr}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleTournamentPreference(tourney.id)}
                    className="p-2 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                    title="إلغاء المتابعة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add Tournament Card */}
              <button
                type="button"
                onClick={() => {
                  setSheetType('tournaments');
                  setSheetSearch('');
                }}
                className="w-full py-3 px-4 rounded-2xl border border-dashed border-neutral-700/80 hover:border-emerald-500 bg-neutral-900/30 hover:bg-emerald-500/5 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-[0.99]"
              >
                <Plus className="w-4 h-4" />
                <span>أضف بطولة جديدة إلى اختياراتك</span>
              </button>
            </div>
          </section>
        )}

        {/* SECTION 4: SPORTS */}
        {(filterTab === 'all' || filterTab === 'sports') && (
          <section aria-labelledby="followed-sports-heading">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <h2 id="followed-sports-heading" className="text-xs font-black text-neutral-200">
                  الرياضات المختارة ({followedSports.length})
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {followedSports.map(s => (
                <div
                  key={`sport-fav-${s.id}`}
                  className="bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-white">{s.nameAr}</span>
                  <button
                    type="button"
                    onClick={() => toggleSportPreference(s.id)}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition"
                    title="إزالة الرياضة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setSheetType('sports');
                setSheetSearch('');
              }}
              className="w-full mt-2 py-3 px-4 rounded-2xl border border-dashed border-neutral-700/80 hover:border-emerald-500 bg-neutral-900/30 hover:bg-emerald-500/5 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة رياضة أخرى</span>
            </button>
          </section>
        )}
      </div>

      {/* BOTTOM SHEET FOR ADDING TO CHOICES */}
      {sheetType && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-neutral-900 rounded-t-3xl border-t border-neutral-800 shadow-2xl p-5 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-black text-white">
                {sheetType === 'teams'
                  ? 'إضافة فرق إلى اختياراتك'
                  : sheetType === 'tournaments'
                  ? 'إضافة بطولات إلى اختياراتك'
                  : 'إضافة رياضات إلى اختياراتك'}
              </h3>
              <button
                type="button"
                onClick={() => setSheetType(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input inside Bottom Sheet */}
            <div className="my-3 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={sheetSearch}
                onChange={e => setSheetSearch(e.target.value)}
                placeholder="ابحث بالاسم..."
                className="w-full bg-neutral-950 text-white placeholder-neutral-500 pr-9 pl-4 py-2.5 rounded-xl border border-neutral-800 text-xs focus:outline-none focus:border-emerald-500 text-right"
              />
            </div>

            {/* List with toggles */}
            <div className="flex-1 overflow-y-auto space-y-2 py-2">
              {sheetType === 'teams' &&
                sheetTeams.map(t => {
                  const isSelected = preferences.selectedTeams.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTeamPreference(t.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-right transition ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ClubBadge teamId={t.id} size="sm" />
                        <div>
                          <div className="text-xs font-bold">{t.nameAr}</div>
                          <div className="text-[10px] text-neutral-500">{t.stadiumAr}</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isSelected ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-neutral-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}

              {sheetType === 'tournaments' &&
                sheetTournaments.map(t => {
                  const isSelected = preferences.selectedTournaments.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTournamentPreference(t.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-right transition ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <TournamentBadge tournamentId={t.id} size="sm" />
                        <div>
                          <div className="text-xs font-bold">{t.nameAr}</div>
                          <div className="text-[10px] text-neutral-500">{t.countryAr}</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isSelected ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-neutral-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}

              {sheetType === 'sports' &&
                sheetSports.map(s => {
                  const isSelected = preferences.selectedSports.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSportPreference(s.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-right transition ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                      }`}
                    >
                      <span className="text-xs font-bold">{s.nameAr}</span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isSelected ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-neutral-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
            </div>

            {/* Done button */}
            <button
              type="button"
              onClick={() => setSheetType(null)}
              className="mt-4 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs transition"
            >
              تم وحفظ الاختيارات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
