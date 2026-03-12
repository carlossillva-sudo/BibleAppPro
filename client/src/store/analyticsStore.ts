import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DailyStats {
  date: string;
  chaptersRead: number;
  timeSpent: number;
  searches: number;
  notesCreated: number;
}

export interface BookStats {
  bookId: number;
  bookName: string;
  chaptersRead: number;
  lastRead: string | null;
}

export interface WeeklyHeatmapData {
  date: string;
  value: number;
}

interface AnalyticsState {
  dailyStats: DailyStats[];
  bookStats: BookStats[];
  totalTimeSpent: number;

  recordChapterRead: (bookId: number, bookName: string) => void;
  recordSearch: () => void;
  recordNoteCreated: () => void;
  recordTimeSpent: (minutes: number) => void;
  getTodayStats: () => DailyStats | undefined;
  getWeeklyData: () => WeeklyHeatmapData[];
  getMonthlyData: () => DailyStats[];
  getBookStats: (bookId: number) => BookStats | undefined;
  getTotalChaptersThisWeek: () => number;
  getTotalChaptersThisMonth: () => number;
  getAverageDailyReading: () => number;
}

const getDateString = (date: Date = new Date()) => date.toISOString().split('T')[0];

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      dailyStats: [],
      bookStats: [],
      totalTimeSpent: 0,

      recordChapterRead: (bookId, bookName) => {
        const today = getDateString();

        set((state) => {
          const existingDayIndex = state.dailyStats.findIndex((d) => d.date === today);

          let newDailyStats = [...state.dailyStats];
          if (existingDayIndex >= 0) {
            newDailyStats[existingDayIndex] = {
              ...newDailyStats[existingDayIndex],
              chaptersRead: newDailyStats[existingDayIndex].chaptersRead + 1,
            };
          } else {
            newDailyStats.push({
              date: today,
              chaptersRead: 1,
              timeSpent: 0,
              searches: 0,
              notesCreated: 0,
            });
          }

          const existingBookIndex = state.bookStats.findIndex((b) => b.bookId === bookId);
          let newBookStats = [...state.bookStats];
          if (existingBookIndex >= 0) {
            newBookStats[existingBookIndex] = {
              ...newBookStats[existingBookIndex],
              chaptersRead: newBookStats[existingBookIndex].chaptersRead + 1,
              lastRead: today,
            };
          } else {
            newBookStats.push({
              bookId,
              bookName,
              chaptersRead: 1,
              lastRead: today,
            });
          }

          return {
            dailyStats: newDailyStats,
            bookStats: newBookStats,
          };
        });
      },

      recordSearch: () => {
        const today = getDateString();

        set((state) => {
          const existingDayIndex = state.dailyStats.findIndex((d) => d.date === today);

          let newDailyStats = [...state.dailyStats];
          if (existingDayIndex >= 0) {
            newDailyStats[existingDayIndex] = {
              ...newDailyStats[existingDayIndex],
              searches: newDailyStats[existingDayIndex].searches + 1,
            };
          } else {
            newDailyStats.push({
              date: today,
              chaptersRead: 0,
              timeSpent: 0,
              searches: 1,
              notesCreated: 0,
            });
          }

          return { dailyStats: newDailyStats };
        });
      },

      recordNoteCreated: () => {
        const today = getDateString();

        set((state) => {
          const existingDayIndex = state.dailyStats.findIndex((d) => d.date === today);

          let newDailyStats = [...state.dailyStats];
          if (existingDayIndex >= 0) {
            newDailyStats[existingDayIndex] = {
              ...newDailyStats[existingDayIndex],
              notesCreated: newDailyStats[existingDayIndex].notesCreated + 1,
            };
          } else {
            newDailyStats.push({
              date: today,
              chaptersRead: 0,
              timeSpent: 0,
              searches: 0,
              notesCreated: 1,
            });
          }

          return { dailyStats: newDailyStats };
        });
      },

      recordTimeSpent: (minutes) => {
        set((state) => ({
          totalTimeSpent: state.totalTimeSpent + minutes,
        }));
      },

      getTodayStats: () => {
        const today = getDateString();
        return get().dailyStats.find((d) => d.date === today);
      },

      getWeeklyData: () => {
        const weekData: WeeklyHeatmapData[] = [];

        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const dateStr = getDateString(date);

          const dayStats = get().dailyStats.find((d) => d.date === dateStr);
          weekData.push({
            date: dateStr,
            value: dayStats?.chaptersRead || 0,
          });
        }

        return weekData;
      },

      getMonthlyData: () => {
        const today = new Date();
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthData: DailyStats[] = [];

        for (let d = new Date(monthStart); d <= today; d.setDate(d.getDate() + 1)) {
          const dateStr = getDateString(d);
          const dayStats = get().dailyStats.find((stat) => stat.date === dateStr);
          monthData.push(
            dayStats || {
              date: dateStr,
              chaptersRead: 0,
              timeSpent: 0,
              searches: 0,
              notesCreated: 0,
            }
          );
        }

        return monthData;
      },

      getBookStats: (bookId) => {
        return get().bookStats.find((b) => b.bookId === bookId);
      },

      getTotalChaptersThisWeek: () => {
        const weekData = get().getWeeklyData();
        return weekData.reduce((sum, day) => sum + day.value, 0);
      },

      getTotalChaptersThisMonth: () => {
        const monthData = get().getMonthlyData();
        return monthData.reduce((sum, day) => sum + day.chaptersRead, 0);
      },

      getAverageDailyReading: () => {
        const stats = get().dailyStats;
        if (stats.length === 0) return 0;

        const total = stats.reduce((sum, day) => sum + day.chaptersRead, 0);
        return Math.round((total / stats.length) * 10) / 10;
      },
    }),
    {
      name: 'bibleapp-analytics',
    }
  )
);
