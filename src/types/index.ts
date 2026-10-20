export type SportId = 'football' | 'basketball' | 'tennis' | 'american_football' | 'baseball' | 'volleyball' | 'handball';

export interface Sport {
  id: SportId;
  nameAr: string;
  nameEn: string;
  iconName: string;
  matchCount?: number;
}

export interface Tournament {
  id: string;
  sportId: SportId;
  nameAr: string;
  nameEn: string;
  countryAr: string;
  countryEn: string;
  logo: string;
  isPopular?: boolean;
}

export interface Team {
  id: string;
  sportId: SportId;
  tournamentId: string;
  nameAr: string;
  nameEn: string;
  shortNameAr: string;
  logo: string;
  primaryColor: string;
  stadiumAr: string;
  cityAr: string;
  rank?: number;
  points?: number;
}

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'HALFTIME' | 'FINISHED' | 'POSTPONED';

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'sub' | 'var' | 'penalty';
  teamId: string;
  playerAr: string;
  playerEn?: string;
  assistAr?: string;
  subOutAr?: string;
  detailAr: string;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  xG: [number, number];
  dangerousAttacks: [number, number];
  corners: [number, number];
  fouls: [number, number];
  offsides: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Player {
  id: string;
  nameAr: string;
  number: number;
  position: PlayerPosition;
  positionAr: string;
  isStarter: boolean;
  rating?: number;
  x?: number; // pitch coordinates (0-100)
  y?: number;
  goalsThisSeason?: number;
  avatarUrl?: string;
  nationality?: string;
  flagEmoji?: string;
  isCaptain?: boolean;
  isSubbedOut?: boolean;
  isSubbedIn?: boolean;
  subMinute?: number;
  hasInjury?: boolean;
  yellowCards?: number;
  redCards?: number;
  goalsInMatch?: number;
  assistsInMatch?: number;
  stats?: {
    shots?: number;
    passes?: number;
    passAccuracy?: number;
    tackles?: number;
    saves?: number;
    fouls?: number;
    minutesPlayed?: number;
  };
}

export interface CoachInfo {
  nameAr: string;
  nationality?: string;
  roleAr?: string;
}

export interface MissingPlayerInfo {
  id: string;
  nameAr: string;
  number?: number;
  positionAr?: string;
  reasonAr: string;
  type: 'injury' | 'suspension';
}

export interface Lineup {
  formationHome: string;
  formationAway: string;
  isOfficial: boolean;
  homeStarters: Player[];
  homeSubs: Player[];
  awayStarters: Player[];
  awaySubs: Player[];
  homeCoach?: CoachInfo;
  awayCoach?: CoachInfo;
  homeMissing?: MissingPlayerInfo[];
  awayMissing?: MissingPlayerInfo[];
}

export interface PreMatchInsight {
  prediction: {
    homeWinPct: number;
    drawPct: number;
    awayWinPct: number;
  };
  homeForm: ('W' | 'D' | 'L')[];
  awayForm: ('W' | 'D' | 'L')[];
  h2h: {
    homeWins: number;
    draws: number;
    awayWins: number;
    lastMatches: {
      date: string;
      homeScore: number;
      awayScore: number;
      winner: 'home' | 'away' | 'draw';
    }[];
  };
}

export interface LiveTrackerEntry {
  id: string;
  minute: number;
  textAr: string;
  type: 'danger' | 'goal' | 'corner' | 'card' | 'var' | 'normal';
  teamId?: string;
}

export interface Match {
  id: string;
  sportId: SportId;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  status: MatchStatus;
  minute?: number;
  homeScore: number;
  awayScore: number;
  startTime: string; // e.g. "21:00"
  date: string; // "YYYY-MM-DD"
  venueAr: string;
  refereeAr?: string;
  roundAr: string;
  events: MatchEvent[];
  stats: MatchStats;
  lineup: Lineup;
  insights: PreMatchInsight;
  liveTracker: LiveTrackerEntry[];
  sportScoresDetail?: {
    type: 'quarters' | 'sets' | 'innings';
    homePeriods: number[];
    awayPeriods: number[];
  };
}

export interface StandingRow {
  rank: number;
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface NewsItem {
  id: string;
  titleAr: string;
  summaryAr: string;
  contentAr: string;
  category: 'transfers' | 'teams' | 'tournaments' | 'buzz';
  categoryAr: string;
  sportId: SportId;
  teamIds: string[];
  tournamentId?: string;
  image: string;
  publishedAtAr: string;
  readTimeAr: string;
  videoUrl?: string;
  duration?: string;
  isBuzz?: boolean;
}

export interface UserPreferences {
  selectedSports: SportId[];
  selectedTournaments: string[];
  selectedTeams: string[];
  starredTeamIds: string[];
  starredMatchIds: string[];
}

export interface NotificationSettings {
  goals: boolean;
  redCardsVar: boolean;
  preMatchReminder: boolean;
  lineupsAnnounced: boolean;
  finalResult: boolean;
  soundEnabled: boolean;
  matchSpecific: Record<string, boolean>;
  teamSpecific: Record<string, boolean>;
}
