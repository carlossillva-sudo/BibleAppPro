import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { MainLayout } from './components/layout/MainLayout';

const LoginPage = React.lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ReaderPage = React.lazy(() => import('./pages/ReaderPage').then(m => ({ default: m.ReaderPage })));
const SearchPage = React.lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const FavoritesPage = React.lazy(() => import('./pages/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const ReadingPlansPage = React.lazy(() => import('./pages/ReadingPlansPage').then(m => ({ default: m.ReadingPlansPage })));
const PrayerJournalPage = React.lazy(() => import('./pages/PrayerJournalPage').then(m => ({ default: m.PrayerJournalPage })));
const ToolsStatsPage = React.lazy(() => import('./pages/ToolsStatsPage').then(m => ({ default: m.ToolsStatsPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const PremiumPage = React.lazy(() => import('./pages/PremiumPage').then(m => ({ default: m.PremiumPage })));
const PersonalizationPage = React.lazy(() => import('./pages/PersonalizationPage').then(m => ({ default: m.PersonalizationPage })));
const DevotionalsPage = React.lazy(() => import('./pages/DevotionalsPage').then(m => ({ default: m.DevotionalsPage })));
const ReflectionsPage = React.lazy(() => import('./pages/ReflectionsPage').then(m => ({ default: m.ReflectionsPage })));
const BackupSettingsPage = React.lazy(() => import('./pages/BackupSettingsPage').then(m => ({ default: m.BackupSettingsPage })));
const ShareAppPage = React.lazy(() => import('./pages/ShareAppPage').then(m => ({ default: m.ShareAppPage })));
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const LibraryPage = React.lazy(() => import('./pages/LibraryPage').then(m => ({ default: m.LibraryPage })));
const ChatPage = React.lazy(() => import('./pages/ChatPage').then(m => ({ default: m.ChatPage })));
const NotificacoesScreen = React.lazy(() => import('./screens/NotificacoesScreen').then(m => ({ default: m.default })));

// wrapper which redirects unauthenticated users to login
const Protected: React.FC<{children: React.ReactNode}> = ({children}) => {
  const isAuthenticated = useAuthStore(s=>s.isAuthenticated);
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
};

export const routes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/dashboard', element: <Protected><DashboardPage /></Protected> },
  { path: '/reader', element: <Protected><ReaderPage /></Protected> },
  { path: '/reader/:bookId/:chapterId', element: <Protected><ReaderPage /></Protected> },
  { path: '/search', element: <Protected><SearchPage /></Protected> },
  { path: '/favorites', element: <Protected><FavoritesPage /></Protected> },
  { path: '/plans', element: <Protected><ReadingPlansPage /></Protected> },
  { path: '/journal', element: <Protected><PrayerJournalPage /></Protected> },
  { path: '/devotionals', element: <Protected><DevotionalsPage /></Protected> },
  { path: '/reflections', element: <Protected><ReflectionsPage /></Protected> },
  { path: '/stats', element: <Protected><ToolsStatsPage /></Protected> },
  { path: '/settings', element: <Protected><SettingsPage /></Protected> },
  { path: '/premium', element: <Protected><PremiumPage /></Protected> },
  { path: '/personalization', element: <Protected><PersonalizationPage /></Protected> },
  { path: '/share', element: <Protected><ShareAppPage /></Protected> },
  { path: '/settings/backup', element: <Protected><BackupSettingsPage /></Protected> },
  { path: '/about', element: <Protected><AboutPage /></Protected> },
  { path: '/library', element: <Protected><LibraryPage /></Protected> },
  { path: '/chat', element: <Protected><ChatPage /></Protected> },
  { path: '/notificacoes', element: <Protected><NotificacoesScreen /></Protected> },
  { path: '/', element: <Navigate to="/dashboard" /> },
  { path: '*', element: <Navigate to="/dashboard" /> },
];
