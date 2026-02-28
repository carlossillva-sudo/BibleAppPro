import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Heart, Copy, Highlighter, Maximize2, Minimize2, Sparkles, BookCopy as BookCopyIcon, Bookmark, BookmarkCheck, StickyNote, X, Check, Settings2 } from 'lucide-react';
import { usePreferencesStore } from '../store/preferencesStore';
import { cn } from '../utils/cn';
import { VersionSelector } from '../components/bible/VersionSelector';
import { ComparePanel } from '../components/bible/ComparePanel';
import { useHistoryStore } from '../store/historyStore';
import { useNotesStore } from '../store/notesStore';
import { dictionaryData } from '../data/dictionaryData';
import { bookIntroductions } from '../data/bookIntroductions';
import { Badge } from '../components/ui/Badge';

interface Verse { number: string; text?: string; content?: string; }
interface BookInfo { number: string; name: string; chaptersCount: number; }
interface ChapterData {
    bookId: string;
    bookName: string;
    chapterId: string;
    verses: Verse[];
}

export const ReaderPage: React.FC = () => {
    const { bookId = '1', chapterId = '1' } = useParams();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const observerTarget = useRef<HTMLDivElement>(null);
    const {
        fontSize, fontFamily, readingWidth, lineHeight,
        showVerseNumbers, focusMode, setFocusMode, setLastRead,
        bibleVersion, verseSpacing, boldVerses
    } = usePreferencesStore();

    const [selectedVerse, setSelectedVerse] = useState<{ chapter: string; number: string } | null>(null);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [noteContent, setNoteContent] = useState('');
    const [dictionaryWord, setDictionaryWord] = useState<{ word: string; definition: string; category?: string } | null>(null);
    const [copiedVerse, setCopiedVerse] = useState<string | null>(null);

    const [highlighted, setHighlighted] = useState<Set<string>>(() => {
        try { return new Set(JSON.parse(localStorage.getItem('highlighted-verses') || '[]')); } catch { return new Set(); }
    });
    const [favorited, setFavorited] = useState<Set<string>>(() => {
        try { return new Set(JSON.parse(localStorage.getItem('favorited-verses') || '[]')); } catch { return new Set(); }
    });

    const { bookmarks, addBookmark, removeBookmark, addHistory } = useHistoryStore();
    const { addNote, getNote } = useNotesStore();

    const { data: books } = useQuery<BookInfo[]>({
        queryKey: ['reader-books', bibleVersion],
        queryFn: async () => (await api.get('/bible/livros', { params: { v: bibleVersion } })).data
    });

    const currentBook = books?.find(b => b.number === bookId);

    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery<ChapterData>({
        queryKey: ['verses-infinite', bookId, bibleVersion, chapterId],
        initialPageParam: chapterId,
        queryFn: async ({ pageParam }) => {
            const chId = pageParam as string;
            const res = await api.get(`/bible/livros/${bookId}/capitulos/${chId}/versiculos`, { params: { v: bibleVersion } });
            return {
                bookId,
                bookName: currentBook?.name || '',
                chapterId: chId,
                verses: res.data
            };
        },
        getNextPageParam: (lastPage) => {
            if (!currentBook) return undefined;
            const nextCh = parseInt(lastPage.chapterId) + 1;
            return nextCh <= currentBook.chaptersCount ? nextCh.toString() : undefined;
        },
        enabled: !!currentBook
    });

    const loadedChapters = infiniteData?.pages || [];

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => { if (entries[0].isIntersecting && hasNextPage) fetchNextPage(); },
            { threshold: 0.1 }
        );
        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const ch = entry.target.getAttribute('data-chapter');
                        if (ch && ch !== chapterId) {
                            window.history.replaceState(null, '', `/reader/${bookId}/${ch}`);
                            if (currentBook) setLastRead(bookId, currentBook.name, ch);
                        }
                    }
                });
            },
            { threshold: 0.6 }
        );
        const targets = document.querySelectorAll('.chapter-section');
        targets.forEach(t => observer.observe(t));
        return () => observer.disconnect();
    }, [loadedChapters, bookId, chapterId, currentBook, setLastRead]);

    useEffect(() => {
        if (currentBook) {
            setLastRead(bookId, currentBook.name, chapterId);
            addHistory({ bookId, bookName: currentBook.name, chapterId });
        }
    }, [bookId, chapterId, currentBook, setLastRead, addHistory]);

    useEffect(() => { localStorage.setItem('highlighted-verses', JSON.stringify([...highlighted])); }, [highlighted]);
    useEffect(() => { localStorage.setItem('favorited-verses', JSON.stringify([...favorited])); }, [favorited]);

    const makeKey = (ch: string, num: string) => `${bookId}:${ch}:${num}`;
    const toggleHighlight = (ch: string, num: string) => {
        const key = makeKey(ch, num);
        setHighlighted(prev => { const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s; });
    };
    const toggleFavorite = (ch: string, num: string) => {
        const key = makeKey(ch, num);
        setFavorited(prev => { const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s; });
    };

    const copyVerse = (ch: string, v: Verse) => {
        const textToCopy = `"${v.text || v.content}" — ${currentBook?.name} ${ch}:${v.number}`;
        navigator.clipboard.writeText(textToCopy);
        setCopiedVerse(v.number);
        setTimeout(() => setCopiedVerse(null), 2000);
    };

    const toggleBookmark = (ch: string, vNum: string) => {
        const isBookmarked = bookmarks.some(b => b.bookId === bookId && b.chapterId === ch && b.verseNumber === vNum);
        if (isBookmarked) removeBookmark(bookId, ch, vNum);
        else addBookmark({ bookId, bookName: currentBook?.name || '', chapterId: ch, verseNumber: vNum });
    };

    const handleOpenNote = (ch: string, vNum: string) => {
        const existing = getNote(bookId, ch, vNum);
        setNoteContent(existing?.content || '');
        setSelectedVerse({ chapter: ch, number: vNum });
        setIsNoteModalOpen(true);
    };

    const handleSaveNote = () => {
        if (selectedVerse) {
            addNote({ bookId, chapterId: selectedVerse.chapter, verseNumber: selectedVerse.number, content: noteContent });
            setIsNoteModalOpen(false);
            setNoteContent('');
        }
    };

    const handleWordClick = (text: string) => {
        const found = dictionaryData.find(entry => text.toLowerCase().includes(entry.word.toLowerCase()));
        if (found) setDictionaryWord(found);
    };

    const widthClass = focusMode ? 'max-w-xl' : readingWidth === 'narrow' ? 'max-w-lg' : readingWidth === 'wide' ? 'max-w-4xl' : 'max-w-2xl';
    const effectiveFontSize = focusMode ? Math.min(fontSize + 2, 32) : fontSize;

    return (
        <div className="flex flex-col h-full bg-background selection:bg-primary/20 overflow-hidden">
            <div className="fixed top-0 left-0 right-0 h-1 z-50">
                <motion.div className="h-full bg-primary origin-left" style={{ scaleX: useSpring(useScroll({ container: scrollRef }).scrollYProgress, { stiffness: 100, damping: 30 }) }} />
            </div>

            <header className={cn("sticky top-0 z-40 px-4 md:px-8 py-3 flex items-center justify-between glass-panel border-x-0 rounded-none shadow-md transition-all duration-700", focusMode && "opacity-0 -translate-y-full")}>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <select value={bookId} onChange={e => navigate(`/reader/${e.target.value}/1`)} className="bg-transparent font-black tracking-tighter outline-none cursor-pointer">
                                {books?.map(b => <option key={b.number} value={b.number}>{b.name}</option>)}
                            </select>
                            <select value={chapterId} onChange={e => navigate(`/reader/${bookId}/${e.target.value}`)} className="bg-transparent font-black text-primary/80 outline-none cursor-pointer">
                                {Array.from({ length: currentBook?.chaptersCount || 0 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsCompareOpen(!isCompareOpen)} className={cn("rounded-xl", isCompareOpen && "bg-primary/10")} title="Comparar Versões">
                        <BookCopyIcon className="h-4 w-4" />
                    </Button>
                    <VersionSelector />
                    <Button variant="ghost" size="icon" onClick={() => navigate('/personalization')} className="rounded-xl" title="Personalização">
                        <Settings2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setFocusMode(!focusMode)} className="rounded-xl" title="Modo Foco">
                        {focusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                </div>
            </header>

            <main ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
                <div className={cn("mx-auto px-6 py-12 space-y-24", widthClass)}>
                    {loadedChapters.map((page, pageIdx) => {
                        const intro = bookIntroductions[page.bookId];
                        return (
                            <section key={`${page.bookId}-${page.chapterId}`} data-chapter={page.chapterId} className="chapter-section space-y-12">
                                {pageIdx === 0 && page.chapterId === '1' && intro && (
                                    <div className="p-8 premium-card border-primary/20 bg-primary/5 rounded-3xl space-y-4">
                                        <h2 className="text-3xl font-black">Introdução a {intro.title}</h2>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            <div><p className="opacity-60 uppercase text-[10px] font-black">Autor</p><p className="font-bold">{intro.author}</p></div>
                                            <div><p className="opacity-60 uppercase text-[10px] font-black">Tema</p><p className="font-bold">{intro.theme}</p></div>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">{intro.context}</p>
                                    </div>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="flex flex-col gap-2 mt-16 mb-8"
                                >
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-6xl md:text-8xl font-black opacity-10 tracking-tighter shrink-0 select-none">
                                            {page.chapterId}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-2xl md:text-3xl font-bold">{currentBook?.name}</span>
                                            <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-widest">
                                                Capítulo {page.chapterId}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-px w-full bg-gradient-to-r from-border via-border/50 to-transparent mt-4" />
                                </motion.div>

                                <div className="space-y-4">
                                    {page.verses.map(verse => {
                                        const key = makeKey(page.chapterId, verse.number);
                                        const isSelected = selectedVerse?.chapter === page.chapterId && selectedVerse?.number === verse.number;
                                        const note = getNote(bookId, page.chapterId, verse.number);
                                        const spacingClass = verseSpacing === 'compact' ? 'py-1' : verseSpacing === 'relaxed' ? 'py-5' : 'py-3';
                                        return (
                                            <div key={verse.number} className="relative group">
                                                <p
                                                    onClick={() => { setSelectedVerse(isSelected ? null : { chapter: page.chapterId, number: verse.number }); handleWordClick(verse.text || verse.content || ''); }}
                                                    className={cn(
                                                        "reader-text px-4 rounded-2xl transition-all cursor-pointer",
                                                        spacingClass,
                                                        boldVerses ? "font-bold" : "",
                                                        highlighted.has(key) && "bg-yellow-500/10",
                                                        isSelected && "bg-primary/5 ring-1 ring-primary/20 scale-[1.01]"
                                                    )}
                                                    style={{ fontSize: `${effectiveFontSize}px`, lineHeight, fontFamily: fontFamily === 'System' ? 'inherit' : fontFamily }}
                                                >
                                                    {showVerseNumbers && <span className="text-[0.6em] font-black opacity-30 mr-3 align-top">{verse.number}</span>}
                                                    {verse.text || verse.content}
                                                    {note && <StickyNote className="inline h-3 w-3 ml-2 text-primary" />}
                                                </p>
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-12 left-0 flex gap-1 p-1 glass-panel rounded-xl shadow-xl z-10">
                                                            <button onClick={() => toggleBookmark(page.chapterId, verse.number)} className="p-2 hover:bg-primary/10 rounded-lg">
                                                                {bookmarks.some(b => b.bookId === bookId && b.chapterId === page.chapterId && b.verseNumber === verse.number) ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
                                                            </button>
                                                            <button onClick={() => toggleFavorite(page.chapterId, verse.number)} className="p-2 hover:bg-pink-500/10 rounded-lg">
                                                                <Heart className={cn("h-4 w-4", favorited.has(key) && "fill-pink-500 text-pink-500")} />
                                                            </button>
                                                            <button onClick={() => toggleHighlight(page.chapterId, verse.number)} className="p-2 hover:bg-yellow-500/10 rounded-lg">
                                                                <Highlighter className={cn("h-4 w-4", highlighted.has(key) && "text-yellow-600")} />
                                                            </button>
                                                            <button onClick={() => handleOpenNote(page.chapterId, verse.number)} className="p-2 hover:bg-primary/10 rounded-lg"><StickyNote className="h-4 w-4" /></button>
                                                            <button onClick={() => copyVerse(page.chapterId, verse)} className="p-2 hover:bg-primary/10 rounded-lg relative">
                                                                {copiedVerse === verse.number ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                                {copiedVerse === verse.number && (
                                                                    <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-green-500 bg-background px-1 rounded shadow-sm">
                                                                        Copiado!
                                                                    </motion.span>
                                                                )}
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                    <div ref={observerTarget} className="h-20 flex items-center justify-center opacity-30">
                        {isFetchingNextPage ? <Sparkles className="animate-spin" /> : hasNextPage ? 'Carregando...' : 'Fim do Livro'}
                    </div>
                </div>
            </main>

            {isCompareOpen && <ComparePanel bookId={bookId} chapterId={chapterId} currentVersion={bibleVersion} onClose={() => setIsCompareOpen(false)} />}



            <AnimatePresence>
                {isNoteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsNoteModalOpen(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-card w-full max-w-lg rounded-3xl p-8 border border-primary/10 relative z-10 shadow-2xl">
                            <h3 className="text-xl font-black mb-4">Anotação</h3>
                            <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} className="w-full h-48 bg-foreground/5 rounded-2xl p-4 outline-none resize-none mb-6" />
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setIsNoteModalOpen(false)}>Cancelar</Button>
                                <Button onClick={handleSaveNote}>Salvar</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {dictionaryWord && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm p-6 glass-panel border-primary/20 shadow-2xl z-50">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-black">{dictionaryWord.word}</h4>
                            <Badge variant="outline">{dictionaryWord.category}</Badge>
                            <button onClick={() => setDictionaryWord(null)}><X className="h-4 w-4" /></button>
                        </div>
                        <p className="text-sm opacity-80 italic">{dictionaryWord.definition}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
