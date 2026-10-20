import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import type { Tournament, Match } from '../../types/index.ts';
import { MatchCard } from './MatchCard.tsx';
import { TournamentBadge } from './ClubBadge.tsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TournamentGroupCardProps {
  tournament: Tournament;
  matches: Match[];
  defaultExpanded?: boolean;
}

export const TournamentGroupCard: React.FC<TournamentGroupCardProps> = ({
  tournament,
  matches,
  defaultExpanded = true,
}) => {
  const { openModal } = useApp();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleOpenTournament = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({ type: 'tournament_page', tournamentId: tournament.id });
  };

  return (
    <div className="bg-[#121724]/60 border border-neutral-800/80 rounded-2xl overflow-hidden mb-3 shadow-sm">
      {/* Tournament Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-3.5 py-2.5 bg-[#161c2c]/90 hover:bg-[#1a2236] cursor-pointer select-none transition border-b border-neutral-800/60"
        role="button"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div
            onClick={handleOpenTournament}
            className="cursor-pointer hover:scale-105 transition"
            title={`عرض جدول ${tournament.nameAr}`}
          >
            <TournamentBadge tournamentId={tournament.id} size="sm" />
          </div>
          <div className="flex flex-col text-right">
            <span
              onClick={handleOpenTournament}
              className="font-bold text-xs text-neutral-200 hover:text-[#7ec815] transition"
            >
              {tournament.nameAr}
            </span>
            <span className="text-[10px] text-neutral-400">{tournament.countryAr}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded-full border border-neutral-700/40">
            {matches.length} {matches.length === 1 ? 'مباراة' : 'مباريات'}
          </span>
          <button
            type="button"
            className="p-1 text-neutral-400 hover:text-neutral-200 transition"
            aria-label={isExpanded ? 'طي المباريات' : 'عرض المباريات'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Matches List */}
      {isExpanded && (
        <div className="p-2 space-y-2">
          {matches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};
