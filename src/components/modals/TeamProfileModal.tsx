import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { MatchCard } from '../common/MatchCard.tsx';
import { ClubBadge } from '../common/ClubBadge.tsx';
import { X, Star, Heart, Trophy, MapPin, Calendar, Users, Newspaper } from 'lucide-react';

interface TeamProfileModalProps {
  teamId: string;
}

export const TeamProfileModal: React.FC<TeamProfileModalProps> = ({ teamId }) => {
  const {
    teams,
    tournaments,
    matches,
    news,
    preferences,
    toggleTeamPreference,
    toggleStarTeam,
    closeModal,
    openModal,
  } = useApp();

  const team = teams.find(t => t.id === teamId) || teams[0];
  const tournament = tournaments.find(t => t.id === team.tournamentId);

  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'squad' | 'news'>('overview');

  const isFollowed = preferences.selectedTeams.includes(team.id);
  const isStarred = preferences.starredTeamIds.includes(team.id);

  // Matches for this team
  const teamMatches = matches.filter(m => m.homeTeamId === team.id || m.awayTeamId === team.id);
  const nextMatch = teamMatches.find(m => m.status === 'SCHEDULED' || m.status === 'LIVE');
  const pastMatches = teamMatches.filter(m => m.status === 'FINISHED');

  // Related news
  const teamNews = news.filter(n => n.teamIds.includes(team.id));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#0d111b] rounded-t-3xl sm:rounded-3xl border border-neutral-800 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden"
        role="dialog"
        aria-label={`الملف التعريفي لنادي ${team.nameAr}`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-900 bg-[#0d111b]/95 sticky top-0 z-20">
          <button
            type="button"
            onClick={closeModal}
            className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 transition"
            aria-label="إغلاق الملف التعريفي"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-neutral-300">ملف النادي</span>
          <button
            type="button"
            onClick={() => toggleStarTeam(team.id)}
            className={`p-2 rounded-xl transition ${
              isStarred
                ? 'text-amber-400 bg-amber-400/15'
                : 'text-neutral-400 hover:text-white bg-neutral-900'
            }`}
            aria-label={isStarred ? 'إزالة من الفرق المميزة' : 'تمييز الفريق بنجمة'}
          >
            <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Hero Card */}
        <div className="p-5 bg-gradient-to-b from-[#161c2c] to-[#0d111b] border-b border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900/90 flex items-center justify-center p-2 border border-neutral-700 shadow-xl">
              <ClubBadge teamId={team.id} size="xl" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{team.nameAr}</h2>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                <MapPin className="w-3 h-3 text-neutral-500" />
                <span>{team.stadiumAr}</span>
              </div>
              {tournament && (
                <div
                  onClick={() => {
                    closeModal();
                    openModal({ type: 'tournament_page', tournamentId: tournament.id });
                  }}
                  className="text-[11px] text-emerald-400 cursor-pointer hover:underline mt-0.5"
                >
                  {tournament.nameAr}
                </div>
              )}
            </div>
          </div>

          {/* Follow Toggle Button */}
          <button
            type="button"
            onClick={() => toggleTeamPreference(team.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow-md ${
              isFollowed
                ? 'bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'
            }`}
            aria-label={isFollowed ? `إلغاء متابعة ${team.nameAr}` : `متابعة ${team.nameAr}`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current' : ''}`} />
            <span>{isFollowed ? 'مُتابع' : 'متابعة'}</span>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-neutral-900 bg-neutral-950 px-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'نظرة عامة' },
            { id: 'matches', label: 'المباريات والنتائج' },
            { id: 'squad', label: 'قائمة اللاعبين' },
            { id: 'news', label: 'أخبار الفريق' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 text-xs font-bold transition-all relative ${
                activeTab === tab.id ? 'text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* League Position Widget */}
              {team.rank && (
                <div className="bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-neutral-200">الترتيب في الدوري</span>
                      <p className="text-[11px] text-neutral-400">{tournament?.nameAr}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-xs text-neutral-400">{team.points} نقطة</span>
                    <span className="text-base font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
                      المركز {team.rank}
                    </span>
                  </div>
                </div>
              )}

              {/* Next / Active Match */}
              {nextMatch && (
                <div>
                  <h3 className="text-xs font-black text-white mb-2">المباراة القادمة / الجارية</h3>
                  <MatchCard match={nextMatch} />
                </div>
              )}

              {/* Recent Results */}
              <div>
                <h3 className="text-xs font-black text-white mb-2">آخر النتائج</h3>
                {pastMatches.length > 0 ? (
                  <div className="space-y-2">
                    {pastMatches.map(m => (
                      <MatchCard key={m.id} match={m} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 py-3 text-center bg-neutral-900/40 rounded-2xl">
                    لا توجد نتائج سابقة مسجلة في هذا الأسبوع.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 2. MATCHES */}
          {activeTab === 'matches' && (
            <div className="space-y-3">
              <h3 className="text-xs font-black text-white mb-1">جدول كافة المباريات</h3>
              {teamMatches.length > 0 ? (
                teamMatches.map(m => <MatchCard key={m.id} match={m} />)
              ) : (
                <p className="text-xs text-neutral-500 py-6 text-center">لا توجد مباريات مسجلة لهذا الفريق.</p>
              )}
            </div>
          )}

          {/* 3. SQUAD */}
          {activeTab === 'squad' && (
            <div className="space-y-4">
              <div className="bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800">
                <h4 className="text-xs font-bold text-emerald-400 mb-2 pb-1 border-b border-neutral-800">
                  حراسة المرمى
                </h4>
                <div className="space-y-1.5 text-xs text-neutral-200">
                  <div className="flex justify-between py-1">
                    <span>محمد الشناوي (1)</span>
                    <span className="text-neutral-500">مصر - أساسي</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>مصطفى شوبير (31)</span>
                    <span className="text-neutral-500">مصر - بديل</span>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800">
                <h4 className="text-xs font-bold text-emerald-400 mb-2 pb-1 border-b border-neutral-800">
                  خط الدفاع
                </h4>
                <div className="space-y-1.5 text-xs text-neutral-200">
                  <div className="flex justify-between py-1">
                    <span>علي معلول (21)</span>
                    <span className="text-neutral-500">ظهير أيسر</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>رامي ربيعة (6)</span>
                    <span className="text-neutral-500">قلب دفاع</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>ياسر إبراهيم (5)</span>
                    <span className="text-neutral-500">قلب دفاع</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>محمد هاني (30)</span>
                    <span className="text-neutral-500">ظهير أيمن</span>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-800">
                <h4 className="text-xs font-bold text-emerald-400 mb-2 pb-1 border-b border-neutral-800">
                  خط الوسط والهجوم
                </h4>
                <div className="space-y-1.5 text-xs text-neutral-200">
                  <div className="flex justify-between py-1">
                    <span>إمام عاشور (22)</span>
                    <span className="text-neutral-500">وسط هجومي</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>مروان عطية (8)</span>
                    <span className="text-neutral-500">ارتكاز</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>وسام أبو علي (9)</span>
                    <span className="text-neutral-500">مهاجم</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>حسين الشحات (14)</span>
                    <span className="text-neutral-500">جناح أيسر</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. NEWS */}
          {activeTab === 'news' && (
            <div className="space-y-3">
              {teamNews.length > 0 ? (
                teamNews.map(item => (
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
                <p className="text-xs text-neutral-500 py-6 text-center">لا توجد أخبار حديثة لهذا الفريق.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
