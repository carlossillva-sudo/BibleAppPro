import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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

import { MainLayout } from './components/layout/MainLayout';
import { useAuthStore } from './store/authStore';

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<P><DashboardPage /></P>} />
          <Route path="/reader" element={<P><ReaderPage /></P>} />
          <Route path="/reader/:bookId/:chapterId" element={<P><ReaderPage /></P>} />
          <Route path="/search" element={<P><SearchPage /></P>} />
          <Route path="/favorites" element={<P><FavoritesPage /></P>} />
          <Route path="/plans" element={<P><ReadingPlansPage /></P>} />
          <Route path="/journal" element={<P><PrayerJournalPage /></P>} />
          <Route path="/devotionals" element={<P><DevotionalsPage /></P>} />
          <Route path="/reflections" element={<P><ReflectionsPage /></P>} />
          <Route path="/stats" element={<P><ToolsStatsPage /></P>} />
          <Route path="/settings" element={<P><SettingsPage /></P>} />
          <Route path="/premium" element={<P><PremiumPage /></P>} />
          <Route path="/personalization" element={<P><PersonalizationPage /></P>} />
          <Route path="/share" element={<P><ShareAppPage /></P>} />
          <Route path="/settings/backup" element={<P><BackupSettingsPage /></P>} />
          <Route path="/about" element={<P><AboutPage /></P>} />
          <Route path="/library" element={<P><LibraryPage /></P>} />
          <Route path="/chat" element={<P><ChatPage /></P>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
