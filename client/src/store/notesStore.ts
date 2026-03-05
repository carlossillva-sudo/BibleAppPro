import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Note {
    id: string;
    bookId: string;
    chapterId: string;
    verseNumber: string;
    content: string;
    timestamp: number;
}

interface NotesState {
    notes: Note[];
    addNote: (note: Omit<Note, 'id' | 'timestamp'>) => void;
    updateNote: (id: string, content: string) => void;
    deleteNote: (id: string) => void;
    getNote: (bookId: string, chapterId: string, verseNumber: string) => Note | undefined;
}

export const useNotesStore = create<NotesState>()(
    persist(
        (set, get) => ({
            notes: [],
            addNote: (note) => set((state) => ({
                notes: [
                    {
                        ...note,
                        id: `${note.bookId}-${note.chapterId}-${note.verseNumber}`,
                        timestamp: Date.now()
                    },
                    ...state.notes.filter(n => n.id !== `${note.bookId}-${note.chapterId}-${note.verseNumber}`)
                ]
            })),
            updateNote: (id, content) => set((state) => ({
                notes: state.notes.map(n => n.id === id ? { ...n, content, timestamp: Date.now() } : n)
            })),
            deleteNote: (id) => set((state) => ({
                notes: state.notes.filter(n => n.id !== id)
            })),
            getNote: (bookId, chapterId, verseNumber) => {
                return get().notes.find(n => n.bookId === bookId && n.chapterId === chapterId && n.verseNumber === verseNumber);
            }
        }),
        { name: 'bible-notes-storage' }
    )
);
