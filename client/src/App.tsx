import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReaderPage } from './pages/ReaderPage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ReadingPlansPage } from './pages/ReadingPlansPage';
import { PrayerJournalPage } from './pages/PrayerJournalPage';
import { ToolsStatsPage } from './pages/ToolsStatsPage';
import { SettingsPage } from './pages/SettingsPage';
import { PremiumPage } from './pages/PremiumPage';
import { PersonalizationPage } from './pages/PersonalizationPage';
import { PersonalizationAdvancedPage } from './pages/PersonalizationAdvancedPage';
import { MainLayout } from './components/layout/MainLayout';
import { useAuthStore } from './store/authStore';

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<P><DashboardPage /></P>} />
        <Route path="/reader" element={<P><DashboardPage /></P>} />
        <Route path="/reader/:bookId/:chapterId" element={<P><ReaderPage /></P>} />
        <Route path="/search" element={<P><SearchPage /></P>} />
        <Route path="/favorites" element={<P><FavoritesPage /></P>} />
        <Route path="/plans" element={<P><ReadingPlansPage /></P>} />
        <Route path="/journal" element={<P><PrayerJournalPage /></P>} />
        <Route path="/stats" element={<P><ToolsStatsPage /></P>} />
        <Route path="/settings" element={<P><SettingsPage /></P>} />
        <Route path="/premium" element={<P><PremiumPage /></P>} />
        <Route path="/personalization" element={<P><PersonalizationPage /></P>} />
        <Route path="/personalization-advanced" element={<P><PersonalizationAdvancedPage /></P>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
