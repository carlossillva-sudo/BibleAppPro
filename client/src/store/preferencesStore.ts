import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppearanceMode = 'light' | 'dark' | 'system';
export type ReadingWidth = 'narrow' | 'medium' | 'wide';
export type FontFamily = 'Inter' | 'Georgia' | 'Lora' | 'Merriweather' | 'Open Sans' | 'System';
export type VerseSpacing = 'compact' | 'normal' | 'relaxed';
export type ReadingMode = 'continuous' | 'paginated';

export interface ThemeColors {
  bg: string;
  text: string;
  accent: string;
  card: string;
  mode: 'light' | 'dark';
}

export const THEMES_DATA: Record<string, ThemeColors & { name: string }> = {
  // 20 Light Themes
  'light-premium': {
    name: 'Light Clean',
    bg: '0 0% 100%',
    text: '222 47% 11%',
    accent: '221 83% 53%',
    card: '210 40% 98%',
    mode: 'light',
  },
  pearl: {
    name: 'Pearl',
    bg: '40 33% 98%',
    text: '240 10% 20%',
    accent: '330 80% 60%',
    card: '40 20% 95%',
    mode: 'light',
  },
  cream: {
    name: 'Soft Cream',
    bg: '40 50% 95%',
    text: '30 30% 20%',
    accent: '25 80% 50%',
    card: '40 40% 90%',
    mode: 'light',
  },
  sand: {
    name: 'Desert Sand',
    bg: '35 40% 92%',
    text: '25 40% 20%',
    accent: '15 70% 55%',
    card: '35 30% 88%',
    mode: 'light',
  },
  silver: {
    name: 'Silver Light',
    bg: '210 20% 96%',
    text: '210 40% 20%',
    accent: '210 80% 50%',
    card: '210 15% 92%',
    mode: 'light',
  },
  mint: {
    name: 'Mint Breeze',
    bg: '150 40% 96%',
    text: '160 50% 20%',
    accent: '150 80% 40%',
    card: '150 30% 92%',
    mode: 'light',
  },
  dawn: {
    name: 'Morning Dawn',
    bg: '10 50% 98%',
    text: '10 50% 20%',
    accent: '5 80% 60%',
    card: '10 40% 95%',
    mode: 'light',
  },
  sky: {
    name: 'Sky Blue',
    bg: '200 40% 96%',
    text: '200 50% 20%',
    accent: '200 80% 50%',
    card: '200 30% 92%',
    mode: 'light',
  },
  lilac: {
    name: 'Soft Lilac',
    bg: '270 40% 96%',
    text: '270 50% 20%',
    accent: '270 80% 60%',
    card: '270 30% 92%',
    mode: 'light',
  },
  rose: {
    name: 'Rose Petal',
    bg: '340 40% 98%',
    text: '340 50% 20%',
    accent: '340 80% 60%',
    card: '340 30% 95%',
    mode: 'light',
  },
  linen: {
    name: 'Linen',
    bg: '30 20% 96%',
    text: '30 40% 20%',
    accent: '20 50% 50%',
    card: '30 15% 92%',
    mode: 'light',
  },
  frost: {
    name: 'Frost',
    bg: '200 20% 98%',
    text: '200 40% 20%',
    accent: '200 60% 60%',
    card: '200 15% 94%',
    mode: 'light',
  },
  peach: {
    name: 'Peach',
    bg: '15 40% 96%',
    text: '15 50% 20%',
    accent: '10 70% 60%',
    card: '15 30% 92%',
    mode: 'light',
  },
  sage: {
    name: 'Sage Green',
    bg: '120 20% 96%',
    text: '120 40% 20%',
    accent: '120 50% 45%',
    card: '120 15% 92%',
    mode: 'light',
  },
  blush: {
    name: 'Blush',
    bg: '350 30% 98%',
    text: '350 40% 20%',
    accent: '340 60% 65%',
    card: '350 20% 94%',
    mode: 'light',
  },
  sunlight: {
    name: 'Sunlight',
    bg: '45 40% 98%',
    text: '45 50% 20%',
    accent: '40 80% 55%',
    card: '45 30% 94%',
    mode: 'light',
  },
  lavender: {
    name: 'Lavender',
    bg: '260 20% 98%',
    text: '260 40% 20%',
    accent: '260 60% 60%',
    card: '260 15% 94%',
    mode: 'light',
  },
  'dusty-rose': {
    name: 'Dusty Rose',
    bg: '340 15% 96%',
    text: '340 30% 20%',
    accent: '340 50% 50%',
    card: '340 10% 92%',
    mode: 'light',
  },
  cloud: {
    name: 'Cloud Grey',
    bg: '210 10% 98%',
    text: '210 30% 20%',
    accent: '210 50% 55%',
    card: '210 15% 94%',
    mode: 'light',
  },
  ivory: {
    name: 'Ivory Vanilla',
    bg: '40 20% 98%',
    text: '40 40% 20%',
    accent: '30 60% 50%',
    card: '40 15% 94%',
    mode: 'light',
  },

  // 20 Dark Themes
  midnight: {
    name: 'Midnight Premium',
    bg: '220 48% 8%',
    text: '210 40% 98%',
    accent: '217 91% 60%',
    card: '221 39% 11%',
    mode: 'dark',
  },
  graphite: {
    name: 'Graphite Elegance',
    bg: '0 0% 7%',
    text: '240 5% 96%',
    accent: '46 65% 52%',
    card: '0 0% 12%',
    mode: 'dark',
  },
  ocean: {
    name: 'Deep Ocean',
    bg: '216 65% 11%',
    text: '213 100% 95%',
    accent: '224 64% 33%',
    card: '218 58% 16%',
    mode: 'dark',
  },
  forest: {
    name: 'Dark Forest',
    bg: '150 40% 8%',
    text: '150 20% 90%',
    accent: '150 60% 50%',
    card: '150 30% 12%',
    mode: 'dark',
  },
  plum: {
    name: 'Deep Plum',
    bg: '280 40% 8%',
    text: '280 20% 90%',
    accent: '280 60% 60%',
    card: '280 30% 12%',
    mode: 'dark',
  },
  slate: {
    name: 'Slate',
    bg: '210 20% 10%',
    text: '210 20% 90%',
    accent: '210 60% 60%',
    card: '210 15% 14%',
    mode: 'dark',
  },
  'midnight-purple': {
    name: 'Midnight Purple',
    bg: '260 40% 10%',
    text: '260 20% 95%',
    accent: '260 80% 65%',
    card: '260 30% 15%',
    mode: 'dark',
  },
  espresso: {
    name: 'Dark Espresso',
    bg: '30 30% 10%',
    text: '30 20% 90%',
    accent: '25 60% 55%',
    card: '30 25% 14%',
    mode: 'dark',
  },
  navy: {
    name: 'Navy Blue',
    bg: '230 50% 12%',
    text: '230 20% 95%',
    accent: '230 80% 65%',
    card: '230 40% 16%',
    mode: 'dark',
  },
  charcoal: {
    name: 'Charcoal Black',
    bg: '0 0% 12%',
    text: '0 0% 90%',
    accent: '0 0% 60%',
    card: '0 0% 16%',
    mode: 'dark',
  },
  obsidian: {
    name: 'Obsidian',
    bg: '0 0% 5%',
    text: '0 0% 95%',
    accent: '0 0% 70%',
    card: '0 0% 9%',
    mode: 'dark',
  },
  'emerald-dark': {
    name: 'Emerald Dark',
    bg: '150 50% 10%',
    text: '150 20% 95%',
    accent: '150 70% 55%',
    card: '150 40% 14%',
    mode: 'dark',
  },
  wine: {
    name: 'Dark Wine',
    bg: '350 40% 10%',
    text: '350 20% 95%',
    accent: '350 70% 55%',
    card: '350 30% 14%',
    mode: 'dark',
  },
  'teal-dark': {
    name: 'Teal Shadow',
    bg: '180 50% 10%',
    text: '180 20% 95%',
    accent: '180 70% 50%',
    card: '180 40% 14%',
    mode: 'dark',
  },
  mocha: {
    name: 'Mocha',
    bg: '30 20% 12%',
    text: '30 10% 90%',
    accent: '25 50% 50%',
    card: '30 15% 16%',
    mode: 'dark',
  },
  steel: {
    name: 'Steel Night',
    bg: '210 15% 14%',
    text: '210 10% 90%',
    accent: '210 50% 60%',
    card: '210 20% 18%',
    mode: 'dark',
  },
  'crimson-dark': {
    name: 'Midnight Crimson',
    bg: '355 50% 10%',
    text: '355 20% 95%',
    accent: '355 80% 55%',
    card: '355 40% 14%',
    mode: 'dark',
  },
  'indigo-dark': {
    name: 'Deep Indigo',
    bg: '240 50% 12%',
    text: '240 20% 95%',
    accent: '240 80% 65%',
    card: '240 40% 16%',
    mode: 'dark',
  },
  olive: {
    name: 'Dark Olive',
    bg: '80 30% 10%',
    text: '80 15% 90%',
    accent: '80 60% 45%',
    card: '80 25% 14%',
    mode: 'dark',
  },
  bronze: {
    name: 'Bronze Night',
    bg: '30 40% 10%',
    text: '30 20% 90%',
    accent: '30 70% 50%',
    card: '30 35% 14%',
    mode: 'dark',
  },

  // Special Themes
  amoled: {
    name: 'AMOLED Black',
    bg: '0 0% 0%',
    text: '0 0% 100%',
    accent: '202 100% 50%',
    card: '0 0% 6%',
    mode: 'dark',
  },
  parchment: {
    name: 'Parchment',
    bg: '43 50% 90%',
    text: '34 38% 18%',
    accent: '30 53% 36%',
    card: '43 60% 94%',
    mode: 'light',
  },
};

interface PreferencesState {
  appearanceMode: AppearanceMode;
  theme: string;
  fontSize: number;
  lineHeight: number;
  readingWidth: ReadingWidth;
  fontFamily: FontFamily;
  verseSpacing: VerseSpacing;
  readingMode: ReadingMode;
  smoothTransitions: boolean;
  boldVerses: boolean;
  showVerseNumbers: boolean;
  focusMode: boolean;
  nightMode: boolean;
  nightModeIntensity: number;
  favoritedThemes: string[];
  recentThemes: string[];
  notifications: { lembrete: boolean; versiculo: boolean };
  lastRead: { bookId: string; bookName: string; chapterId: string } | null;
  bibleVersion: string;
  sidebarIconColor: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gradient' | 'theme';

  setAppearanceMode: (mode: AppearanceMode) => void;
  setTheme: (themeId: string) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (lh: number) => void;
  setReadingWidth: (width: ReadingWidth) => void;
  setFontFamily: (font: FontFamily) => void;
  setVerseSpacing: (spacing: VerseSpacing) => void;
  setReadingMode: (mode: ReadingMode) => void;
  setSmoothTransitions: (v: boolean) => void;
  setBoldVerses: (v: boolean) => void;
  setShowVerseNumbers: (v: boolean) => void;
  setFocusMode: (v: boolean) => void;
  setNightMode: (v: boolean) => void;
  setNightModeIntensity: (v: number) => void;
  setSidebarIconColor: (
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gradient' | 'theme'
  ) => void;
  toggleFavoriteTheme: (themeId: string) => void;
  toggleNotification: (key: 'lembrete' | 'versiculo') => void;
  setLastRead: (bookId: string, bookName: string, chapterId: string) => void;
  setBibleVersion: (version: string) => void;
  resetDefaults: () => void;
}

function applyTheme(themeId: string, appearanceMode: AppearanceMode) {
  let effectiveTheme = THEMES_DATA[themeId];
  if (!effectiveTheme) effectiveTheme = THEMES_DATA['midnight'];

  // If the system overrides mode, respect the mode by selecting a default theme for the matched type if needed.
  // However, the easiest way to handle themes per mode is:
  // User chooses a theme (e.g., 'pearl'). If appearance is 'dark', we should auto-switch them to a dark theme.
  // Instead of forcing a theme, we just apply the colors of the selected theme, but we strictly respect the `isDark` class
  // based on the selected mode if it's forced by user/system.

  // For pure logic: we rely on `effectiveTheme.mode` to dictate the dark class unless `appearanceMode` says otherwise.
  let isDark = effectiveTheme.mode === 'dark';

  // Override based on appearance mode
  if (appearanceMode === 'dark') {
    isDark = true;
    // Auto-select a dark theme if current theme is light
    if (effectiveTheme.mode === 'light') {
      effectiveTheme = THEMES_DATA['midnight'] || effectiveTheme;
    }
  } else if (appearanceMode === 'light') {
    isDark = false;
    // Auto-select a light theme if current theme is dark
    if (effectiveTheme.mode === 'dark') {
      effectiveTheme = THEMES_DATA['light-premium'] || effectiveTheme;
    }
  } else if (appearanceMode === 'system') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  const html = document.documentElement;

  html.style.setProperty('--background', effectiveTheme.bg);
  html.style.setProperty('--foreground', effectiveTheme.text);
  html.style.setProperty('--primary', effectiveTheme.accent);
  html.style.setProperty('--card', effectiveTheme.card);
  html.style.setProperty('--popover', effectiveTheme.card);

  html.style.setProperty('--card-foreground', effectiveTheme.text);
  html.style.setProperty('--popover-foreground', effectiveTheme.text);
  html.style.setProperty('--primary-foreground', isDark ? '222 47% 11%' : '210 40% 98%');
  html.style.setProperty('--muted', effectiveTheme.card);
  html.style.setProperty('--muted-foreground', isDark ? '215 20% 65%' : '215 16% 47%');
  html.style.setProperty('--border', effectiveTheme.card);

  if (isDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

// Function to handle system theme changes
export function initializeSystemThemeListener(state: PreferencesState) {
  if (state.appearanceMode === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      applyTheme(state.theme, 'system');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }
  return () => {};
}

const DEFAULTS = {
  appearanceMode: 'system' as AppearanceMode,
  theme: 'midnight',
  fontSize: 18,
  lineHeight: 1.8,
  readingWidth: 'medium' as ReadingWidth,
  fontFamily: 'Inter' as FontFamily,
  verseSpacing: 'normal' as VerseSpacing,
  readingMode: 'continuous' as ReadingMode,
  smoothTransitions: true,
  boldVerses: false,
  showVerseNumbers: true,
  focusMode: false,
  nightMode: false,
  nightModeIntensity: 30,
  favoritedThemes: [],
  recentThemes: [],
  bibleVersion: 'NVI',
  sidebarIconColor: 'theme' as const,
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,
      notifications: { lembrete: true, versiculo: true },
      lastRead: null,
      setAppearanceMode: (appearanceMode) => {
        set({ appearanceMode });
        applyTheme(get().theme, appearanceMode);
      },
      setTheme: (themeId) => {
        set((state) => {
          const recent = [themeId, ...state.recentThemes.filter((id) => id !== themeId)].slice(
            0,
            3
          );
          applyTheme(themeId, state.appearanceMode);
          return { theme: themeId, recentThemes: recent };
        });
      },
      setFontSize: (fontSize) => set({ fontSize }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      setReadingWidth: (readingWidth) => set({ readingWidth }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setVerseSpacing: (verseSpacing) => set({ verseSpacing }),
      setReadingMode: (readingMode) => set({ readingMode }),
      setSmoothTransitions: (smoothTransitions) => set({ smoothTransitions }),
      setBoldVerses: (boldVerses) => set({ boldVerses }),
      setShowVerseNumbers: (showVerseNumbers) => set({ showVerseNumbers }),
      setFocusMode: (focusMode) => set({ focusMode }),
      setNightMode: (nightMode) => set({ nightMode }),
      setNightModeIntensity: (nightModeIntensity) => set({ nightModeIntensity }),
      setSidebarIconColor: (sidebarIconColor) => set({ sidebarIconColor }),
      toggleFavoriteTheme: (themeId) =>
        set((state) => ({
          favoritedThemes: state.favoritedThemes.includes(themeId)
            ? state.favoritedThemes.filter((id) => id !== themeId)
            : [...state.favoritedThemes, themeId],
        })),
      toggleNotification: (key) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: !state.notifications[key] },
        })),
      setLastRead: (bookId, bookName, chapterId) =>
        set({ lastRead: { bookId, bookName, chapterId } }),
      setBibleVersion: (bibleVersion) => set({ bibleVersion }),
      resetDefaults: () => {
        applyTheme(DEFAULTS.theme, DEFAULTS.appearanceMode);
        set({ ...DEFAULTS });
      },
    }),
    {
      name: 'preferences-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme, state.appearanceMode);
          // Defer this slightly so it binds after hydrate
          setTimeout(() => initializeSystemThemeListener(state), 10);
        }
      },
    }
  )
);
