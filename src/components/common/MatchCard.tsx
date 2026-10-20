import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import type { Match, Team } from '../../types/index.ts';
import { ClubBadge } from './ClubBadge.tsx';
import { Star, Clock } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  showTournamentHeader?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { teams, openModal, preferences, toggleStarMatch } = useApp();

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

  const isStarred = preferences.starredMatchIds.includes(match.id);
  const isLive = match.status === 'LIVE' || match.status === 'HALFTIME';
  const isFinished = match.status === 'FINISHED';

  const handleOpenTeam = (e: React.MouseEvent, teamId: string) => {
    e.stopPropagation();
    openModal({ type: 'team_profile', teamId });
  };

  const handleToggleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStarMatch(match.id);
  };

  return (
    <div
      onClick={() => openModal({ type: 'match_details', matchId: match.id })}
      className="bg-[#121724]/70 hover:bg-[#161c2c] border border-neutral-800/80 hover:border-neutral-700/90 rounded-2xl p-3.5 transition-all duration-200 cursor-pointer active:scale-[0.99] group select-none shadow-sm"
      role="button"
      tabIndex={0}
      aria-label={`مباراة ${homeTeam.nameAr} ضد ${awayTeam.nameAr}`}
    >
      <div className="flex items-center justify-between">
        {/* Right side (RTL): Teams & Scores */}
        <div className="flex-1 space-y-2.5">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div
              onClick={e => handleOpenTeam(e, homeTeam.id)}
              className="flex items-center gap-3 hover:text-[#7ec815] transition"
              title={`عرض صفحة ${homeTeam.nameAr}`}
            >
              <ClubBadge teamId={homeTeam.id} size="sm" />
              <span className="text-sm font-bold text-neutral-100 group-hover:text-emerald-300">
                {homeTeam.nameAr}
              </span>
            </div>
            {(isLive || isFinished) && (
              <span
                className={`text-base font-black font-mono px-2 py-0.5 rounded-lg ${
                  isLive ? 'text-[#7ec815] bg-[#7ec815]/10' : 'text-neutral-200'
                }`}
              >
                {match.homeScore}
              </span>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div
              onClick={e => handleOpenTeam(e, awayTeam.id)}
              className="flex items-center gap-3 hover:text-[#7ec815] transition"
              title={`عرض صفحة ${awayTeam.nameAr}`}
            >
              <ClubBadge teamId={awayTeam.id} size="sm" />
              <span className="text-sm font-bold text-neutral-100 group-hover:text-emerald-300">
                {awayTeam.nameAr}
              </span>
            </div>
            {(isLive || isFinished) && (
              <span
                className={`text-base font-black font-mono px-2 py-0.5 rounded-lg ${
                  isLive ? 'text-[#7ec815] bg-[#7ec815]/10' : 'text-neutral-200'
                }`}
              >
                {match.awayScore}
              </span>
            )}
          </div>
        </div>

        {/* Center / Left (RTL): Status divider & Star button */}
        <div className="mr-4 pr-3 border-r border-neutral-800/80 flex flex-col items-center justify-center min-w-[72px] gap-1.5">
          {isLive ? (
            <div className="flex flex-col items-center">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                <span className="font-mono">{match.minute}'</span>
              </span>
              <span className="text-[10px] text-neutral-500 mt-0.5 font-sans">
                {match.status === 'HALFTIME' ? 'استراحة' : 'مباشر'}
              </span>
            </div>
          ) : isFinished ? (
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md">
                انتهت
              </span>
              <span className="text-[10px] text-neutral-500 mt-0.5">{match.startTime}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {match.startTime}
              </span>
              <span className="text-[10px] text-neutral-500 mt-0.5">لم تبدأ</span>
            </div>
          )}

          {/* Star Toggle */}
          <button
            type="button"
            onClick={handleToggleStar}
            className={`p-1.5 rounded-lg transition ${
              isStarred
                ? 'text-amber-400 bg-amber-400/15'
                : 'text-neutral-600 hover:text-neutral-400 hover:bg-neutral-800'
            }`}
            aria-label={isStarred ? 'إزالة من المباريات المميزة' : 'إضافة إلى المباريات المميزة'}
          >
            <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sport detail pill for non-football (quarters/sets) */}
      {match.sportScoresDetail && (
        <div className="mt-2.5 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <span>
            {match.sportScoresDetail.type === 'quarters' ? 'أرباع السلة' : 'مجموعات التنس'}:
          </span>
          <div className="flex gap-2">
            {match.sportScoresDetail.homePeriods.map((hp, i) => (
              <span key={i} className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">
                {hp}-{match.sportScoresDetail!.awayPeriods[i]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
