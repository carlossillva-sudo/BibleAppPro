import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'sepia' | 'midnight' | 'paper';
export type FilterMode = 'none' | 'warm' | 'low-contrast' | 'high-contrast';

interface PreferencesState {
    theme: ThemeMode;
    fontSize: number;
    lineHeight: number;
    readingWidth: 'narrow' | 'medium' | 'wide';
    serifFont: boolean;
    showVerseNumbers: boolean;
    filter: FilterMode;
    focusMode: boolean;
    notifications: { lembrete: boolean; versiculo: boolean };
    lastRead: { bookId: string; bookName: string; chapterId: string } | null;
    setTheme: (theme: ThemeMode) => void;
    setFontSize: (size: number) => void;
    setLineHeight: (lh: number) => void;
    setReadingWidth: (width: 'narrow' | 'medium' | 'wide') => void;
    setSerifFont: (v: boolean) => void;
    setShowVerseNumbers: (v: boolean) => void;
    setFilter: (f: FilterMode) => void;
    setFocusMode: (v: boolean) => void;
    toggleNotification: (key: 'lembrete' | 'versiculo') => void;
    setLastRead: (bookId: string, bookName: string, chapterId: string) => void;
    resetDefaults: () => void;
}

function applyTheme(theme: ThemeMode) {
    const html = document.documentElement;
    html.classList.remove('dark', 'sepia', 'midnight', 'paper');
    if (theme !== 'light') html.classList.add(theme);
}

function applyFilter(filter: FilterMode) {
    const body = document.body;
    body.classList.remove('filter-warm', 'filter-low-contrast', 'filter-high-contrast');
    if (filter !== 'none') body.classList.add(`filter-${filter}`);
}

const DEFAULTS = {
    theme: 'light' as ThemeMode,
    fontSize: 18,
    lineHeight: 2.2,
    readingWidth: 'medium' as const,
    serifFont: false,
    showVerseNumbers: true,
    filter: 'none' as FilterMode,
    focusMode: false,
};

export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            ...DEFAULTS,
            notifications: { lembrete: true, versiculo: true },
            lastRead: null,
            setTheme: (theme) => { applyTheme(theme); set({ theme }); },
            setFontSize: (fontSize) => set({ fontSize }),
            setLineHeight: (lineHeight) => set({ lineHeight }),
            setReadingWidth: (readingWidth) => set({ readingWidth }),
            setSerifFont: (serifFont) => set({ serifFont }),
            setShowVerseNumbers: (showVerseNumbers) => set({ showVerseNumbers }),
            setFilter: (filter) => { applyFilter(filter); set({ filter }); },
            setFocusMode: (focusMode) => set({ focusMode }),
            toggleNotification: (key) =>
                set((state) => ({
                    notifications: { ...state.notifications, [key]: !state.notifications[key] },
                })),
            setLastRead: (bookId, bookName, chapterId) =>
                set({ lastRead: { bookId, bookName, chapterId } }),
            resetDefaults: () => {
                applyTheme(DEFAULTS.theme);
                applyFilter(DEFAULTS.filter);
                set({ ...DEFAULTS });
            },
        }),
        {
            name: 'preferences-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    applyTheme(state.theme);
                    applyFilter(state.filter);
                }
            },
        }
    )
);
