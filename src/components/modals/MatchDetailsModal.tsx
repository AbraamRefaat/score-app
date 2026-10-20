import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ClubBadge, TournamentBadge } from '../common/ClubBadge.tsx';
import { TacticalPitchView } from '../lineups/TacticalPitchView.tsx';
import {
  X,
  Star,
  Bell,
  Clock,
  MapPin,
  Shield,
  Activity,
  Flame,
  BarChart3,
  Users,
  Compass,
  AlertTriangle,
  Radio,
  CheckCircle2,
} from 'lucide-react';

interface MatchDetailsModalProps {
  matchId: string;
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({ matchId }) => {
  const {
    matches,
    teams,
    tournaments,
    closeModal,
    openModal,
    preferences,
    toggleStarMatch,
    notificationSettings,
    toggleMatchNotification,
  } = useApp();

  const match = matches.find(m => m.id === matchId) || matches[0];
  const homeTeam = teams.find(t => t.id === match.homeTeamId) || {
    id: match.homeTeamId,
    nameAr: match.homeTeamId,
    logo: '⚽',
  };
  const awayTeam = teams.find(t => t.id === match.awayTeamId) || {
    id: match.awayTeamId,
    nameAr: match.awayTeamId,
    logo: '⚽',
  };
  const tournament = tournaments.find(t => t.id === match.tournamentId) || {
    id: match.tournamentId,
    nameAr: 'بطولة كروية',
    logo: '🏆',
  };

  const [activeTab, setActiveTab] = useState<'events' | 'stats' | 'lineups' | 'insights' | 'tracker'>('events');
  const [showHeatmap, setShowHeatmap] = useState(false);

  const isStarred = preferences.starredMatchIds.includes(match.id);
  const isNotifEnabled = !!notificationSettings.matchSpecific[match.id];
  const isLive = match.status === 'LIVE' || match.status === 'HALFTIME';

  // Stats comparison bar helper
  const renderStatBar = (label: string, homeVal: number, awayVal: number, isPercent = false) => {
    const total = homeVal + awayVal || 1;
    const homePct = Math.round((homeVal / total) * 100);
    const awayPct = 100 - homePct;

    return (
      <div className="space-y-1.5 py-2 border-b border-neutral-900/60 last:border-0">
        <div className="flex justify-between items-center text-xs">
          <span className="font-mono font-bold text-neutral-200">
            {isPercent ? `${homeVal}%` : homeVal}
          </span>
          <span className="text-neutral-400 font-medium text-[11px]">{label}</span>
          <span className="font-mono font-bold text-neutral-200">
            {isPercent ? `${awayVal}%` : awayVal}
          </span>
        </div>
        <div className="h-2 w-full bg-neutral-800 rounded-full flex overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 rounded-r-full"
            style={{ width: `${homePct}%` }}
          ></div>
          <div
            className="h-full bg-teal-400 transition-all duration-500 rounded-l-full"
            style={{ width: `${awayPct}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#0d111b] rounded-t-3xl sm:rounded-3xl border border-neutral-800 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden"
        role="dialog"
        aria-label={`تفاصيل مباراة ${homeTeam.nameAr} و ${awayTeam.nameAr}`}
      >
        {/* Top Bar with actions */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-900 bg-[#0d111b]/95 sticky top-0 z-20">
          <button
            type="button"
            onClick={closeModal}
            className="p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 hover:bg-neutral-800 transition"
            aria-label="إغلاق تفاصيل المباراة"
          >
            <X className="w-4 h-4" />
          </button>

          <div
            onClick={() => {
              closeModal();
              openModal({ type: 'tournament_page', tournamentId: tournament.id });
            }}
            className="flex items-center gap-2 cursor-pointer hover:text-[#7ec815] transition"
          >
            <TournamentBadge tournamentId={tournament.id} size="sm" />
            <span className="text-xs font-bold text-neutral-300">{tournament.nameAr}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => toggleMatchNotification(match.id)}
              className={`p-2 rounded-xl transition ${
                isNotifEnabled
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-neutral-400 hover:text-white bg-neutral-900'
              }`}
              aria-label={isNotifEnabled ? 'تعطيل إشعارات المباراة' : 'تفعيل إشعارات المباراة'}
            >
              <Bell className={`w-4 h-4 ${isNotifEnabled ? 'fill-emerald-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => toggleStarMatch(match.id)}
              className={`p-2 rounded-xl transition ${
                isStarred
                  ? 'text-amber-400 bg-amber-400/15'
                  : 'text-neutral-400 hover:text-white bg-neutral-900'
              }`}
              aria-label={isStarred ? 'إزالة من المفضلة' : 'تثبيت في المفضلة'}
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hero Scoreboard Header */}
        <div className="bg-gradient-to-b from-[#161c2c] to-[#0d111b] p-5 border-b border-neutral-900">
          <div className="flex items-center justify-around">
            {/* Home Team */}
            <div
              onClick={() => {
                closeModal();
                openModal({ type: 'team_profile', teamId: homeTeam.id });
              }}
              className="flex flex-col items-center text-center cursor-pointer group flex-1"
            >
              <div className="w-16 h-16 rounded-2xl bg-neutral-900/90 flex items-center justify-center p-2 mb-2 border border-neutral-700/60 shadow-xl group-hover:scale-105 transition">
                <ClubBadge teamId={homeTeam.id} size="xl" />
              </div>
              <h3 className="font-black text-sm text-neutral-100 group-hover:text-[#7ec815]">
                {homeTeam.nameAr}
              </h3>
            </div>

            {/* Score / Status Center */}
            <div className="flex flex-col items-center px-4">
              {isLive ? (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold mb-2 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span>{match.minute}' مباشر</span>
                  </div>
                  <div className="text-3xl font-black font-mono tracking-wider text-white">
                    {match.homeScore} : {match.awayScore}
                  </div>
                </>
              ) : match.status === 'FINISHED' ? (
                <>
                  <span className="text-[11px] font-bold text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full mb-2">
                    انتهت المباراة
                  </span>
                  <div className="text-3xl font-black font-mono tracking-wider text-white">
                    {match.homeScore} : {match.awayScore}
                  </div>
                </>
              ) : (
                <>
                  <span className="text-[11px] font-bold text-[#7ec815] bg-[#7ec815]/10 px-3 py-1 rounded-full border border-[#7ec815]/20 mb-2">
                    لم تبدأ بعد
                  </span>
                  <div className="text-2xl font-black font-mono tracking-wider text-white">
                    {match.startTime}
                  </div>
                </>
              )}

              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-2">
                <MapPin className="w-3 h-3 text-neutral-500" />
                <span className="line-clamp-1">{match.venueAr}</span>
              </div>
            </div>

            {/* Away Team */}
            <div
              onClick={() => {
                closeModal();
                openModal({ type: 'team_profile', teamId: awayTeam.id });
              }}
              className="flex flex-col items-center text-center cursor-pointer group flex-1"
            >
              <div className="w-16 h-16 rounded-2xl bg-neutral-900/90 flex items-center justify-center p-2 mb-2 border border-neutral-700/60 shadow-xl group-hover:scale-105 transition">
                <ClubBadge teamId={awayTeam.id} size="xl" />
              </div>
              <h3 className="font-black text-sm text-neutral-100 group-hover:text-[#7ec815]">
                {awayTeam.nameAr}
              </h3>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-900 bg-neutral-950 px-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'events', label: 'الأحداث' },
            { id: 'stats', label: 'الإحصائيات' },
            { id: 'lineups', label: 'التشكيلة' },
            { id: 'insights', label: 'رؤى ما قبل اللقاء' },
            { id: 'tracker', label: 'المتابعة الحية' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 text-xs font-bold transition-all relative whitespace-nowrap ${
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

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              {match.events.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  لا توجد أحداث مسجلة بعد لهذه المباراة.
                </div>
              ) : (
                <div className="relative border-r-2 border-neutral-800 pr-5 space-y-4 mr-2">
                  {match.events.map(ev => {
                    const isGoal = ev.type === 'goal';
                    const isCard = ev.type === 'yellow_card' || ev.type === 'red_card';
                    const isVar = ev.type === 'var';
                    const isSub = ev.type === 'sub';

                    return (
                      <div key={ev.id} className="relative">
                        {/* Minute node on timeline */}
                        <div
                          className={`absolute -right-[27px] top-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border ${
                            isGoal
                              ? 'bg-emerald-500 text-black border-emerald-400'
                              : isCard
                              ? 'bg-amber-500 text-black border-amber-400'
                              : isVar
                              ? 'bg-purple-600 text-white border-purple-400'
                              : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                          }`}
                        >
                          {ev.minute}'
                        </div>

                        {/* Event Details Card */}
                        <div className="bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800/80">
                          <div className="flex items-center gap-2 mb-1">
                            {isGoal && <span className="text-base">⚽</span>}
                            {ev.type === 'yellow_card' && <span className="w-2.5 h-3.5 bg-amber-400 rounded-sm"></span>}
                            {ev.type === 'red_card' && <span className="w-2.5 h-3.5 bg-rose-600 rounded-sm"></span>}
                            {isVar && <span className="text-xs bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-mono font-bold">VAR</span>}
                            {isSub && <span className="text-emerald-400 text-xs font-bold">⇄ تبديل</span>}

                            <span className="font-bold text-sm text-neutral-100">{ev.playerAr}</span>
                            {ev.assistAr && (
                              <span className="text-[11px] text-neutral-400">
                                (صناعة: {ev.assistAr})
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400">{ev.detailAr}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. STATS TAB */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              {/* Heatmap Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900/70 border border-neutral-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-neutral-200">الخريطة الحرارية المتقدمة (Heatmap)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                    showHeatmap
                      ? 'bg-emerald-500 text-black'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {showHeatmap ? 'إخفاء' : 'عرض'}
                </button>
              </div>

              {showHeatmap && (
                <div className="relative h-44 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 overflow-hidden flex flex-col justify-between p-3">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(16,185,129,0.4),transparent_60%)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(244,63,94,0.35),transparent_60%)]"></div>
                  {/* Pitch markings */}
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-emerald-500/20 -translate-y-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-20 h-20 border border-emerald-500/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="relative z-10 flex justify-between text-[11px] font-bold text-neutral-300">
                    <span>كثافة هجوم {homeTeam.nameAr}</span>
                    <span>كثافة هجوم {awayTeam.nameAr}</span>
                  </div>
                  <div className="relative z-10 text-center text-[10px] text-emerald-300 font-mono">
                    مناطق الضغط العالي والتحركات في الثلث الهجومي
                  </div>
                </div>
              )}

              {/* Stats Bars */}
              <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800/80 space-y-1">
                {renderStatBar('الاستحواذ %', match.stats.possession[0], match.stats.possession[1], true)}
                {renderStatBar('الأهداف المتوقعة (xG)', match.stats.xG[0], match.stats.xG[1])}
                {renderStatBar('إجمالي التسديدات', match.stats.shots[0], match.stats.shots[1])}
                {renderStatBar('تسديدات على المرمى', match.stats.shotsOnTarget[0], match.stats.shotsOnTarget[1])}
                {renderStatBar('هجمات خطيرة', match.stats.dangerousAttacks[0], match.stats.dangerousAttacks[1])}
                {renderStatBar('الضربات الركنية', match.stats.corners[0], match.stats.corners[1])}
                {renderStatBar('الأخطاء المرتكبة', match.stats.fouls[0], match.stats.fouls[1])}
                {renderStatBar('حالات التسلل', match.stats.offsides[0], match.stats.offsides[1])}
                {renderStatBar('البطاقات الصفراء', match.stats.yellowCards[0], match.stats.yellowCards[1])}
              </div>
            </div>
          )}

          {/* 3. LINEUPS TAB (365SCORES STYLE WITH TEAM SWITCHER & PERSPECTIVE PITCH) */}
          {activeTab === 'lineups' && (
            <TacticalPitchView
              match={match}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
            />
          )}

          {/* 4. PRE-MATCH INSIGHTS TAB */}
          {activeTab === 'insights' && (
            <div className="space-y-4">
              {/* Prediction Card with disclaimer */}
              <div className="bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>توقعات نسب الفوز الذكية</span>
                  </h4>
                  <span className="text-[10px] text-neutral-500 font-mono">خوارزمية Match+</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-neutral-200">
                    <span>فوز {homeTeam.nameAr}: {match.insights.prediction.homeWinPct}%</span>
                    <span>تعادل: {match.insights.prediction.drawPct}%</span>
                    <span>فوز {awayTeam.nameAr}: {match.insights.prediction.awayWinPct}%</span>
                  </div>
                  <div className="h-3 w-full bg-neutral-800 rounded-full flex overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${match.insights.prediction.homeWinPct}%` }}
                    ></div>
                    <div
                      className="bg-neutral-600 h-full"
                      style={{ width: `${match.insights.prediction.drawPct}%` }}
                    ></div>
                    <div
                      className="bg-teal-400 h-full"
                      style={{ width: `${match.insights.prediction.awayWinPct}%` }}
                    ></div>
                  </div>
                </div>

                {/* Explicit Disclaimer required by prompt */}
                <div className="flex items-start gap-2 bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/80 text-[11px] text-neutral-400">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    تنويه قانوني: التوقعات هي تحليلات إحصائية استرشادية ولا تضمن بأي شكل نتائج حتمية للمباريات.
                  </span>
                </div>
              </div>

              {/* Form Comparison */}
              <div className="bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800 space-y-3">
                <h4 className="text-xs font-extrabold text-white">نتائج آخر 5 مباريات للفريقين</h4>
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs font-bold text-neutral-300">{homeTeam.nameAr}</span>
                  <div className="flex gap-1.5">
                    {match.insights.homeForm.map((f, i) => (
                      <span
                        key={i}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black font-mono text-white ${
                          f === 'W' ? 'bg-emerald-600' : f === 'D' ? 'bg-neutral-600' : 'bg-rose-600'
                        }`}
                      >
                        {f === 'W' ? 'ف' : f === 'D' ? 'ت' : 'خ'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center py-1 border-t border-neutral-800/80 pt-2">
                  <span className="text-xs font-bold text-neutral-300">{awayTeam.nameAr}</span>
                  <div className="flex gap-1.5">
                    {match.insights.awayForm.map((f, i) => (
                      <span
                        key={i}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black font-mono text-white ${
                          f === 'W' ? 'bg-emerald-600' : f === 'D' ? 'bg-neutral-600' : 'bg-rose-600'
                        }`}
                      >
                        {f === 'W' ? 'ف' : f === 'D' ? 'ت' : 'خ'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* H2H */}
              <div className="bg-neutral-900/60 p-4 rounded-2xl border border-neutral-800 space-y-2">
                <h4 className="text-xs font-extrabold text-white">المواجهات المباشرة التاريخية</h4>
                <div className="flex justify-around text-center py-2">
                  <div>
                    <span className="text-base font-black font-mono text-emerald-400">
                      {match.insights.h2h.homeWins}
                    </span>
                    <p className="text-[10px] text-neutral-400">فوز {homeTeam.nameAr}</p>
                  </div>
                  <div>
                    <span className="text-base font-black font-mono text-neutral-400">
                      {match.insights.h2h.draws}
                    </span>
                    <p className="text-[10px] text-neutral-400">تعادل</p>
                  </div>
                  <div>
                    <span className="text-base font-black font-mono text-teal-400">
                      {match.insights.h2h.awayWins}
                    </span>
                    <p className="text-[10px] text-neutral-400">فوز {awayTeam.nameAr}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. LIVE MATCH TRACKER */}
          {activeTab === 'tracker' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400">
                <Radio className="w-4 h-4 animate-pulse shrink-0" />
                <span>
                  بث لحظي للمجريات والفرص والضربات الركنية بدون تأخير لمن يتعذر عليه مشاهدة اللقاء.
                </span>
              </div>

              <div className="space-y-2.5">
                {match.liveTracker.map(entry => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-right space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                        الدقيقة {entry.minute}'
                      </span>
                      {entry.type === 'goal' && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          ⚽ هدف
                        </span>
                      )}
                      {entry.type === 'danger' && (
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                          ⚡ فرصة خطيرة
                        </span>
                      )}
                      {entry.type === 'var' && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold">
                          🔍 مراجعة الفار
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-200 leading-relaxed">{entry.textAr}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
