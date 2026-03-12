import React from 'react';
// Lazy import for the new toast demo page
const ToastDemoPage = React.lazy(() =>
  import('./pages/ToastDemoPage').then((m) => ({ default: m.default || m }))
);
const TopBarDemoPage = React.lazy(() =>
  import('./pages/TopBarDemoPage').then((m) => ({ default: m.default || m }))
);
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { MainLayout } from './components/layout/MainLayout';

const LoginPage = React.lazy(() =>
  import('./pages/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = React.lazy(() =>
  import('./pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const DashboardPage = React.lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const ReaderPage = React.lazy(() =>
  import('./pages/ReaderPage').then((m) => ({ default: m.ReaderPage }))
);
const SearchPage = React.lazy(() =>
  import('./pages/SearchPage').then((m) => ({ default: m.SearchPage }))
);
const FavoritesPage = React.lazy(() =>
  import('./pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage }))
);
const ReadingPlansPage = React.lazy(() =>
  import('./pages/ReadingPlansPage').then((m) => ({ default: m.ReadingPlansPage }))
);
const PrayerJournalPage = React.lazy(() =>
  import('./pages/PrayerJournalPage').then((m) => ({ default: m.PrayerJournalPage }))
);
const ToolsStatsPage = React.lazy(() =>
  import('./pages/ToolsStatsPage').then((m) => ({ default: m.ToolsStatsPage }))
);
const SettingsPage = React.lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const GoogleIntegrationPage = React.lazy(() =>
  import('./pages/GoogleIntegrationPage').then((m) => ({
    default: m.default || m.GoogleIntegrationPage,
  }))
);
const PersonalizationPage = React.lazy(() =>
  import('./pages/PersonalizationPage').then((m) => ({ default: m.PersonalizationPage }))
);
const DevotionalsPage = React.lazy(() =>
  import('./pages/DevotionalsPage').then((m) => ({ default: m.DevotionalsPage }))
);
const BackupSettingsPage = React.lazy(() =>
  import('./pages/BackupSettingsPage').then((m) => ({ default: m.BackupSettingsPage }))
);
const ShareAppPage = React.lazy(() =>
  import('./pages/ShareAppPage').then((m) => ({ default: m.ShareAppPage }))
);
const ChallengesPage = React.lazy(() =>
  import('./pages/ChallengesPage').then((m) => ({ default: m.ChallengesPage }))
);
const NotesPage = React.lazy(() =>
  import('./pages/NotesPage').then((m) => ({ default: m.NotesPage }))
);
const AboutPage = React.lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const PrivacyPage = React.lazy(() =>
  import('./pages/PrivacyPage').then((m) => ({ default: m.default || m.PrivacyPage }))
);
const LibraryPage = React.lazy(() =>
  import('./pages/LibraryPage').then((m) => ({ default: m.LibraryPage }))
);
const DownloadsPage = React.lazy(() =>
  import('./pages/DownloadsPage').then((m) => ({ default: m.default || m.DownloadsPage }))
);
const NotificacoesScreen = React.lazy(() =>
  import('./screens/NotificacoesScreen').then((m) => ({ default: m.default }))
);

const ChatPage = React.lazy(() =>
  import('./pages/ChatPage').then((m) => ({ default: m.ChatPage }))
);

const ReflectionsPage = React.lazy(() =>
  import('./pages/ReflectionsPage').then((m) => ({ default: m.ReflectionsPage }))
);

const PremiumPage = React.lazy(() =>
  import('./pages/PremiumPage').then((m) => ({ default: m.PremiumPage }))
);

const Home = React.lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));

const Studio = React.lazy(() => import('./pages/Studio').then((m) => ({ default: m.Studio })));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout>{children}</MainLayout>;
};

const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

export const routes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/dashboard',
    element: (
      <Protected>
        <DashboardPage />
      </Protected>
    ),
  },
  {
    path: '/reader',
    element: (
      <Protected>
        <ReaderPage />
      </Protected>
    ),
  },
  {
    path: '/reader/:bookId/:chapterId',
    element: (
      <Protected>
        <ReaderPage />
      </Protected>
    ),
  },
  {
    path: '/search',
    element: (
      <Protected>
        <SearchPage />
      </Protected>
    ),
  },
  {
    path: '/favorites',
    element: (
      <Protected>
        <FavoritesPage />
      </Protected>
    ),
  },
  {
    path: '/plans',
    element: (
      <Protected>
        <ReadingPlansPage />
      </Protected>
    ),
  },
  {
    path: '/journal',
    element: (
      <Protected>
        <PrayerJournalPage />
      </Protected>
    ),
  },
  {
    path: '/devotionals',
    element: (
      <Protected>
        <DevotionalsPage />
      </Protected>
    ),
  },
  {
    path: '/notes',
    element: (
      <Protected>
        <NotesPage />
      </Protected>
    ),
  },
  {
    path: '/stats',
    element: (
      <Protected>
        <ToolsStatsPage />
      </Protected>
    ),
  },
  {
    path: '/settings',
    element: (
      <Protected>
        <SettingsPage />
      </Protected>
    ),
  },
  {
    path: '/settings/google',
    element: (
      <Protected>
        <GoogleIntegrationPage />
      </Protected>
    ),
  },
  {
    path: '/personalization',
    element: (
      <Protected>
        <PersonalizationPage />
      </Protected>
    ),
  },
  {
    path: '/share',
    element: (
      <Protected>
        <ShareAppPage />
      </Protected>
    ),
  },
  {
    path: '/challenges',
    element: (
      <Protected>
        <ChallengesPage />
      </Protected>
    ),
  },
  {
    path: '/settings/backup',
    element: (
      <Protected>
        <BackupSettingsPage />
      </Protected>
    ),
  },
  {
    path: '/about',
    element: (
      <Protected>
        <AboutPage />
      </Protected>
    ),
  },
  {
    path: '/privacidade',
    element: (
      <Protected>
        <PrivacyPage />
      </Protected>
    ),
  },
  {
    path: '/downloads',
    element: (
      <Protected>
        <DownloadsPage />
      </Protected>
    ),
  },
  {
    path: '/library',
    element: (
      <Protected>
        <LibraryPage />
      </Protected>
    ),
  },
  {
    path: '/notificacoes',
    element: (
      <Protected>
        <NotificacoesScreen />
      </Protected>
    ),
  },
  {
    path: '/chat',
    element: (
      <Protected>
        <ChatPage />
      </Protected>
    ),
  },
  {
    path: '/reflections',
    element: (
      <Protected>
        <ReflectionsPage />
      </Protected>
    ),
  },
  {
    path: '/premium',
    element: <PremiumPage />,
  },
  {
    path: '/home',
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: '/studio',
    element: (
      <Protected>
        <Studio />
      </Protected>
    ),
  },
  {
    path: '/toast-demo',
    element: (
      <Protected>
        <ToastDemoPage />
      </Protected>
    ),
  },
  {
    path: '/topbar-demo',
    element: (
      <Protected>
        <TopBarDemoPage />
      </Protected>
    ),
  },
  { path: '/', element: <Navigate to="/dashboard" /> },
  { path: '*', element: <Navigate to="/dashboard" /> },
];
