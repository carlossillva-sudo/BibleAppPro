import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'reading' | 'streak' | 'notes' | 'search' | 'social';
  xpReward: number;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface UserLevel {
  level: number;
  title: string;
  xpRequired: number;
  icon: string;
}

export const LEVELS: UserLevel[] = [
  { level: 1, title: 'Iniciante', xpRequired: 0, icon: '🌱' },
  { level: 2, title: 'Leitor', xpRequired: 100, icon: '📖' },
  { level: 3, title: 'Estudioso', xpRequired: 300, icon: '📚' },
  { level: 4, title: 'Explorador', xpRequired: 600, icon: '🔍' },
  { level: 5, title: 'Devoto', xpRequired: 1000, icon: '✝️' },
  { level: 6, title: 'Sabio', xpRequired: 1500, icon: '🦉' },
  { level: 7, title: 'Mestre', xpRequired: 2200, icon: '👑' },
  { level: 8, title: 'Líder', xpRequired: 3000, icon: '⭐' },
  { level: 9, title: 'Legendário', xpRequired: 4000, icon: '🔥' },
  { level: 10, title: 'Bíblico', xpRequired: 5500, icon: '📜' },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_read',
    title: 'Primeira Leitura',
    description: 'Leia seu primeiro capítulo',
    icon: '📖',
    category: 'reading',
    xpReward: 10,
    maxProgress: 1,
  },
  {
    id: 'reading_10',
    title: 'Leitor Ávido',
    description: 'Leia 10 capítulos',
    icon: '📚',
    category: 'reading',
    xpReward: 50,
    maxProgress: 10,
  },
  {
    id: 'reading_50',
    title: 'Estudioso da Palavra',
    description: 'Leia 50 capítulos',
    icon: '🎓',
    category: 'reading',
    xpReward: 150,
    maxProgress: 50,
  },
  {
    id: 'reading_100',
    title: 'Maratona Bíblica',
    description: 'Leia 100 capítulos',
    icon: '🏃',
    category: 'reading',
    xpReward: 300,
    maxProgress: 100,
  },
  {
    id: 'streak_3',
    title: 'Consistência',
    description: 'Mantenha uma sequência de 3 dias',
    icon: '🔥',
    category: 'streak',
    xpReward: 25,
    maxProgress: 3,
  },
  {
    id: 'streak_7',
    title: 'Semana Santa',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '⛪',
    category: 'streak',
    xpReward: 75,
    maxProgress: 7,
  },
  {
    id: 'streak_30',
    title: 'Mês de FÉ',
    description: 'Mantenha uma sequência de 30 dias',
    icon: '🌟',
    category: 'streak',
    xpReward: 300,
    maxProgress: 30,
  },
  {
    id: 'notes_5',
    title: 'Anotador',
    description: 'Faça 5 anotações',
    icon: '📝',
    category: 'notes',
    xpReward: 30,
    maxProgress: 5,
  },
  {
    id: 'notes_25',
    title: 'Diário Espiritual',
    description: 'Faça 25 anotações',
    icon: '📓',
    category: 'notes',
    xpReward: 100,
    maxProgress: 25,
  },
  {
    id: 'search_10',
    title: 'Investigador',
    description: 'Realize 10 buscas',
    icon: '🔍',
    category: 'search',
    xpReward: 20,
    maxProgress: 10,
  },
  {
    id: 'favorites_10',
    title: 'Coletor',
    description: 'Salve 10 versículos favoritos',
    icon: '❤️',
    category: 'reading',
    xpReward: 40,
    maxProgress: 10,
  },
  {
    id: 'complete_plan',
    title: 'Comprometido',
    description: 'Complete um plano de leitura',
    icon: '✅',
    category: 'reading',
    xpReward: 200,
    maxProgress: 1,
  },
];

interface GamificationState {
  xp: number;
  chaptersRead: number;
  searchCount: number;
  notesCount: number;
  favoritesCount: number;
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
  unlockedAchievements: string[];
  completedPlans: number;

  addXP: (amount: number) => void;
  incrementChaptersRead: () => void;
  incrementSearch: () => void;
  incrementNotes: () => void;
  incrementFavorites: () => void;
  completePlan: () => void;
  updateStreak: () => void;
  checkAchievements: () => Achievement[];
  getCurrentLevel: () => UserLevel;
  getNextLevel: () => UserLevel | null;
  getProgressToNextLevel: () => number;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      chaptersRead: 0,
      searchCount: 0,
      notesCount: 0,
      favoritesCount: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastReadDate: null,
      unlockedAchievements: [],
      completedPlans: 0,

      addXP: (amount) => set((state) => ({ xp: state.xp + amount })),

      incrementChaptersRead: () =>
        set((state) => ({
          chaptersRead: state.chaptersRead + 1,
          xp: state.xp + 5,
        })),

      incrementSearch: () =>
        set((state) => ({
          searchCount: state.searchCount + 1,
          xp: state.xp + 2,
        })),

      incrementNotes: () =>
        set((state) => ({
          notesCount: state.notesCount + 1,
          xp: state.xp + 3,
        })),

      incrementFavorites: () =>
        set((state) => ({
          favoritesCount: state.favoritesCount + 1,
          xp: state.xp + 2,
        })),

      completePlan: () =>
        set((state) => ({
          completedPlans: state.completedPlans + 1,
          xp: state.xp + 100,
        })),

      updateStreak: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (state.lastReadDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = state.currentStreak;

        if (state.lastReadDate === yesterdayStr) {
          newStreak = state.currentStreak + 1;
        } else if (state.lastReadDate !== today) {
          newStreak = 1;
        }

        set({
          currentStreak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
          lastReadDate: today,
          xp: state.xp + (newStreak >= 7 ? 10 : newStreak >= 3 ? 5 : 2),
        });
      },

      checkAchievements: () => {
        const state = get();
        const newlyUnlocked: Achievement[] = [];

        const achievementChecks: { id: string; condition: boolean; achievement: Achievement }[] = [
          {
            id: 'first_read',
            condition: state.chaptersRead >= 1,
            achievement: ACHIEVEMENTS.find((a) => a.id === 'first_read')!,
          },
          {
            id: 'reading_10',
            condition: state.chaptersRead >= 10,
            achievement: ACHIEVEMENTS.find((a) => a.id === 'reading_10')!,
          },
          {
            id: 'reading_50',
            condition: state.chaptersRead >= 50,
            achievement: ACHIEVEMENTS.find((a) => a.id === 'reading_50')!,
          },
          {
            id: 'reading_100',
            condition: state.chaptersRead >= 100,
            achievement: ACHIEVEMENTS.find((a) => a.id === 'reading_100')!,
          },
          {
            id: 'streak_3',
            condition: state.currentStreak >= 3,
            achievement: ACHIEVEMENTS.find((a) => a.id === 'streak_3')!,
          },
          {
            id: 'streak_7',
            condition: state.currentStreak >= 7,
            achievement: ACHIEVEMENTS.find((a) => a.id === 'streak_7')!,
          },
          {
            id: 'streak_30',
            condition: state.currentStreak >= 30,
            achievement: ACHIEVEMENTS.find((a) => a.id === 'streak_30')!,
          },
          {
            id: 'notes_5',
            condition: state.notesCount >= 5,
            achievement: ACHIEVEMENTS.find((a) => a.id === 'notes_5')!,
          },
          {
            id: 'notes_25',
            condition: state.notesCount >= 25,
            achievement: ACHIEVEMENTS.find((a) => a.id === 'notes_25')!,
          },
          {
            id: 'search_10',
            condition: state.searchCount >= 10,
            achievement: ACHIEVEMENTS.find((a) => a.id === 'search_10')!,
          },
          {
            id: 'favorites_10',
            condition: state.favoritesCount >= 10,
            achievement: ACHIEVEMENTS.find((a) => a.id === 'favorites_10')!,
          },
          {
            id: 'complete_plan',
            condition: state.completedPlans >= 1,
            achievement: ACHIEVEMENTS.find((a) => a.id === 'complete_plan')!,
          },
        ];

        achievementChecks.forEach(({ id, condition, achievement }) => {
          if (condition && !state.unlockedAchievements.includes(id)) {
            newlyUnlocked.push(achievement);
          }
        });

        if (newlyUnlocked.length > 0) {
          set((state) => ({
            unlockedAchievements: [
              ...state.unlockedAchievements,
              ...newlyUnlocked.map((a) => a.id),
            ],
          }));
        }

        return newlyUnlocked;
      },

      getCurrentLevel: () => {
        const state = get();
        const currentLevel = LEVELS.reverse().find((level) => state.xp >= level.xpRequired);
        return currentLevel || LEVELS[0];
      },

      getNextLevel: () => {
        const state = get();
        const currentLevel = state.getCurrentLevel();
        const nextLevelIndex = LEVELS.findIndex((l) => l.level === currentLevel.level + 1);
        return nextLevelIndex !== -1 ? LEVELS[nextLevelIndex] : null;
      },

      getProgressToNextLevel: () => {
        const state = get();
        const currentLevel = state.getCurrentLevel();
        const nextLevel = state.getNextLevel();

        if (!nextLevel) return 100;

        const xpInCurrentLevel = state.xp - currentLevel.xpRequired;
        const xpNeeded = nextLevel.xpRequired - currentLevel.xpRequired;

        return Math.round((xpInCurrentLevel / xpNeeded) * 100);
      },
    }),
    {
      name: 'bibleapp-gamification',
    }
  )
);
