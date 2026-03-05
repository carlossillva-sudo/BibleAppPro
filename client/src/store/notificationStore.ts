import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationState {
  notificationsEnabled: boolean;
  dailyVerseEnabled: boolean;
  readingReminderEnabled: boolean;
  selectedTimeDailyVerse: string;
  selectedTimeReadingReminder: string;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;

  toggleNotifications: (v?: boolean) => void;
  toggleDailyVerse: (v?: boolean) => void;
  toggleReadingReminder: (v?: boolean) => void;
  setDailyTime: (t: string) => void;
  setReadingTime: (t: string) => void;
  toggleVibration: (v?: boolean) => void;
  toggleSound: (v?: boolean) => void;
  setQuietHours: (start: string, end: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
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
      setQuietHours: (start, end) => set({ quietHoursStart: start, quietHoursEnd: end }),
    }),
    {
      name: 'notification-store',
    }
  )
);
