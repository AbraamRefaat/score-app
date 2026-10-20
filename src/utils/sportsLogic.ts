import type { Match, MatchStatus, SportId, Tournament, Team, StandingRow } from '../types/index.ts';

export interface MyScoresCategorized {
  liveMatches: Match[];
  teamsMatches: { tournament: Tournament; matches: Match[] }[];
  favoriteTournamentsMatches: { tournament: Tournament; matches: Match[] }[];
  allMatchesCount: number;
}

/**
 * Filter matches for the personalized "My Scores" tab:
 * - Match sport must be in selected sports.
 * - Team matches: matches where home or away team is in selectedTeams.
 * - Favorite tournament matches: matches where tournament is in selectedTournaments, but neither team is in selectedTeams.
 */
export function filterMyScoresMatches(
  matches: Match[],
  tournaments: Tournament[],
  selectedSports: SportId[],
  selectedTournaments: string[],
  selectedTeams: string[],
  dateFilter?: string,
  sportFilter?: SportId | 'all'
): MyScoresCategorized {
  const tournamentMap = new Map<string, Tournament>();
  tournaments.forEach(t => tournamentMap.set(t.id, t));

  // Base filtering by selected sports, date, and active sport chip
  const relevantMatches = matches.filter(m => {
    if (!selectedSports.includes(m.sportId)) return false;
    if (sportFilter && sportFilter !== 'all' && m.sportId !== sportFilter) return false;
    if (dateFilter && m.date !== dateFilter) return false;
    return true;
  });

  const teamMatchesList: Match[] = [];
  const favTournamentsMatchesList: Match[] = [];
  const liveMatches: Match[] = [];

  for (const m of relevantMatches) {
    const isHomeFollowed = selectedTeams.includes(m.homeTeamId);
    const isAwayFollowed = selectedTeams.includes(m.awayTeamId);
    const isTournamentFollowed = selectedTournaments.includes(m.tournamentId);

    if (isHomeFollowed || isAwayFollowed) {
      teamMatchesList.push(m);
      if (m.status === 'LIVE' || m.status === 'HALFTIME') {
        liveMatches.push(m);
      }
    } else if (isTournamentFollowed) {
      favTournamentsMatchesList.push(m);
      if (m.status === 'LIVE' || m.status === 'HALFTIME') {
        liveMatches.push(m);
      }
    }
  }

  // Group by tournament
  const groupByTourney = (list: Match[]) => {
    const groups = new Map<string, Match[]>();
    for (const match of list) {
      const arr = groups.get(match.tournamentId) || [];
      arr.push(match);
      groups.set(match.tournamentId, arr);
    }
    const result: { tournament: Tournament; matches: Match[] }[] = [];
    groups.forEach((items, tId) => {
      const t = tournamentMap.get(tId);
      if (t) {
        result.push({ tournament: t, matches: items });
      }
    });
    return result;
  };

  return {
    liveMatches,
    teamsMatches: groupByTourney(teamMatchesList),
    favoriteTournamentsMatches: groupByTourney(favTournamentsMatchesList),
    allMatchesCount: teamMatchesList.length + favTournamentsMatchesList.length,
  };
}

/**
 * Filter all matches for the global "All Scores" tab.
 */
export function filterAllScoresMatches(
  matches: Match[],
  tournaments: Tournament[],
  sportFilter: SportId | 'all',
  dateFilter: string
): {
  liveMatches: Match[];
  groupedByTournament: { tournament: Tournament; matches: Match[] }[];
  totalMatchesCount: number;
} {
  const tournamentMap = new Map<string, Tournament>();
  tournaments.forEach(t => tournamentMap.set(t.id, t));

  const filtered = matches.filter(m => {
    if (sportFilter !== 'all' && m.sportId !== sportFilter) return false;
    if (m.date !== dateFilter) return false;
    return true;
  });

  const liveMatches = filtered.filter(m => m.status === 'LIVE' || m.status === 'HALFTIME');

  const groups = new Map<string, Match[]>();
  for (const m of filtered) {
    const list = groups.get(m.tournamentId) || [];
    list.push(m);
    groups.set(m.tournamentId, list);
  }

  const groupedByTournament: { tournament: Tournament; matches: Match[] }[] = [];
  groups.forEach((items, tId) => {
    const t = tournamentMap.get(tId);
    if (t) {
      groupedByTournament.push({ tournament: t, matches: items });
    }
  });

  // Sort popular tournaments first
  groupedByTournament.sort((a, b) => {
    if (a.tournament.isPopular && !b.tournament.isPopular) return -1;
    if (!a.tournament.isPopular && b.tournament.isPopular) return 1;
    return a.tournament.nameAr.localeCompare(b.tournament.nameAr, 'ar');
  });

  return {
    liveMatches,
    groupedByTournament,
    totalMatchesCount: filtered.length,
  };
}

/**
 * Compute standings update for football table
 */
export function calculateStandings(
  initialStandings: StandingRow[],
  newMatch: { homeTeamId: string; awayTeamId: string; homeScore: number; awayScore: number }
): StandingRow[] {
  return initialStandings.map(row => {
    if (row.teamId === newMatch.homeTeamId) {
      const isWin = newMatch.homeScore > newMatch.awayScore;
      const isDraw = newMatch.homeScore === newMatch.awayScore;
      const isLoss = newMatch.homeScore < newMatch.awayScore;
      const pts = isWin ? 3 : isDraw ? 1 : 0;
      const formRes: 'W' | 'D' | 'L' = isWin ? 'W' : isDraw ? 'D' : 'L';
      return {
        ...row,
        played: row.played + 1,
        won: row.won + (isWin ? 1 : 0),
        drawn: row.drawn + (isDraw ? 1 : 0),
        lost: row.lost + (isLoss ? 1 : 0),
        goalsFor: row.goalsFor + newMatch.homeScore,
        goalsAgainst: row.goalsAgainst + newMatch.awayScore,
        goalDiff: row.goalDiff + (newMatch.homeScore - newMatch.awayScore),
        points: row.points + pts,
        form: [...row.form.slice(1), formRes],
      };
    }
    if (row.teamId === newMatch.awayTeamId) {
      const isWin = newMatch.awayScore > newMatch.homeScore;
      const isDraw = newMatch.homeScore === newMatch.awayScore;
      const isLoss = newMatch.awayScore < newMatch.homeScore;
      const pts = isWin ? 3 : isDraw ? 1 : 0;
      const formRes: 'W' | 'D' | 'L' = isWin ? 'W' : isDraw ? 'D' : 'L';
      return {
        ...row,
        played: row.played + 1,
        won: row.won + (isWin ? 1 : 0),
        drawn: row.drawn + (isDraw ? 1 : 0),
        lost: row.lost + (isLoss ? 1 : 0),
        goalsFor: row.goalsFor + newMatch.awayScore,
        goalsAgainst: row.goalsAgainst + newMatch.homeScore,
        goalDiff: row.goalDiff + (newMatch.awayScore - newMatch.homeScore),
        points: row.points + pts,
        form: [...row.form.slice(1), formRes],
      };
    }
    return row;
  }).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    return b.goalsFor - a.goalsFor;
  }).map((row, idx) => ({ ...row, rank: idx + 1 }));
}

/**
 * Filter teams according to onboarding rules:
 * Step 3: teams from selected sports AND selected tournaments (or all teams from selected sports if no tournaments chosen).
 */
export function getAvailableTeamsForSelection(
  teams: Team[],
  selectedSports: SportId[],
  selectedTournaments: string[]
): Team[] {
  return teams.filter(team => {
    if (!selectedSports.includes(team.sportId)) return false;
    if (selectedTournaments.length > 0) {
      return selectedTournaments.includes(team.tournamentId);
    }
    return true;
  });
}

/**
 * Search all entities in the app
 */
export function searchEntities(
  query: string,
  teams: Team[],
  tournaments: Tournament[],
  matches: Match[]
): {
  matchedTeams: Team[];
  matchedTournaments: Tournament[];
  matchedMatches: Match[];
} {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { matchedTeams: [], matchedTournaments: [], matchedMatches: [] };
  }

  const matchedTeams = teams.filter(
    t => t.nameAr.toLowerCase().includes(q) || t.nameEn.toLowerCase().includes(q) || t.shortNameAr.toLowerCase().includes(q)
  );

  const matchedTournaments = tournaments.filter(
    t => t.nameAr.toLowerCase().includes(q) || t.nameEn.toLowerCase().includes(q) || t.countryAr.toLowerCase().includes(q)
  );

  const teamNameMap = new Map<string, string>();
  teams.forEach(t => teamNameMap.set(t.id, t.nameAr));

  const matchedMatches = matches.filter(m => {
    const home = teamNameMap.get(m.homeTeamId) || '';
    const away = teamNameMap.get(m.awayTeamId) || '';
    return home.toLowerCase().includes(q) || away.toLowerCase().includes(q) || m.venueAr.toLowerCase().includes(q);
  });

  return { matchedTeams, matchedTournaments, matchedMatches };
}
