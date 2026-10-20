import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  SportId,
  Match,
  Team,
  Tournament,
  UserPreferences,
  NotificationSettings,
  NewsItem,
  StandingRow,
} from '../types/index.ts';
import {
  ALL_SPORTS,
  ALL_TOURNAMENTS,
  ALL_TEAMS,
  INITIAL_MATCHES,
  INITIAL_NEWS,
  STANDINGS_DATA,
  DEFAULT_PREFERENCES,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '../data/mockData.ts';

export type ActiveTab = 'my_scores' | 'all_scores' | 'news' | 'more';

export type ActiveModal =
  | { type: 'match_details'; matchId: string }
  | { type: 'team_profile'; teamId: string }
  | { type: 'tournament_page'; tournamentId: string }
  | { type: 'favorites_page'; initialTab?: 'all' | 'teams' | 'tournaments' | 'sports' }
  | { type: 'notification_settings'; targetMatchId?: string }
  | { type: 'news_detail'; newsId: string }
  | { type: 'search' }
  | null;

export type UIState = 'ready' | 'loading' | 'error' | 'empty';

interface AppContextType {
  // Splash & Onboarding
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (prefs: UserPreferences) => void;
  resetToOnboarding: () => void;

  // Preferences
  preferences: UserPreferences;
  toggleSportPreference: (sportId: SportId) => void;
  toggleTournamentPreference: (tournamentId: string) => void;
  toggleTeamPreference: (teamId: string) => void;
  toggleStarTeam: (teamId: string) => void;
  toggleStarMatch: (matchId: string) => void;
  updatePreferences: (newPrefs: Partial<UserPreferences>) => void;

  // Navigation & Modals
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeModal: ActiveModal;
  openModal: (modal: ActiveModal) => void;
  closeModal: () => void;
  modalHistory: ActiveModal[];

  // Data & Filters
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  activeSportFilter: SportId | 'all';
  setActiveSportFilter: (sport: SportId | 'all') => void;

  // Sports Entities
  sports: typeof ALL_SPORTS;
  tournaments: Tournament[];
  teams: Team[];
  matches: Match[];
  news: NewsItem[];
  standings: Record<string, StandingRow[]>;

  // Notifications
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  toggleMatchNotification: (matchId: string) => void;
  toggleTeamNotification: (teamId: string) => void;

  // Simulation & States
  uiState: UIState;
  setUiState: (state: UIState) => void;
  isLiveSimulationActive: boolean;
  setIsLiveSimulationActive: (active: boolean) => void;
  deviceFrame: boolean;
  setDeviceFrame: (enabled: boolean) => void;
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check URL query param for autostart
  const isAutostart = typeof window !== 'undefined' && window.location.search.includes('autostart=1');

  // Persistence keys
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    if (isAutostart) return true;
    const stored = localStorage.getItem('matchplus_onboarded');
    return stored === 'true';
  });

  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (isAutostart) return false;
    return true;
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    try {
      const stored = localStorage.getItem('matchplus_preferences');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_PREFERENCES;
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS;
    try {
      const stored = localStorage.getItem('matchplus_notifications');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  });

  // Navigation states
  const [activeTab, setActiveTab] = useState<ActiveTab>('my_scores');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [modalHistory, setModalHistory] = useState<ActiveModal[]>([]);

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-19');
  const [activeSportFilter, setActiveSportFilter] = useState<SportId | 'all'>('all');

  // Data states
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [news] = useState<NewsItem[]>(INITIAL_NEWS);
  const [tournaments] = useState<Tournament[]>(ALL_TOURNAMENTS);
  const [teams] = useState<Team[]>(ALL_TEAMS);
  const [standings] = useState<Record<string, StandingRow[]>>(STANDINGS_DATA);

  // Testing & Display States
  const [uiState, setUiState] = useState<UIState>('ready');
  const [isLiveSimulationActive, setIsLiveSimulationActive] = useState<boolean>(true);
  const [deviceFrame, setDeviceFrame] = useState<boolean>(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  // Sync dir and lang on document
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Save preferences
  useEffect(() => {
    try {
      localStorage.setItem('matchplus_preferences', JSON.stringify(preferences));
    } catch (e) {
      console.warn('Could not save preferences', e);
    }
  }, [preferences]);

  // Save notifications
  useEffect(() => {
    try {
      localStorage.setItem('matchplus_notifications', JSON.stringify(notificationSettings));
    } catch (e) {
      console.warn('Could not save notifications', e);
    }
  }, [notificationSettings]);

  // Live match simulator: advance minute and simulated commentary every 10 seconds
  useEffect(() => {
    if (!isLiveSimulationActive) return;
    const interval = setInterval(() => {
      setMatches(prevMatches =>
        prevMatches.map(m => {
          if (m.status !== 'LIVE') return m;
          const currentMin = m.minute || 70;
          const nextMin = currentMin >= 90 ? 90 : currentMin + 1;

          // Occasionally add live tracker commentary
          let updatedTracker = m.liveTracker;
          if (nextMin === 78 && m.id === 'match-ahly-zamalek') {
            updatedTracker = [
              {
                id: `lt-${Date.now()}`,
                minute: 78,
                textAr: 'فرصة خطيرة جداً! انفراد ضائع من إمام عاشور بعد مراوغة الحارس لكن الدفاع ينقذ الكرة من على خط المرمى!',
                type: 'danger',
                teamId: 'ahly',
              },
              ...m.liveTracker,
            ];
          }

          return {
            ...m,
            minute: nextMin,
            liveTracker: updatedTracker,
          };
        })
      );
    }, 12000);
    return () => clearInterval(interval);
  }, [isLiveSimulationActive]);

  const completeOnboarding = (prefs: UserPreferences) => {
    setPreferences(prefs);
    setHasCompletedOnboarding(true);
    localStorage.setItem('matchplus_onboarded', 'true');
    setShowSplash(false);
  };

  const resetToOnboarding = () => {
    setHasCompletedOnboarding(false);
    localStorage.removeItem('matchplus_onboarded');
    closeModal();
    setActiveTab('my_scores');
  };

  const toggleSportPreference = (sportId: SportId) => {
    setPreferences(prev => {
      const exists = prev.selectedSports.includes(sportId);
      const updated = exists
        ? prev.selectedSports.filter(s => s !== sportId)
        : [...prev.selectedSports, sportId];
      return { ...prev, selectedSports: updated };
    });
  };

  const toggleTournamentPreference = (tournamentId: string) => {
    setPreferences(prev => {
      const exists = prev.selectedTournaments.includes(tournamentId);
      const updated = exists
        ? prev.selectedTournaments.filter(t => t !== tournamentId)
        : [...prev.selectedTournaments, tournamentId];
      return { ...prev, selectedTournaments: updated };
    });
  };

  const toggleTeamPreference = (teamId: string) => {
    setPreferences(prev => {
      const exists = prev.selectedTeams.includes(teamId);
      const updatedTeams = exists
        ? prev.selectedTeams.filter(t => t !== teamId)
        : [...prev.selectedTeams, teamId];
      // If team is removed, also remove from starred
      const updatedStarred = exists
        ? prev.starredTeamIds.filter(t => t !== teamId)
        : prev.starredTeamIds;
      return { ...prev, selectedTeams: updatedTeams, starredTeamIds: updatedStarred };
    });
  };

  const toggleStarTeam = (teamId: string) => {
    setPreferences(prev => {
      const isStarred = prev.starredTeamIds.includes(teamId);
      const updatedStarred = isStarred
        ? prev.starredTeamIds.filter(t => t !== teamId)
        : [...prev.starredTeamIds, teamId];
      // ensure team is in selected teams
      const updatedTeams = prev.selectedTeams.includes(teamId)
        ? prev.selectedTeams
        : [...prev.selectedTeams, teamId];
      return { ...prev, starredTeamIds: updatedStarred, selectedTeams: updatedTeams };
    });
  };

  const toggleStarMatch = (matchId: string) => {
    setPreferences(prev => {
      const isStarred = prev.starredMatchIds.includes(matchId);
      const updated = isStarred
        ? prev.starredMatchIds.filter(m => m !== matchId)
        : [...prev.starredMatchIds, matchId];
      return { ...prev, starredMatchIds: updated };
    });
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  const openModal = (modal: ActiveModal) => {
    if (activeModal) {
      setModalHistory(prev => [...prev, activeModal]);
    }
    setActiveModal(modal);
  };

  const closeModal = () => {
    if (modalHistory.length > 0) {
      const prev = modalHistory[modalHistory.length - 1];
      setModalHistory(old => old.slice(0, old.length - 1));
      setActiveModal(prev);
    } else {
      setActiveModal(null);
    }
  };

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  };

  const toggleMatchNotification = (matchId: string) => {
    setNotificationSettings(prev => {
      const current = !!prev.matchSpecific[matchId];
      return {
        ...prev,
        matchSpecific: { ...prev.matchSpecific, [matchId]: !current },
      };
    });
  };

  const toggleTeamNotification = (teamId: string) => {
    setNotificationSettings(prev => {
      const current = !!prev.teamSpecific[teamId];
      return {
        ...prev,
        teamSpecific: { ...prev.teamSpecific, [teamId]: !current },
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        showSplash,
        setShowSplash,
        hasCompletedOnboarding,
        completeOnboarding,
        resetToOnboarding,
        preferences,
        toggleSportPreference,
        toggleTournamentPreference,
        toggleTeamPreference,
        toggleStarTeam,
        toggleStarMatch,
        updatePreferences,
        activeTab,
        setActiveTab,
        activeModal,
        openModal,
        closeModal,
        modalHistory,
        selectedDate,
        setSelectedDate,
        activeSportFilter,
        setActiveSportFilter,
        sports: ALL_SPORTS,
        tournaments,
        teams,
        matches,
        news,
        standings,
        notificationSettings,
        updateNotificationSettings,
        toggleMatchNotification,
        toggleTeamNotification,
        uiState,
        setUiState,
        isLiveSimulationActive,
        setIsLiveSimulationActive,
        deviceFrame,
        setDeviceFrame,
        language,
        setLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
