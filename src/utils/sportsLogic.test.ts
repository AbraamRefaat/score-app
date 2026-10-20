import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterMyScoresMatches,
  filterAllScoresMatches,
  calculateStandings,
  getAvailableTeamsForSelection,
  searchEntities,
} from './sportsLogic.ts';
import type { Match, Tournament, Team, StandingRow } from '../types/index.ts';

const mockTournaments: Tournament[] = [
  { id: 'egy_pl', sportId: 'football', nameAr: 'الدوري المصري الممتاز', nameEn: 'Egyptian Premier League', countryAr: 'مصر', countryEn: 'Egypt', logo: '🇪🇬', isPopular: true },
  { id: 'ucl', sportId: 'football', nameAr: 'دوري أبطال أوروبا', nameEn: 'UEFA Champions League', countryAr: 'أوروبا', countryEn: 'Europe', logo: '🏆', isPopular: true },
  { id: 'nba', sportId: 'basketball', nameAr: 'الدوري الأمريكي للمحترفين', nameEn: 'NBA', countryAr: 'أمريكا', countryEn: 'USA', logo: '🏀', isPopular: true },
];

const mockTeams: Team[] = [
  { id: 'ahly', sportId: 'football', tournamentId: 'egy_pl', nameAr: 'الأهلي', nameEn: 'Al Ahly', shortNameAr: 'الأهلي', logo: '🔴', primaryColor: '#DC2626', stadiumAr: 'استاد القاهرة الدولي', cityAr: 'القاهرة' },
  { id: 'zamalek', sportId: 'football', tournamentId: 'egy_pl', nameAr: 'الزمالك', nameEn: 'Zamalek SC', shortNameAr: 'الزمالك', logo: '⚪', primaryColor: '#FFFFFF', stadiumAr: 'استاد القاهرة الدولي', cityAr: 'الجيزة' },
  { id: 'realmadrid', sportId: 'football', tournamentId: 'ucl', nameAr: 'ريال مدريد', nameEn: 'Real Madrid', shortNameAr: 'الريال', logo: '👑', primaryColor: '#FFFFFF', stadiumAr: 'سانتياغو برنابيو', cityAr: 'مدريد' },
  { id: 'mancity', sportId: 'football', tournamentId: 'ucl', nameAr: 'مانشستر سيتي', nameEn: 'Manchester City', shortNameAr: 'السيتي', logo: '🔵', primaryColor: '#38BDF8', stadiumAr: 'الاتحاد', cityAr: 'مانشستر' },
  { id: 'lakers', sportId: 'basketball', tournamentId: 'nba', nameAr: 'لوس أنجلوس ليكرز', nameEn: 'LA Lakers', shortNameAr: 'ليكرز', logo: '🟡', primaryColor: '#552583', stadiumAr: 'كريبتو كوم أرينا', cityAr: 'لوس أنجلوس' },
];

const baseStats = {
  possession: [50, 50] as [number, number],
  shots: [10, 8] as [number, number],
  shotsOnTarget: [5, 3] as [number, number],
  xG: [1.4, 0.9] as [number, number],
  dangerousAttacks: [40, 35] as [number, number],
  corners: [6, 4] as [number, number],
  fouls: [11, 13] as [number, number],
  offsides: [2, 1] as [number, number],
  yellowCards: [1, 2] as [number, number],
  redCards: [0, 0] as [number, number],
};

const baseLineup = {
  formationHome: '4-3-3',
  formationAway: '4-2-3-1',
  isOfficial: true,
  homeStarters: [],
  homeSubs: [],
  awayStarters: [],
  awaySubs: [],
};

const baseInsights = {
  prediction: { homeWinPct: 50, drawPct: 25, awayWinPct: 25 },
  homeForm: ['W', 'W', 'D', 'W', 'W'] as ('W' | 'D' | 'L')[],
  awayForm: ['W', 'D', 'L', 'W', 'D'] as ('W' | 'D' | 'L')[],
  h2h: { homeWins: 4, draws: 2, awayWins: 1, lastMatches: [] },
};

const mockMatches: Match[] = [
  {
    id: 'm1',
    sportId: 'football',
    tournamentId: 'egy_pl',
    homeTeamId: 'ahly',
    awayTeamId: 'zamalek',
    status: 'LIVE',
    minute: 68,
    homeScore: 2,
    awayScore: 1,
    startTime: '20:30',
    date: '2026-10-19',
    venueAr: 'استاد القاهرة الدولي',
    roundAr: 'الجولة 14',
    events: [],
    stats: baseStats,
    lineup: baseLineup,
    insights: baseInsights,
    liveTracker: [],
  },
  {
    id: 'm2',
    sportId: 'football',
    tournamentId: 'ucl',
    homeTeamId: 'realmadrid',
    awayTeamId: 'mancity',
    status: 'SCHEDULED',
    homeScore: 0,
    awayScore: 0,
    startTime: '22:00',
    date: '2026-10-19',
    venueAr: 'سانتياغو برنابيو',
    roundAr: 'دور الـ 16',
    events: [],
    stats: baseStats,
    lineup: baseLineup,
    insights: baseInsights,
    liveTracker: [],
  },
];

test('Personalized My Scores filtering works correctly', () => {
  // User selected football, follows Ahly, and follows UCL tournament
  const categorized = filterMyScoresMatches(
    mockMatches,
    mockTournaments,
    ['football'],
    ['ucl'],
    ['ahly'],
    '2026-10-19',
    'all'
  );

  // m1 has Ahly -> should be in teamsMatches
  assert.equal(categorized.teamsMatches.length, 1);
  assert.equal(categorized.teamsMatches[0].matches[0].id, 'm1');

  // m2 is in UCL tournament -> should be in favoriteTournamentsMatches
  assert.equal(categorized.favoriteTournamentsMatches.length, 1);
  assert.equal(categorized.favoriteTournamentsMatches[0].matches[0].id, 'm2');

  // m1 is LIVE -> should also be in liveMatches
  assert.equal(categorized.liveMatches.length, 1);
  assert.equal(categorized.liveMatches[0].id, 'm1');
});

test('Removing a team removes its match from My Scores unless its tournament is followed', () => {
  // If user only follows UCL, and does NOT follow ahly or egy_pl
  const categorized = filterMyScoresMatches(
    mockMatches,
    mockTournaments,
    ['football'],
    ['ucl'],
    [],
    '2026-10-19',
    'all'
  );

  // m1 (egy_pl) should be absent
  assert.equal(categorized.teamsMatches.length, 0);
  assert.equal(categorized.favoriteTournamentsMatches.length, 1);
  assert.equal(categorized.favoriteTournamentsMatches[0].matches[0].id, 'm2');
});

test('Onboarding step 3 team filtering based on sports and tournaments', () => {
  // If user selects football and ucl
  const filteredTeams = getAvailableTeamsForSelection(mockTeams, ['football'], ['ucl']);
  assert.equal(filteredTeams.length, 2);
  assert.ok(filteredTeams.some(t => t.id === 'realmadrid'));
  assert.ok(filteredTeams.some(t => t.id === 'mancity'));
  assert.ok(!filteredTeams.some(t => t.id === 'ahly'));

  // If user selected football but no specific tournament
  const allFootball = getAvailableTeamsForSelection(mockTeams, ['football'], []);
  assert.equal(allFootball.length, 4);
});

test('Search entities finds Arabic and English names', () => {
  const resultAr = searchEntities('الأهلي', mockTeams, mockTournaments, mockMatches);
  assert.equal(resultAr.matchedTeams.length, 1);
  assert.equal(resultAr.matchedTeams[0].id, 'ahly');

  const resultEn = searchEntities('Madrid', mockTeams, mockTournaments, mockMatches);
  assert.equal(resultEn.matchedTeams.length, 1);
  assert.equal(resultEn.matchedTeams[0].id, 'realmadrid');
});

test('Standings calculation updates points, goals, and rank properly', () => {
  const initial: StandingRow[] = [
    { rank: 1, teamId: 'ahly', played: 5, won: 4, drawn: 1, lost: 0, goalsFor: 10, goalsAgainst: 2, goalDiff: 8, points: 13, form: ['W', 'W', 'W', 'D', 'W'] },
    { rank: 2, teamId: 'zamalek', played: 5, won: 3, drawn: 2, lost: 0, goalsFor: 8, goalsAgainst: 3, goalDiff: 5, points: 11, form: ['W', 'D', 'W', 'D', 'W'] },
  ];

  // Ahly beats Zamalek 2-1
  const updated = calculateStandings(initial, {
    homeTeamId: 'ahly',
    awayTeamId: 'zamalek',
    homeScore: 2,
    awayScore: 1,
  });

  const ahly = updated.find(r => r.teamId === 'ahly')!;
  const zamalek = updated.find(r => r.teamId === 'zamalek')!;

  assert.equal(ahly.points, 16);
  assert.equal(ahly.played, 6);
  assert.equal(ahly.won, 5);
  assert.equal(zamalek.points, 11);
  assert.equal(zamalek.lost, 1);
  assert.equal(updated[0].teamId, 'ahly');
});
