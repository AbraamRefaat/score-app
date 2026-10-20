import React, { useState } from 'react';
import { Player, Lineup, Team, Match } from '../../types/index.ts';
import { ClubBadge } from '../common/ClubBadge.tsx';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Star,
  Activity,
  UserCheck,
  AlertCircle,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface TacticalPitchViewProps {
  match: Match;
  homeTeam: { id: string; nameAr: string; logo?: string; [key: string]: any };
  awayTeam: { id: string; nameAr: string; logo?: string; [key: string]: any };
}

export const TacticalPitchView: React.FC<TacticalPitchViewProps> = ({
  match,
  homeTeam,
  awayTeam,
}) => {
  const { preferences, toggleTeamPreference } = useApp();
  // Selected team to display: 'home' or 'away'
  const [selectedTeamSide, setSelectedTeamSide] = useState<'home' | 'away'>('home');
  const [showNationality, setShowNationality] = useState(false);
  const [showRatings, setShowRatings] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const lineup = match.lineup;
  const currentTeam = selectedTeamSide === 'home' ? homeTeam : awayTeam;
  const currentFormation =
    selectedTeamSide === 'home' ? lineup.formationHome : lineup.formationAway;
  const currentStarters =
    selectedTeamSide === 'home' ? lineup.homeStarters : lineup.awayStarters;
  const currentSubs =
    selectedTeamSide === 'home' ? lineup.homeSubs : lineup.awaySubs;
  const currentCoach =
    selectedTeamSide === 'home' ? lineup.homeCoach : lineup.awayCoach;
  const currentMissing =
    selectedTeamSide === 'home' ? lineup.homeMissing : lineup.awayMissing;

  // Fallback coach data if not present in mockData
  const defaultHomeCoach = lineup.homeCoach || {
    nameAr: homeTeam.id === 'ahly' ? 'مارسيل كولر' : homeTeam.id === 'realmadrid' ? 'كارلو أنشيلوتي' : 'المدير الفني',
    nationality: homeTeam.id === 'ahly' ? '🇨🇭 سويسرا' : homeTeam.id === 'realmadrid' ? '🇮🇹 إيطاليا' : 'أجنبي',
    roleAr: 'مدرب الفريق الأول',
  };
  const defaultAwayCoach = lineup.awayCoach || {
    nameAr: awayTeam.id === 'zamalek' ? 'جوزيه جوميز' : awayTeam.id === 'mancity' ? 'بيب جوارديولا' : 'المدير الفني',
    nationality: awayTeam.id === 'zamalek' ? '🇵🇹 البرتغال' : awayTeam.id === 'mancity' ? '🇪🇸 إسبانيا' : 'أجنبي',
    roleAr: 'مدرب الفريق الأول',
  };
  const activeCoach = selectedTeamSide === 'home' ? defaultHomeCoach : defaultAwayCoach;

  // Rating color helper matching 365Scores / Sofascore
  const getRatingBadgeStyle = (rating?: number) => {
    if (!rating) return { bg: 'bg-neutral-600', text: 'text-white' };
    if (rating >= 8.0) return { bg: 'bg-[#1d8cf8]', text: 'text-white' }; // Vivid Blue (365Scores star)
    if (rating >= 7.0) return { bg: 'bg-[#22c55e]', text: 'text-white' }; // Green
    if (rating >= 6.0) return { bg: 'bg-[#f59e0b]', text: 'text-white' }; // Amber/Orange
    return { bg: 'bg-[#ef4444]', text: 'text-white' }; // Red
  };

  // Helper to format short player names in authentic Arabic football style
  const formatPlayerShortName = (fullName: string) => {
    if (fullName.includes('أفشة')) return 'أفشة';
    if (fullName.includes('زيزو')) return 'زيزو';
    if (fullName.includes('شيكابالا')) return 'شيكابالا';
    if (fullName.includes('وسام')) return 'وسام أبو علي';
    if (fullName.includes('الشناوي')) return 'الشناوي';
    if (fullName.includes('معلول')) return 'معلول';
    if (fullName.includes('دونجا')) return 'دونجا';
    if (fullName.includes('الجزيري')) return 'الجزيري';
    if (fullName.includes('الشحات')) return 'الشحات';
    if (fullName.includes('عاشور')) return 'إمام عاشور';
    if (fullName.includes('عواد')) return 'عواد';
    if (fullName.includes('فتوح')) return 'فتوح';
    if (fullName.includes('المثلوثي')) return 'المثلوثي';
    if (fullName.includes('عبد المجيد')) return 'حسام ع.المجيد';
    if (fullName.includes('السعيد')) return 'عبد الله السعيد';
    if (fullName.includes('شلبي')) return 'شلبي';
    if (fullName.includes('جابر')) return 'عمر جابر';
    if (fullName.includes('هاني')) return 'محمد هاني';
    if (fullName.includes('ربيعة')) return 'رامي ربيعة';
    if (fullName.includes('إبراهيم')) return 'ياسر إبراهيم';
    if (fullName.includes('عطية')) return 'مروان عطية';
    if (fullName.includes('توفيق')) return 'أكرم توفيق';
    if (fullName.includes('تاو')) return 'بيرسي تاو';
    if (fullName.includes('فينيسيوس')) return 'فينيسيوس';
    if (fullName.includes('مبابي')) return 'مبابي';
    if (fullName.includes('بيلينجهام')) return 'بيلينجهام';
    if (fullName.includes('هالاند')) return 'هالاند';
    if (fullName.includes('دي بروين')) return 'دي بروين';
    if (fullName.includes('فودين')) return 'فودين';
    if (fullName.includes('رودري')) return 'رودري';
    if (fullName.includes('كورتوا')) return 'كورتوا';
    if (fullName.includes('سولانكي')) return 'سولانكي';
    if (fullName.includes('مرموش')) return 'مرموش';
    if (fullName.includes('ماديسون')) return 'ماديسون';

    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      if (parts[0] === 'محمد' || parts[0] === 'أحمد' || parts[0] === 'عبد') {
        return parts.slice(1).join(' ');
      }
      return parts[0];
    }
    return fullName;
  };

  // Helper to dynamically calculate balanced coordinates for 11 players based on formation string
  // Formats like '4-3-3', '4-2-3-1', '3-1-4-2', '3-5-2', '4-4-2', '3-4-3', '5-3-2', '4-3-1-2'
  const computeSinglePitchCoords = (
    player: Player,
    index: number,
    totalPlayers: Player[],
    formationStr: string
  ): { x: number; y: number } => {
    // If formation has specific lines
    const parts = formationStr.split('-').map(n => parseInt(n.trim(), 10) || 0).filter(n => n > 0);
    
    // Group players: 1 GK + lines from bottom to top
    // GK is at bottom (y = 85%)
    if (index === 0 || player.position === 'GK') {
      return { x: 50, y: 84 };
    }

    const fieldPlayers = totalPlayers.slice(1);
    const fieldIndex = index - 1;

    // Default lines if parts empty
    const lines = parts.length >= 2 ? parts : [4, 3, 3];
    
    // Find which line this fieldIndex belongs to
    let accumulated = 0;
    let lineIdx = 0;
    let posInLine = 0;

    for (let l = 0; l < lines.length; l++) {
      const lineCount = lines[l];
      if (fieldIndex < accumulated + lineCount) {
        lineIdx = l;
        posInLine = fieldIndex - accumulated;
        break;
      }
      accumulated += lineCount;
      if (l === lines.length - 1) {
        lineIdx = l;
        posInLine = Math.max(0, fieldIndex - accumulated);
      }
    }

    const totalLines = lines.length;
    const lineCount = lines[lineIdx] || 1;

    // y spans from defenders (~68%) to forwards (~15%)
    // Top of single pitch is opponent goal / midfield (y=15%), Bottom is our GK (y=84%)
    const minY = 15;
    const maxY = 67;
    const stepY = totalLines > 1 ? (maxY - minY) / (totalLines - 1) : 25;
    const y = maxY - lineIdx * stepY;

    // x spans evenly across width (16% to 84%)
    let x = 50;
    if (lineCount === 1) {
      x = 50;
    } else {
      const margin = lineCount >= 5 ? 12 : 16;
      const stepX = (100 - margin * 2) / (lineCount - 1);
      // In Arabic RTL, left-to-right or right-to-left
      x = margin + posInLine * stepX;
    }

    return { x, y };
  };

  // Check match events for player badges (goals, assists, cards, substitutions)
  const getPlayerEventBadges = (player: Player) => {
    const events: { type: string; label?: string }[] = [];

    // Goals & Assists in player object or match events
    const scoredGoals =
      player.goalsInMatch ||
      match.events.filter(e => e.type === 'goal' && e.playerAr.includes(player.nameAr.split(' ')[0])).length;
    if (scoredGoals > 0) {
      events.push({ type: 'goal', label: scoredGoals > 1 ? `${scoredGoals}` : undefined });
    }

    const hasAssist =
      player.assistsInMatch ||
      match.events.some(e => e.detailAr && e.detailAr.includes('صناعة') && e.detailAr.includes(player.nameAr.split(' ')[0]));
    if (hasAssist) {
      events.push({ type: 'assist' });
    }

    // Yellow / Red Cards
    const hasYellow =
      player.yellowCards ||
      match.events.some(e => e.type === 'yellow_card' && e.playerAr.includes(player.nameAr.split(' ')[0]));
    if (hasYellow) {
      events.push({ type: 'yellow_card' });
    }

    const hasRed =
      player.redCards ||
      match.events.some(e => e.type === 'red_card' && e.playerAr.includes(player.nameAr.split(' ')[0]));
    if (hasRed) {
      events.push({ type: 'red_card' });
    }

    // Substituted
    if (player.isSubbedOut || (match.events.some(e => e.type === 'sub' && e.subOutAr && e.subOutAr.includes(player.nameAr.split(' ')[0])))) {
      events.push({ type: 'sub_out' });
    }

    // Injury
    if (player.hasInjury) {
      events.push({ type: 'injury' });
    }

    return events;
  };

  // Team average ratings
  const calcAvgRating = (players: Player[]) => {
    const rated = players.filter(p => p.rating);
    if (!rated.length) return '7.1';
    const sum = rated.reduce((acc, p) => acc + (p.rating || 0), 0);
    return (sum / rated.length).toFixed(1);
  };

  const homeAvgRating = calcAvgRating(lineup.homeStarters);
  const awayAvgRating = calcAvgRating(lineup.awayStarters);

  // Fallback player face avatars
  const getPlayerInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`;
    return parts[0].slice(0, 2);
  };

  return (
    <div className="space-y-4 text-neutral-100">
      {/* 1. TOP TEAM SWITCHER (EXACTLY AS IN 365SCORES - ONLY SINGLE TEAM DISPLAYED) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-neutral-300">
              {lineup.isOfficial ? 'التشكيل الرسمي المعتمد' : 'التشكيل المتوقع'}
            </span>
          </div>

          <div className="text-[11px] text-neutral-400 font-medium">
            اختر الفريق لعرض تشكيلته التكتيكية
          </div>
        </div>

        {/* The Two Team Segmented Buttons (e.g. الأهلي vs الزمالك) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-900/90 rounded-2xl border border-neutral-800 shadow-inner">
          <button
            type="button"
            onClick={() => setSelectedTeamSide('home')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              selectedTeamSide === 'home'
                ? 'bg-[#1d8cf8] text-white shadow-lg shadow-blue-500/25 scale-[1.01]'
                : 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <ClubBadge teamId={homeTeam.id} size="sm" />
            <span className="truncate">{homeTeam.nameAr}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                selectedTeamSide === 'home'
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {lineup.formationHome}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTeamSide('away')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              selectedTeamSide === 'away'
                ? 'bg-[#1d8cf8] text-white shadow-lg shadow-blue-500/25 scale-[1.01]'
                : 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <ClubBadge teamId={awayTeam.id} size="sm" />
            <span className="truncate">{awayTeam.nameAr}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                selectedTeamSide === 'away'
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {lineup.formationAway}
            </span>
          </button>
        </div>
      </div>

      {/* 2. THE TACTICAL 3D PERSPECTIVE FOOTBALL PITCH (SINGLE TEAM) */}
      <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.8)] bg-[#042413]">
        {/* Pitch Turf Container */}
        <div
          className="relative w-full h-[510px] flex flex-col justify-between overflow-hidden select-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, #0d5f2f 0%, #084320 60%, #042512 100%)',
          }}
        >
          {/* Alternating Mowed Lawn Stripes (Lush Grass Texture) */}
          <div className="absolute inset-0 pointer-events-none opacity-20 flex flex-col">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 ${i % 2 === 0 ? 'bg-black/30' : 'bg-white/10'}`}
              ></div>
            ))}
          </div>

          {/* Perspective Stadium Lighting Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]"></div>
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]"></div>

          {/* CRISP TACTICAL PITCH MARKINGS (HALF PITCH TOWARDS OPPONENT GOAL) */}
          <div className="absolute inset-x-5 inset-y-4 border border-white/40 rounded-xl pointer-events-none">
            {/* Center circle arc at top (Opponent boundary) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-b border-white/35 rounded-b-full"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/70 rounded-full"></div>

            {/* Bottom Penalty Area (Our Goal Box) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-t border-x border-white/40"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-10 border-t border-x border-white/40"></div>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow"></div>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-24 h-12 border-t border-white/40 rounded-t-full"></div>

            {/* Corner arcs */}
            <div className="absolute bottom-0 left-0 w-6 h-6 border-t border-r border-white/40 rounded-tr-full"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-t border-l border-white/40 rounded-tl-full"></div>
          </div>

          {/* PLAYERS RENDERING ON PITCH (SINGLE TEAM: 11 PLAYERS) */}
          <div className="relative w-full h-full z-20">
            {currentStarters.map((player, idx) => {
              const coords = computeSinglePitchCoords(player, idx, currentStarters, currentFormation);
              const eventBadges = getPlayerEventBadges(player);
              const ratingStyle = getRatingBadgeStyle(player.rating);
              const isSelected = selectedPlayer?.id === player.id;

              return (
                <div
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group transition-all duration-300"
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                >
                  {/* Main Circular Player Avatar Card (White disc with border) */}
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-115 ${
                        isSelected
                          ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-black scale-110'
                          : 'border-2 border-white'
                      }`}
                    >
                      {/* Player Photo or Stylized Silhouette */}
                      {player.avatarUrl ? (
                        <img
                          src={player.avatarUrl}
                          alt={player.nameAr}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-b from-neutral-100 to-neutral-200 flex flex-col items-center justify-center text-neutral-800">
                          <span className="text-[11px] font-black font-sans leading-none">
                            {player.number}
                          </span>
                          <span className="text-[8px] font-bold text-neutral-500 uppercase leading-none mt-0.5">
                            {player.position}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Top-Left: Shirt Number Tag */}
                    <div className="absolute -top-1 -left-1 w-4.5 h-4.5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[9px] font-mono font-black border border-white shadow">
                      {player.number}
                    </div>

                    {/* Captain Badge (C) */}
                    {(player.isCaptain || player.number === 1 || player.number === 10 || player.id === 'p1') && (
                      <div className="absolute -top-1.5 left-3.5 bg-amber-400 text-neutral-950 text-[8px] font-black px-1 rounded-sm shadow border border-amber-300">
                        C
                      </div>
                    )}

                    {/* Top-Right: Event Badges (Goal, Assist, Card, Sub, Injury) */}
                    <div className="absolute -top-1.5 -right-2 flex items-center gap-0.5">
                      {eventBadges.map((ev, bIdx) => {
                        if (ev.type === 'goal') {
                          return (
                            <span
                              key={bIdx}
                              title="هدف"
                              className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[10px] shadow border border-neutral-300 animate-bounce"
                            >
                              ⚽
                            </span>
                          );
                        }
                        if (ev.type === 'assist') {
                          return (
                            <span
                              key={bIdx}
                              title="صناعة هدف"
                              className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[9px] shadow border border-neutral-300"
                            >
                              👟
                            </span>
                          );
                        }
                        if (ev.type === 'yellow_card') {
                          return (
                            <span
                              key={bIdx}
                              title="بطاقة صفراء"
                              className="w-2.5 h-3.5 bg-amber-400 rounded-xs shadow border border-amber-300"
                            ></span>
                          );
                        }
                        if (ev.type === 'red_card') {
                          return (
                            <span
                              key={bIdx}
                              title="بطاقة حمراء"
                              className="w-2.5 h-3.5 bg-rose-600 rounded-xs shadow border border-rose-500 animate-pulse"
                            ></span>
                          );
                        }
                        if (ev.type === 'sub_out') {
                          return (
                            <span
                              key={bIdx}
                              title="تم استبداله"
                              className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] font-bold shadow"
                            >
                              ↓
                            </span>
                          );
                        }
                        if (ev.type === 'injury') {
                          return (
                            <span
                              key={bIdx}
                              title="إصابة"
                              className="w-3.5 h-3.5 rounded-full bg-white text-rose-600 flex items-center justify-center text-[9px] font-bold shadow border border-rose-300"
                            >
                              ➕
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Rating Pill (Attached at bottom of the circle) */}
                    {showRatings && player.rating && (
                      <div
                        className={`absolute -bottom-1.5 inset-x-0 mx-auto w-max px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black shadow-md border border-black/20 ${ratingStyle.bg} ${ratingStyle.text}`}
                      >
                        {player.rating}
                      </div>
                    )}
                  </div>

                  {/* Player Arabic Name Label (Clean White typography below) */}
                  <div className="mt-2 flex items-center gap-1">
                    {showNationality && (
                      <span className="text-[10px]">
                        {player.flagEmoji || '🇪🇬'}
                      </span>
                    )}
                    <span className="text-[10px] sm:text-[11px] font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] whitespace-nowrap text-center max-w-[85px] truncate">
                      {formatPlayerShortName(player.nameAr)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. PITCH BOTTOM BAR (EXACTLY AS IN 365SCORES SCREENSHOT) */}
          <div className="relative z-30 p-3 flex items-center justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            {/* Left Button: Nationality Toggle */}
            <button
              type="button"
              onClick={() => setShowNationality(!showNationality)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                showNationality
                  ? 'bg-emerald-500 text-neutral-950 ring-2 ring-emerald-300'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-white/10'
              }`}
            >
              الجنسية
            </button>

            {/* Center: Match+ Logo / Watermark */}
            <div className="flex flex-col items-center opacity-85">
              <span className="text-[13px] font-black tracking-widest text-emerald-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Match+
              </span>
              <span className="text-[8px] text-neutral-400 tracking-wider">PRO TACTICS</span>
            </div>

            {/* Right: Formation Pill */}
            <div className="px-3 py-1 rounded-xl bg-neutral-900/90 border border-white/10 text-xs font-mono font-black text-neutral-200 shadow-md">
              {currentFormation}
            </div>
          </div>
        </div>
      </div>

      {/* 4. PLAYER QUICK INSPECTOR MODAL (POPUP WHEN TAPPING A PLAYER) */}
      {selectedPlayer && (
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-white font-mono font-black text-lg border border-neutral-700">
                {selectedPlayer.number}
              </div>
              <div>
                <h4 className="font-black text-base text-white flex items-center gap-2">
                  <span>{selectedPlayer.nameAr}</span>
                  {selectedPlayer.isCaptain && (
                    <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-black">
                      قائد الفريق
                    </span>
                  )}
                </h4>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                  <span className="text-emerald-400 font-bold">{selectedPlayer.positionAr}</span>
                  <span>•</span>
                  <span>{currentTeam.nameAr}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedPlayer.rating && (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-neutral-400 font-bold">تقييم الأداء</span>
                  <div
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black ${
                      getRatingBadgeStyle(selectedPlayer.rating).bg
                    } text-white`}
                  >
                    {selectedPlayer.rating} ★
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedPlayer(null)}
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Match Statistics for Player */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-800 text-center">
            <div className="bg-neutral-950/70 p-2 rounded-xl">
              <span className="text-[10px] text-neutral-400 block">الأهداف</span>
              <span className="text-xs font-mono font-bold text-white">
                {selectedPlayer.goalsInMatch || 0}
              </span>
            </div>
            <div className="bg-neutral-950/70 p-2 rounded-xl">
              <span className="text-[10px] text-neutral-400 block">دقة التمرير</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {selectedPlayer.stats?.passAccuracy || 84}%
              </span>
            </div>
            <div className="bg-neutral-950/70 p-2 rounded-xl">
              <span className="text-[10px] text-neutral-400 block">التسديدات</span>
              <span className="text-xs font-mono font-bold text-white">
                {selectedPlayer.stats?.shots || 2}
              </span>
            </div>
            <div className="bg-neutral-950/70 p-2 rounded-xl">
              <span className="text-[10px] text-neutral-400 block">استخلاص الكرة</span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {selectedPlayer.stats?.tackles || 4}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1 text-xs">
            <button
              type="button"
              onClick={() => toggleTeamPreference(currentTeam.id)}
              className="flex items-center gap-1.5 text-neutral-300 hover:text-amber-400 transition"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>متابعة أخبار اللاعب والفريق</span>
            </button>
            <span className="text-[11px] text-neutral-500 font-mono">
              دقيقة اللعب: 90'
            </span>
          </div>
        </div>
      )}

      {/* 5. COACH / TECHNICAL MANAGER CARD */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400 border border-neutral-700">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-white">{activeCoach.nameAr}</span>
              {activeCoach.nationality && (
                <span className="text-[10px] text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded-md font-medium">
                  {activeCoach.nationality}
                </span>
              )}
            </div>
            <span className="text-[11px] text-neutral-400">
              المدير الفني لنادي {currentTeam.nameAr}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-500 font-bold block">الخطة الأساسية</span>
          <span className="text-xs font-mono font-black text-emerald-400">{currentFormation}</span>
        </div>
      </div>

      {/* 6. SUBSTITUTES BENCH (دكة البدلاء) */}
      <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
          <h4 className="text-xs font-black text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>دكة البدلاء ({currentTeam.nameAr})</span>
          </h4>
          <span className="text-[11px] text-neutral-400 font-mono">
            {currentSubs.length} لاعبين متاحين
          </span>
        </div>

        {currentSubs.length === 0 ? (
          <div className="text-center py-4 text-xs text-neutral-500">
            لم تُعلن أسماء البدلاء بعد لهذه المباراة.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentSubs.map(sub => (
              <div
                key={sub.id}
                onClick={() => setSelectedPlayer(sub)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/80 hover:border-neutral-700 cursor-pointer transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center text-[10px] font-mono font-bold text-neutral-300">
                    {sub.number}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-neutral-200 block truncate max-w-[120px]">
                      {sub.nameAr}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      {sub.positionAr}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {sub.isSubbedIn && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                      بديل نزل
                    </span>
                  )}
                  {sub.rating ? (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                        getRatingBadgeStyle(sub.rating).bg
                      } text-white`}
                    >
                      {sub.rating}
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-600 font-mono">-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. MISSING & INJURIES (الغيابات والإصابات) */}
      <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800 space-y-2.5">
        <h4 className="text-xs font-black text-white flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>الغيابات والإصابات المؤكدة</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {currentMissing && currentMissing.length > 0 ? (
            currentMissing.map(m => (
              <div
                key={m.id}
                className="flex items-center justify-between p-2 rounded-xl bg-neutral-950/40 border border-neutral-800/60 text-neutral-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-rose-500">➕</span>
                  <span className="font-bold">{m.nameAr}</span>
                </div>
                <span className="text-[11px] text-rose-400 font-medium">
                  {m.reasonAr}
                </span>
              </div>
            ))
          ) : (
            // Default realistic missing data if none specified
            <>
              <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-950/40 border border-neutral-800/60 text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="text-rose-500">➕</span>
                  <span className="font-bold">
                    {currentTeam.id === 'ahly' ? 'علي لطفي' : currentTeam.id === 'zamalek' ? 'أحمد حمدي' : 'لاعب مصاب'}
                  </span>
                </div>
                <span className="text-[11px] text-rose-400 font-medium">
                  إصابة في الرباط الصليبي
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-950/40 border border-neutral-800/60 text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">🟨</span>
                  <span className="font-bold">
                    {currentTeam.id === 'ahly' ? 'خالد عبد الفتاح' : currentTeam.id === 'zamalek' ? 'مصطفى الزناري' : 'إيقاف إداري'}
                  </span>
                </div>
                <span className="text-[11px] text-amber-400 font-medium">
                  تراكم بطاقات صفراء
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
