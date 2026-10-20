import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { MatchCard } from '../common/MatchCard.tsx';
import { X, Trophy, Heart, Newspaper, Calendar } from 'lucide-react';

interface TournamentModalProps {
  tournamentId: string;
}

export const TournamentModal: React.FC<TournamentModalProps> = ({ tournamentId }) => {
  const {
    tournaments,
    matches,
    teams,
    news,
    standings,
    preferences,
    toggleTournamentPreference,
    closeModal,
    openModal,
  } = useApp();

  const tournament = tournaments.find(t => t.id === tournamentId) || tournaments[0];
  const isFollowed = preferences.selectedTournaments.includes(tournament.id);

  const [activeTab, setActiveTab] = useState<'standings' | 'matches' | 'news'>('standings');

  // Matches for this tournament
  const tournamentMatches = matches.filter(m => m.tournamentId === tournament.id);

  // Standings table
  const tournamentStandings = standings[tournament.id] || standings['egy_pl'] || [];

  // Related news
  const tournamentNews = news.filter(n => n.tournamentId === tournament.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-neutral-950 rounded-t-3xl sm:rounded-3xl border border-neutral-800 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden"
        role="dialog"
        aria-label={`صفحة بطولة ${tournament.nameAr}`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-900 bg-neutral-950/95 sticky top-0 z-20">
          <button
            type="button"
            onClick={closeModal}
            className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 transition"
            aria-label="إغلاق صفحة البطولة"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-neutral-300">صفحة البطولة</span>
          <div className="w-8"></div>
        </div>

        {/* Hero Card */}
        <div className="p-5 bg-gradient-to-b from-neutral-900 to-neutral-950 border-b border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center text-3xl border border-neutral-700 shadow-xl">
              {tournament.logo}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{tournament.nameAr}</h2>
              <span className="text-xs text-neutral-400">{tournament.countryAr}</span>
              <p className="text-[11px] text-emerald-400 font-mono mt-0.5">موسم 2026/2027</p>
            </div>
          </div>

          {/* Follow Toggle */}
          <button
            type="button"
            onClick={() => toggleTournamentPreference(tournament.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow-md ${
              isFollowed
                ? 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-rose-500/10 hover:text-rose-400'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'
            }`}
            aria-label={isFollowed ? `إلغاء متابعة ${tournament.nameAr}` : `متابعة ${tournament.nameAr}`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current' : ''}`} />
            <span>{isFollowed ? 'مُتابع' : 'متابعة'}</span>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-neutral-900 bg-neutral-950 px-2">
          {[
            { id: 'standings', label: 'جدول الترتيب' },
            { id: 'matches', label: 'المباريات والنتائج' },
            { id: 'news', label: 'أخبار البطولة' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-xs font-bold transition-all relative ${
                activeTab === tab.id ? 'text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-400 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. STANDINGS TABLE */}
          {activeTab === 'standings' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/40">
                <table className="w-full text-right text-xs">
                  <thead className="bg-neutral-900/90 text-[10px] text-neutral-400 font-mono border-b border-neutral-800">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">الفريق</th>
                      <th className="py-2.5 px-2 text-center">لعب</th>
                      <th className="py-2.5 px-2 text-center">ف</th>
                      <th className="py-2.5 px-2 text-center">ت</th>
                      <th className="py-2.5 px-2 text-center">خ</th>
                      <th className="py-2.5 px-2 text-center">الفارق</th>
                      <th className="py-2.5 px-3 text-center font-bold text-white">النقاط</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 font-mono text-[11px]">
                    {tournamentStandings.map(row => {
                      const t = teams.find(team => team.id === row.teamId) || {
                        nameAr: row.teamId,
                        logo: '⚽',
                      };
                      const isChampionZone = row.rank <= 2;

                      return (
                        <tr
                          key={row.teamId}
                          onClick={() => {
                            closeModal();
                            openModal({ type: 'team_profile', teamId: row.teamId });
                          }}
                          className="hover:bg-neutral-850 cursor-pointer transition"
                        >
                          <td className="py-3 px-3">
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center font-black ${
                                isChampionZone
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'text-neutral-500'
                              }`}
                            >
                              {row.rank}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-sans font-bold text-neutral-100 flex items-center gap-2">
                            <span>{t.logo}</span>
                            <span className="truncate max-w-[110px]">{t.nameAr}</span>
                          </td>
                          <td className="py-3 px-2 text-center text-neutral-400">{row.played}</td>
                          <td className="py-3 px-2 text-center text-emerald-400">{row.won}</td>
                          <td className="py-3 px-2 text-center text-neutral-400">{row.drawn}</td>
                          <td className="py-3 px-2 text-center text-rose-400">{row.lost}</td>
                          <td className="py-3 px-2 text-center text-neutral-300">
                            {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                          </td>
                          <td className="py-3 px-3 text-center font-black text-white text-xs bg-neutral-900/60">
                            {row.points}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-[10px] text-neutral-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500"></span>
                  <span>المراكز المؤهلة لدوري أبطال أفريقيا / أوروبا</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. MATCHES */}
          {activeTab === 'matches' && (
            <div className="space-y-3">
              <h3 className="text-xs font-black text-white mb-1">مباريات البطولة</h3>
              {tournamentMatches.length > 0 ? (
                tournamentMatches.map(m => <MatchCard key={m.id} match={m} />)
              ) : (
                <p className="text-xs text-neutral-500 py-6 text-center">لا توجد مباريات أخرى لهذه البطولة حالياً.</p>
              )}
            </div>
          )}

          {/* 3. NEWS */}
          {activeTab === 'news' && (
            <div className="space-y-3">
              {tournamentNews.length > 0 ? (
                tournamentNews.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      closeModal();
                      openModal({ type: 'news_detail', newsId: item.id });
                    }}
                    className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 cursor-pointer flex gap-3 transition"
                  >
                    <img
                      src={item.image}
                      alt={item.titleAr}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-neutral-800"
                    />
                    <div className="flex flex-col justify-between text-right">
                      <span className="text-xs font-bold text-neutral-100 line-clamp-2">
                        {item.titleAr}
                      </span>
                      <span className="text-[10px] text-neutral-500">{item.publishedAtAr}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-500 py-6 text-center">لا توجد أخبار مخصصة لهذه البطولة.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
