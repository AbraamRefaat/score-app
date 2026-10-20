import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Splash } from './components/Splash.tsx';
import { Onboarding } from './components/Onboarding.tsx';
import { Header } from './components/Header.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { MyScoresTab } from './components/tabs/MyScoresTab.tsx';
import { AllScoresTab } from './components/tabs/AllScoresTab.tsx';
import { NewsTab } from './components/tabs/NewsTab.tsx';
import { MoreTab } from './components/tabs/MoreTab.tsx';
import { MatchDetailsModal } from './components/modals/MatchDetailsModal.tsx';
import { TeamProfileModal } from './components/modals/TeamProfileModal.tsx';
import { TournamentModal } from './components/modals/TournamentModal.tsx';
import { FavoritesPage } from './components/modals/FavoritesPage.tsx';
import { NotificationSettingsModal } from './components/modals/NotificationSettingsModal.tsx';
import { NewsDetailModal } from './components/modals/NewsDetailModal.tsx';
import { SearchModal } from './components/modals/SearchModal.tsx';
import { LoadingSkeleton } from './components/common/LoadingSkeleton.tsx';
import { ErrorView } from './components/common/ErrorView.tsx';

const MainAppContent: React.FC = () => {
  const {
    showSplash,
    hasCompletedOnboarding,
    activeTab,
    activeModal,
    uiState,
    deviceFrame,
    setDeviceFrame,
  } = useApp();

  // 1. Splash Screen
  if (showSplash) {
    return <Splash />;
  }

  // 2. Onboarding Survey (First Launch)
  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  // 3. Main App View Content
  const renderTabContent = () => {
    if (uiState === 'loading') {
      return <LoadingSkeleton />;
    }
    if (uiState === 'error') {
      return <ErrorView />;
    }

    switch (activeTab) {
      case 'my_scores':
        return <MyScoresTab />;
      case 'all_scores':
        return <AllScoresTab />;
      case 'news':
        return <NewsTab />;
      case 'more':
        return <MoreTab />;
      default:
        return <MyScoresTab />;
    }
  };

  const appView = (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col relative w-full max-w-lg mx-auto border-x border-neutral-900 shadow-2xl">
      <Header />
      <main className="flex-1 overflow-x-hidden">{renderTabContent()}</main>
      <BottomNav />

      {/* Modal Router */}
      {activeModal?.type === 'match_details' && (
        <MatchDetailsModal matchId={activeModal.matchId} />
      )}
      {activeModal?.type === 'team_profile' && (
        <TeamProfileModal teamId={activeModal.teamId} />
      )}
      {activeModal?.type === 'tournament_page' && (
        <TournamentModal tournamentId={activeModal.tournamentId} />
      )}
      {activeModal?.type === 'favorites_page' && (
        <FavoritesPage initialTab={activeModal.initialTab} />
      )}
      {activeModal?.type === 'notification_settings' && (
        <NotificationSettingsModal targetMatchId={activeModal.targetMatchId} />
      )}
      {activeModal?.type === 'news_detail' && (
        <NewsDetailModal newsId={activeModal.newsId} />
      )}
      {activeModal?.type === 'search' && <SearchModal />}
    </div>
  );

  return appView;
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
