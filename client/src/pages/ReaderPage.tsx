import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { ChevronLeft, ChevronRight, Heart, Copy, Highlighter, Check, Share2, Maximize2, Minimize2, BookOpen } from 'lucide-react';
import { usePreferencesStore } from '../store/preferencesStore';
import { cn } from '../utils/cn';

interface Verse { number: string; text: string; }
interface BookInfo { number: string; name: string; chaptersCount: number; }

export const ReaderPage: React.FC = () => {
    const { bookId = '1', chapterId = '1' } = useParams();
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const {
        fontSize, serifFont, readingWidth, lineHeight,
        showVerseNumbers, focusMode, setFocusMode, setLastRead
    } = usePreferencesStore();

    const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
    const [highlighted, setHighlighted] = useState<Set<string>>(() => {
        try { return new Set(JSON.parse(localStorage.getItem('highlighted-verses') || '[]')); } catch { return new Set(); }
    });
    const [favorited, setFavorited] = useState<Set<string>>(() => {
        try { return new Set(JSON.parse(localStorage.getItem('favorited-verses') || '[]')); } catch { return new Set(); }
    });
    const [copiedVerse, setCopiedVerse] = useState<string | null>(null);

    const { data: books } = useQuery<BookInfo[]>({ queryKey: ['reader-books'], queryFn: async () => (await api.get('/bible/livros')).data });
    const { data: verses, isLoading, error } = useQuery<Verse[]>({
        queryKey: ['verses', bookId, chapterId],
        queryFn: async () => (await api.get(`/bible/livros/${bookId}/capitulos/${chapterId}/versiculos`)).data,
    });

    const currentBook = books?.find(b => b.number === bookId);
    const chNum = parseInt(chapterId);
    const hasPrev = chNum > 1;
    const hasNext = currentBook ? chNum < currentBook.chaptersCount : false;

    useEffect(() => {
        if (currentBook) setLastRead(bookId, currentBook.name, chapterId);
    }, [bookId, chapterId, currentBook, setLastRead]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        setSelectedVerse(null);
    }, [bookId, chapterId]);

    useEffect(() => { localStorage.setItem('highlighted-verses', JSON.stringify([...highlighted])); }, [highlighted]);
    useEffect(() => { localStorage.setItem('favorited-verses', JSON.stringify([...favorited])); }, [favorited]);

    // Hide sidebar in focus mode
    useEffect(() => {
        const sidebar = document.querySelector('aside');
        const hamburger = document.querySelector('button.md\\:hidden.fixed');
        if (focusMode) {
            sidebar?.classList.add('!hidden');
            hamburger?.classList.add('!hidden');
        } else {
            sidebar?.classList.remove('!hidden');
            hamburger?.classList.remove('!hidden');
        }
        return () => {
            sidebar?.classList.remove('!hidden');
            hamburger?.classList.remove('!hidden');
        };
    }, [focusMode]);

    const goChapter = (dir: 'prev' | 'next') => {
        const n = dir === 'next' ? chNum + 1 : chNum - 1;
        if (n >= 1) navigate(`/reader/${bookId}/${n}`);
    };

    const makeKey = (num: string) => `${bookId}:${chapterId}:${num}`;

    const toggleHighlight = (num: string) => {
        const key = makeKey(num);
        setHighlighted(prev => { const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s; });
    };

    const toggleFavorite = (num: string) => {
        const key = makeKey(num);
        setFavorited(prev => { const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s; });
    };

    const copyVerse = (v: Verse) => {
        const text = `"${v.text}" — ${currentBook?.name} ${chapterId}:${v.number}`;
        navigator.clipboard.writeText(text);
        setCopiedVerse(v.number);
        setTimeout(() => setCopiedVerse(null), 2000);
    };

    const shareVerse = (v: Verse) => {
        const text = `"${v.text}" — ${currentBook?.name} ${chapterId}:${v.number}`;
        if (navigator.share) navigator.share({ text });
        else { navigator.clipboard.writeText(text); setCopiedVerse(v.number); setTimeout(() => setCopiedVerse(null), 2000); }
    };

    const widthClass = focusMode
        ? 'max-w-xl'
        : readingWidth === 'narrow' ? 'max-w-lg' : readingWidth === 'wide' ? 'max-w-4xl' : 'max-w-2xl';

    const chapterNumbers = currentBook ? Array.from({ length: currentBook.chaptersCount }, (_, i) => i + 1) : [];

    const effectiveFontSize = focusMode ? Math.min(fontSize + 2, 32) : fontSize;

    return (
        <div className="flex flex-col h-full focus-transition">
            {/* Sticky header */}
            <div className={cn(
                "sticky top-0 z-20 backdrop-blur-md border-b px-4 md:px-6 py-2.5 flex items-center justify-between shrink-0 focus-transition",
                focusMode ? 'bg-background/90' : 'bg-card/95'
            )}>
                <div className="flex items-center gap-3 ml-10 md:ml-0">
                    {focusMode && (
                        <BookOpen className="h-5 w-5 text-primary mr-1" />
                    )}
                    <select value={bookId} onChange={e => navigate(`/reader/${e.target.value}/1`)}
                        className="bg-transparent font-bold text-base outline-none cursor-pointer hover:text-primary transition-colors max-w-[160px] truncate">
                        {books?.map(b => <option key={b.number} value={b.number}>{b.name}</option>)}
                    </select>
                    <div className="h-5 w-px bg-border" />
                    <select value={chapterId} onChange={e => navigate(`/reader/${bookId}/${e.target.value}`)}
                        className="bg-transparent font-medium text-sm outline-none cursor-pointer hover:text-primary transition-colors">
                        {chapterNumbers.map(n => <option key={n} value={n}>Cap. {n}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon"
                        onClick={() => setFocusMode(!focusMode)}
                        className={cn("rounded-xl h-9 w-9", focusMode && "text-primary bg-primary/10")}
                        title={focusMode ? 'Sair do Modo Foco' : 'Modo Foco'}>
                        {focusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    <div className="h-5 w-px bg-border mx-1" />
                    <Button variant="ghost" size="icon" disabled={!hasPrev} onClick={() => goChapter('prev')} className="rounded-xl h-9 w-9">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-xs font-bold text-muted-foreground min-w-[3ch] text-center">{chapterId}</span>
                    <Button variant="ghost" size="icon" disabled={!hasNext} onClick={() => goChapter('next')} className="rounded-xl h-9 w-9">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Focus mode banner */}
            {focusMode && (
                <div className="bg-primary/5 border-b border-primary/10 py-1.5 text-center text-xs font-bold text-primary tracking-wider uppercase animate-in fade-in duration-300">
                    ✦ Modo Foco Ativado ✦
                </div>
            )}

            {/* Reading area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-background focus-transition">
                <div className={cn('mx-auto px-6 md:px-8 py-10 focus-transition', widthClass)}>
                    <div className="text-center mb-10 space-y-2">
                        <p className="text-xs font-black text-primary uppercase tracking-[0.25em]">{currentBook?.name}</p>
                        <h2 className={cn("font-black text-foreground/20", focusMode ? "text-6xl" : "text-5xl")}>
                            {chapterId}
                        </h2>
                    </div>

                    {error && (
                        <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-2xl text-center">
                            <p className="font-bold text-destructive">Erro ao carregar versículos</p>
                            <p className="text-sm text-muted-foreground mt-1">Verifique se o servidor backend está rodando.</p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="space-y-4 animate-pulse">
                            {[...Array(12)].map((_, i) => <div key={i} className="h-5 bg-muted rounded" style={{ width: `${60 + Math.random() * 40}%` }} />)}
                        </div>
                    )}

                    <div className="space-y-0.5">
                        {verses?.map(verse => {
                            const key = makeKey(verse.number);
                            const isSelected = selectedVerse === verse.number;
                            const isHL = highlighted.has(key);
                            const isFav = favorited.has(key);

                            return (
                                <div key={verse.number} id={`v-${verse.number}`}>
                                    <p
                                        onClick={() => setSelectedVerse(isSelected ? null : verse.number)}
                                        className={cn(
                                            'cursor-pointer rounded-lg px-3 py-1 transition-all select-text',
                                            serifFont ? 'font-serif' : '',
                                            isHL ? 'bg-yellow-200/60 dark:bg-yellow-800/30 hover:bg-yellow-200/80' : 'hover:bg-primary/5',
                                            isSelected ? 'bg-primary/10 ring-2 ring-primary/20 shadow-sm' : ''
                                        )}
                                        style={{ fontSize: `${effectiveFontSize}px`, lineHeight: lineHeight }}
                                    >
                                        {showVerseNumbers && (
                                            <sup className="text-primary font-black text-[0.6em] mr-2 select-none align-top">{verse.number}</sup>
                                        )}
                                        {verse.text}
                                    </p>

                                    {/* Floating action toolbar */}
                                    {isSelected && (
                                        <div className="flex items-center gap-1.5 py-2 pl-3 animate-in fade-in slide-in-from-top-1 duration-150">
                                            <button onClick={() => toggleFavorite(verse.number)}
                                                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                                    isFav ? "bg-pink-500/10 text-pink-500" : "bg-muted hover:bg-muted/80")}>
                                                <Heart className={cn("h-3.5 w-3.5", isFav && "fill-pink-500")} />
                                                {isFav ? 'Salvo' : 'Favoritar'}
                                            </button>
                                            <button onClick={() => toggleHighlight(verse.number)}
                                                className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                                    isHL ? "bg-yellow-500/10 text-yellow-600" : "bg-muted hover:bg-muted/80")}>
                                                <Highlighter className="h-3.5 w-3.5" />
                                                {isHL ? 'Remover' : 'Destacar'}
                                            </button>
                                            <button onClick={() => copyVerse(verse)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-muted hover:bg-muted/80 transition-all">
                                                {copiedVerse === verse.number ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copiado!</> : <><Copy className="h-3.5 w-3.5" /> Copiar</>}
                                            </button>
                                            <button onClick={() => shareVerse(verse)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-muted hover:bg-muted/80 transition-all">
                                                <Share2 className="h-3.5 w-3.5" /> Enviar
                                            </button>
                                            {!focusMode && (
                                                <button onClick={() => setFocusMode(true)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                                                    <Maximize2 className="h-3.5 w-3.5" /> Foco
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {verses && verses.length > 0 && (
                        <div className="flex items-center justify-between pt-16 pb-10 border-t mt-16">
                            <Button variant="outline" disabled={!hasPrev} onClick={() => goChapter('prev')} className="gap-2 rounded-xl h-12">
                                <ChevronLeft className="h-4 w-4" /> Anterior
                            </Button>
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground">{currentBook?.name}</p>
                                <p className="font-bold">Capítulo {chapterId}</p>
                            </div>
                            <Button variant="outline" disabled={!hasNext} onClick={() => goChapter('next')} className="gap-2 rounded-xl h-12">
                                Próximo <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
