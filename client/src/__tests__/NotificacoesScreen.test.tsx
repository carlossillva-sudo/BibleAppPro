import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// mock notification service to avoid localStorage
vi.mock('../services/notificationService', () => ({
  getScheduledNotifications: vi.fn(() => []),
  scheduleDailyVerseNotification: vi.fn(),
  scheduleReadingReminder: vi.fn(),
  cancelAllNotifications: vi.fn(),
  requestPermission: vi.fn(async () => 'granted'),
}));

// mock notification store to remove persistence with real update logic
vi.mock('../store/notificationStore', () => {
  const create = require('zustand').create;
  const store = create((set) => ({
    notificationsEnabled: false,
    dailyVerseEnabled: false,
    readingReminderEnabled: false,
    selectedTimeDailyVerse: '08:00',
    selectedTimeReadingReminder: '18:00',
    vibrationEnabled: true,
    soundEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    toggleNotifications: (v) => set((s) => ({ notificationsEnabled: v ?? !s.notificationsEnabled })),
    toggleDailyVerse: (v) => set((s) => ({ dailyVerseEnabled: v ?? !s.dailyVerseEnabled })),
    toggleReadingReminder: (v) => set((s) => ({ readingReminderEnabled: v ?? !s.readingReminderEnabled })),
    setDailyTime: (t) => set({ selectedTimeDailyVerse: t }),
    setReadingTime: (t) => set({ selectedTimeReadingReminder: t }),
    toggleVibration: (v) => set((s) => ({ vibrationEnabled: v ?? !s.vibrationEnabled })),
    toggleSound: (v) => set((s) => ({ soundEnabled: v ?? !s.soundEnabled })),
    setQuietHours: (s,e) => set({ quietHoursStart: s, quietHoursEnd: e }),
  }));
  return { useNotificationStore: store };
});

import { useNotificationStore } from '../store/notificationStore';
import NotificacoesScreen from '../screens/NotificacoesScreen';

// reset store before each run
beforeEach(() => {
  useNotificationStore.setState({
    notificationsEnabled: false,
    dailyVerseEnabled: false,
    readingReminderEnabled: false,
  });
});

describe('NotificacoesScreen', () => {
  it('renders header and sections', () => {
    render(
      <MemoryRouter>
        <NotificacoesScreen />
      </MemoryRouter>
    );
    expect(screen.getByText('Notificações.')).toBeTruthy();
    expect(screen.getByText('Ativar Notificações')).toBeTruthy();
  });

  it('toggles notificationsEnabled when switch clicked', () => {
    render(
      <MemoryRouter>
        <NotificacoesScreen />
      </MemoryRouter>
    );
    const toggle = screen.getByText('Ativar Notificações').closest('div')?.querySelector('input');
    expect(toggle).toBeTruthy();
    if (toggle) {
      fireEvent.click(toggle);
      expect(useNotificationStore.getState().notificationsEnabled).toBe(true);
    }
  });
});