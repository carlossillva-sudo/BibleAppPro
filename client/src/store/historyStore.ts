import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryItem {
    bookId: string;
    bookName: string;
    chapterId: string;
    timestamp: number;
}

export interface Bookmark {
    bookId: string;
    bookName: string;
    chapterId: string;
    verseNumber: string;
    timestamp: number;
}

interface HistoryState {
    history: HistoryItem[];
    bookmarks: Bookmark[];
    addHistory: (item: Omit<HistoryItem, 'timestamp'>) => void;
    addBookmark: (bookmark: Omit<Bookmark, 'timestamp'>) => void;
    removeBookmark: (bookId: string, chapterId: string, verseNumber: string) => void;
    clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set) => ({
            history: [],
            bookmarks: [],
            addHistory: (item) => set((state) => {
                const newItem = { ...item, timestamp: Date.now() };
                const filtered = state.history.filter(h =>
                    !(h.bookId === item.bookId && h.chapterId === item.chapterId)
                );
                return { history: [newItem, ...filtered].slice(0, 50) };
            }),
            addBookmark: (bookmark) => set((state) => ({
                bookmarks: [{ ...bookmark, timestamp: Date.now() }, ...state.bookmarks]
            })),
            removeBookmark: (bookId, chapterId, verseNumber) => set((state) => ({
                bookmarks: state.bookmarks.filter(b =>
                    !(b.bookId === bookId && b.chapterId === chapterId && b.verseNumber === verseNumber)
                )
            })),
            clearHistory: () => set({ history: [] }),
        }),
        { name: 'bible-history-storage' }
    )
);
