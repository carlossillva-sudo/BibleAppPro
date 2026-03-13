import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { bibleClient } from '../services/bibleClient.service';
import { Button } from '../components/ui/Button';
import {
  Heart,
  Copy,
  Highlighter,
  Maximize2,
  Minimize2,
  Sparkles,
  Book as BookCopyIcon,
  Bookmark,
  BookmarkCheck,
  StickyNote,
  X,
  Check,
  CheckSquare,
  Settings2,
  ArrowLeft,
  ArrowRight,
  Moon,
  Keyboard,
  Underline,
  Bold,
  Share2,
  Printer,
  Trash2,
  MessageCircle,
  Link,
} from 'lucide-react';
import { usePreferencesStore } from '../store/preferencesStore';
import { cn } from '../utils/cn';
import { VersionSelector } from '../components/bible/VersionSelector';
import { ComparePanel } from '../components/bible/ComparePanel';
import { useHistoryStore } from '../store/historyStore';
import { useNotesStore } from '../store/notesStore';
import { dictionaryData } from '../data/dictionaryData';
import { bookIntroductions } from '../data/bookIntroductions';
import { Badge } from '../components/ui/Badge';

interface Verse {
  number: string;
  text?: string;
  content?: string;
}
interface BookInfo {
  number: string;
  name: string;
  chaptersCount: number;
}
interface ChapterData {
  bookId: string;
  bookName: string;
  chapterId: string;
  verses: Verse[];
}

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'purple' | null;

interface VerseStyle {
  highlight?: HighlightColor;
  underline?: boolean;
  bold?: boolean;
}

export const ReaderPage: React.FC = () => {
  const { bookId = '1', chapterId = '1' } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const {
    fontSize,
    fontFamily,
    readingWidth,
    lineHeight,
    showVerseNumbers,
    focusMode,
    setFocusMode,
    setLastRead,
    bibleVersion,
    verseSpacing,
    boldVerses,
    nightMode,
    nightModeIntensity,
    setNightMode,
  } = usePreferencesStore();

  const [selectedVerse, setSelectedVerse] = useState<{ chapter: string; number: string } | null>(
    null
  );
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [dictionaryWord, setDictionaryWord] = useState<{
    word: string;
    definition: string;
    category?: string;
  } | null>(null);
  const [copiedVerse, setCopiedVerse] = useState<string | null>(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<Set<string>>(new Set());

  const [verseStyles, setVerseStyles] = useState<Record<string, VerseStyle>>(() => {
    try {
      return JSON.parse(localStorage.getItem('verse-styles') || '{}');
    } catch {
      return {};
    }
  });

  const [highlighted, setHighlighted] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('highlighted-verses') || '[]'));
    } catch {
      return new Set();
    }
  });
  const [favorited, setFavorited] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('favorited-verses') || '[]'));
    } catch {
      return new Set();
    }
  });

  const { bookmarks, addBookmark, removeBookmark, addHistory } = useHistoryStore();
  const { addNote, getNote } = useNotesStore();

  const { data: books } = useQuery<BookInfo[]>({
    queryKey: ['reader-books', bibleVersion],
    queryFn: async () => await bibleClient.getBooks(bibleVersion),
  });

  const currentBook = books?.find((b) => b.number === bookId);

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ChapterData>({
    queryKey: ['verses-infinite', bookId, bibleVersion, chapterId],
    initialPageParam: chapterId,
    queryFn: async ({ pageParam }) => {
      const chId = pageParam as string;
      const verses = await bibleClient.getChapter(bookId, chId, bibleVersion);
      return {
        bookId,
        bookName: currentBook?.name || '',
        chapterId: chId,
        verses,
      };
    },
    getNextPageParam: (lastPage) => {
      if (!currentBook) return undefined;
      const nextCh = parseInt(lastPage.chapterId) + 1;
      return nextCh <= currentBook.chaptersCount ? nextCh.toString() : undefined;
    },
    enabled: !!currentBook,
  });

  const loadedChapters = infiniteData?.pages || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [loadedChapters, bookId, chapterId, currentBook, setLastRead]);

  useEffect(() => {
    if (currentBook) {
      setLastRead(bookId, currentBook.name, chapterId);
      addHistory({ bookId, bookName: currentBook.name, chapterId });
    }
  }, [bookId, chapterId, currentBook, setLastRead, addHistory]);

  useEffect(() => {
    localStorage.setItem('highlighted-verses', JSON.stringify([...highlighted]));
  }, [highlighted]);
  useEffect(() => {
    localStorage.setItem('favorited-verses', JSON.stringify([...favorited]));
  }, [favorited]);
  useEffect(() => {
    localStorage.setItem('verse-styles', JSON.stringify(verseStyles));
  }, [verseStyles]);

  const makeKey = (ch: string, num: string) => `${bookId}:${ch}:${num}`;

  const toggleHighlight = (ch: string, num: string, color?: HighlightColor) => {
    const key = makeKey(ch, num);
    setVerseStyles((prev) => {
      const current = prev[key] || {};
      if (current.highlight && !color) {
        return { ...prev, [key]: { ...current, highlight: null } };
      }
      return { ...prev, [key]: { ...current, highlight: color || 'yellow' } };
    });
    setHighlighted((prev) => {
      const s = new Set(prev);
      s.has(key) ? s.delete(key) : s.add(key);
      return s;
    });
  };

  const toggleUnderline = (ch: string, num: string) => {
    const key = makeKey(ch, num);
    setVerseStyles((prev) => {
      const current = prev[key] || {};
      return { ...prev, [key]: { ...current, underline: !current.underline } };
    });
  };

  const toggleBold = (ch: string, num: string) => {
    const key = makeKey(ch, num);
    setVerseStyles((prev) => {
      const current = prev[key] || {};
      return { ...prev, [key]: { ...current, bold: !current.bold } };
    });
  };

  const clearVerseStyle = (ch: string, num: string) => {
    const key = makeKey(ch, num);
    setVerseStyles((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
    setHighlighted((prev) => {
      const s = new Set(prev);
      s.delete(key);
      return s;
    });
  };

  // Multi-select functions
  const toggleVerseSelection = (ch: string, num: string) => {
    const key = makeKey(ch, num);
    setSelectedVerses((prev) => {
      const s = new Set(prev);
      s.has(key) ? s.delete(key) : s.add(key);
      return s;
    });
  };

  const clearSelection = () => {
    setSelectedVerses(new Set());
    setMultiSelectMode(false);
  };

  const applyHighlightToSelected = (color: HighlightColor) => {
    selectedVerses.forEach((key) => {
      setVerseStyles((prev) => ({
        ...prev,
        [key]: { ...prev[key], highlight: color },
      }));
      setHighlighted((prev) => new Set([...prev, key]));
    });
    clearSelection();
  };

  const applyUnderlineToSelected = () => {
    selectedVerses.forEach((key) => {
      setVerseStyles((prev) => ({
        ...prev,
        [key]: { ...prev[key], underline: true },
      }));
    });
    clearSelection();
  };

  const applyBoldToSelected = () => {
    selectedVerses.forEach((key) => {
      setVerseStyles((prev) => ({
        ...prev,
        [key]: { ...prev[key], bold: true },
      }));
    });
    clearSelection();
  };

  const toggleFavorite = (ch: string, num: string) => {
    const key = makeKey(ch, num);
    setFavorited((prev) => {
      const s = new Set(prev);
      s.has(key) ? s.delete(key) : s.add(key);
      return s;
    });
  };

  const copyVerse = (ch: string, v: Verse) => {
    const textToCopy = `"${v.text || v.content}" — ${currentBook?.name} ${ch}:${v.number}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerse(v.number);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const shareVerse = (
    ch: string,
    v: Verse,
    platform: 'whatsapp' | 'telegram' | 'facebook' | 'twitter' | 'copy'
  ) => {
    const text = `"${v.text || v.content}" — ${currentBook?.name} ${ch}:${v.number}`;
    const encodedText = encodeURIComponent(text);

    if (platform === 'copy') {
      navigator.clipboard.writeText(text);
      setCopiedVerse(v.number);
      setTimeout(() => setCopiedVerse(null), 2000);
      return;
    }

    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
    };

    window.open(urls[platform], '_blank');
    setShowShareMenu(false);
  };

  const printChapter = () => {
    const printContent = loadedChapters
      .map((page) => page.verses.map((v) => `${v.number}. ${v.text || v.content}`).join('\n\n'))
      .join('\n\n');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${currentBook?.name} ${chapterId} - BibleAppPro</title>
            <style>
              body { font-family: Georgia, serif; max-width: 700px; margin: 0 auto; padding: 40px; line-height: 1.8; }
              h1 { font-size: 24px; margin-bottom: 20px; }
              p { margin-bottom: 16px; text-align: justify; }
              .verse-number { color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <h1>${currentBook?.name} ${chapterId}</h1>
            <pre style="font-family: Georgia, serif; white-space: pre-wrap;">${printContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      handleNextChapter();
    } else {
      handlePrevChapter();
    }
  };

  const handleNextChapter = useCallback(() => {
    if (currentBook && parseInt(chapterId) < currentBook.chaptersCount) {
      navigate(`/reader/${bookId}/${parseInt(chapterId) + 1}`);
    } else if (currentBook && parseInt(chapterId) === currentBook.chaptersCount) {
      const nextBookNum = parseInt(bookId) + 1;
      if (books && nextBookNum <= books.length) {
        navigate(`/reader/${nextBookNum}/1`);
      }
    }
  }, [currentBook, chapterId, bookId, books, navigate]);

  const handlePrevChapter = useCallback(() => {
    if (parseInt(chapterId) > 1) {
      navigate(`/reader/${bookId}/${parseInt(chapterId) - 1}`);
    } else if (parseInt(bookId) > 1) {
      const prevBookNum = parseInt(bookId) - 1;
      const prevBook = books?.find((b) => b.number === prevBookNum.toString());
      if (prevBook) {
        navigate(`/reader/${prevBookNum}/${prevBook.chaptersCount}`);
      }
    }
  }, [chapterId, bookId, books, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case 'ArrowRight':
          if (e.altKey) {
            e.preventDefault();
            handleNextChapter();
          }
          break;
        case 'ArrowLeft':
          if (e.altKey) {
            e.preventDefault();
            handlePrevChapter();
          }
          break;
        case 'j':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            const verses = document.querySelectorAll('.verse-element');
            const current = document.querySelector('.verse-element.selected');
            const currentIndex = Array.from(verses).indexOf(current as Element);
            if (currentIndex < verses.length - 1) {
              (verses[currentIndex + 1] as HTMLElement).click();
              (verses[currentIndex + 1] as HTMLElement).scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }
          break;
        case 'k':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            const verses = document.querySelectorAll('.verse-element');
            const current = document.querySelector('.verse-element.selected');
            const currentIndex = Array.from(verses).indexOf(current as Element);
            if (currentIndex > 0) {
              (verses[currentIndex - 1] as HTMLElement).click();
              (verses[currentIndex - 1] as HTMLElement).scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }
          break;
        case 'Escape':
          setSelectedVerse(null);
          break;
        case '?':
          if (e.shiftKey) {
            e.preventDefault();
            setShowShortcutsHelp(true);
          }
          break;
        case 'h':
          if (selectedVerse && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setShowHighlightPicker(!showHighlightPicker);
          }
          break;
        case 'u':
          if (selectedVerse && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleUnderline(selectedVerse.chapter, selectedVerse.number);
          }
          break;
        case 'b':
          if (selectedVerse && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            toggleBold(selectedVerse.chapter, selectedVerse.number);
          }
          break;
        case 's':
          if (selectedVerse && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setShowShareMenu(!showShareMenu);
          }
          break;
        case 'p':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            printChapter();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextChapter, handlePrevChapter]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          handleSwipe('left');
        } else {
          handleSwipe('right');
        }
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
      scrollContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('touchstart', handleTouchStart);
        scrollContainer.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  const toggleBookmark = (ch: string, vNum: string) => {
    const isBookmarked = bookmarks.some(
      (b) => b.bookId === bookId && b.chapterId === ch && b.verseNumber === vNum
    );
    if (isBookmarked) removeBookmark(bookId, ch, vNum);
    else
      addBookmark({ bookId, bookName: currentBook?.name || '', chapterId: ch, verseNumber: vNum });
  };

  const handleOpenNote = (ch: string, vNum: string) => {
    const existing = getNote(bookId, ch, vNum);
    setNoteContent(existing?.content || '');
    setSelectedVerse({ chapter: ch, number: vNum });
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = () => {
    if (selectedVerse) {
      addNote({
        bookId,
        chapterId: selectedVerse.chapter,
        verseNumber: selectedVerse.number,
        content: noteContent,
      });
      setIsNoteModalOpen(false);
      setNoteContent('');
    }
  };

  const handleWordClick = (text: string) => {
    const found = dictionaryData.find((entry) =>
      text.toLowerCase().includes(entry.word.toLowerCase())
    );
    if (found) setDictionaryWord(found);
  };

  const widthClass = focusMode
    ? 'max-w-xl'
    : readingWidth === 'narrow'
      ? 'max-w-lg'
      : readingWidth === 'wide'
        ? 'max-w-4xl'
        : 'max-w-2xl';
  const effectiveFontSize = focusMode ? Math.min(fontSize + 2, 32) : fontSize;

  const nightModeOverlay = nightMode ? (
    <div
      className="fixed inset-0 pointer-events-none z-30"
      style={{
        backgroundColor: `rgba(59, 130, 246, ${nightModeIntensity / 100})`,
        mixBlendMode: 'multiply',
      }}
    />
  ) : null;

  return (
    <div className="flex flex-col h-full bg-background selection:bg-primary/20 overflow-hidden">
      {nightModeOverlay}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <motion.div
          className="h-full bg-primary origin-left"
          style={{
            scaleX: useSpring(useScroll({ container: scrollRef }).scrollYProgress, {
              stiffness: 100,
              damping: 30,
            }),
          }}
        />
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 px-4 md:px-8 py-3 flex items-center justify-between glass-panel border-x-0 rounded-none shadow-md transition-all duration-700',
          focusMode && 'opacity-0 -translate-y-full'
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevChapter}
              className="rounded-xl"
              title="Capítulo anterior (Alt+←)"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextChapter}
              className="rounded-xl"
              title="Próximo capítulo (Alt+→)"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <select
                value={bookId}
                onChange={(e) => navigate(`/reader/${e.target.value}/1`)}
                className="bg-transparent font-black tracking-tighter outline-none cursor-pointer"
              >
                {books?.map((b) => (
                  <option key={b.number} value={b.number}>
                    {b.name}
                  </option>
                ))}
              </select>
              <select
                value={chapterId}
                onChange={(e) => navigate(`/reader/${bookId}/${e.target.value}`)}
                className="bg-transparent font-black text-primary/80 outline-none cursor-pointer"
              >
                {Array.from({ length: currentBook?.chaptersCount || 0 }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCompareOpen(!isCompareOpen)}
            className={cn('rounded-xl', isCompareOpen && 'bg-primary/10')}
            title="Comparar Versões"
          >
            <BookCopyIcon className="h-4 w-4" />
          </Button>
          <VersionSelector />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/personalization')}
            className="rounded-xl"
            title="Personalização"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNightMode(!nightMode)}
            className={cn('rounded-xl', nightMode && 'bg-blue-500/20 text-blue-600')}
            title="Modo Leitura Noturna"
          >
            <Moon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={printChapter}
            className="rounded-xl"
            title="Imprimir / Visualizar"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setMultiSelectMode(!multiSelectMode);
              if (multiSelectMode) clearSelection();
            }}
            className={cn('rounded-xl', multiSelectMode && 'bg-primary/20 text-primary')}
            title="Selecionar múltiplos versículos"
          >
            <CheckSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowShortcutsHelp(true)}
            className="rounded-xl"
            title="Atalhos de teclado (?)"
          >
            <Keyboard className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFocusMode(!focusMode)}
            className="rounded-xl"
            title="Modo Foco"
          >
            {focusMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
        <div className={cn('mx-auto px-6 py-12 space-y-24', widthClass)}>
          {loadedChapters.map((page, pageIdx) => {
            const intro = bookIntroductions[page.bookId];
            return (
              <section
                key={`${page.bookId}-${page.chapterId}`}
                data-chapter={page.chapterId}
                className="chapter-section space-y-12"
              >
                {pageIdx === 0 && page.chapterId === '1' && intro && (
                  <div className="p-8 premium-card border-primary/20 bg-primary/5 rounded-3xl space-y-4">
                    <h2 className="text-3xl font-black">Introdução a {intro.title}</h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="opacity-60 uppercase text-[10px] font-black">Autor</p>
                        <p className="font-bold">{intro.author}</p>
                      </div>
                      <div>
                        <p className="opacity-60 uppercase text-[10px] font-black">Tema</p>
                        <p className="font-bold">{intro.theme}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{intro.context}</p>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
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
                  {page.verses.map((verse) => {
                    const key = makeKey(page.chapterId, verse.number);
                    const isSelected =
                      selectedVerse?.chapter === page.chapterId &&
                      selectedVerse?.number === verse.number;
                    const note = getNote(bookId, page.chapterId, verse.number);
                    const spacingClass =
                      verseSpacing === 'compact'
                        ? 'py-1'
                        : verseSpacing === 'relaxed'
                          ? 'py-5'
                          : 'py-3';
                    const isMultiSelected = selectedVerses.has(key);
                    return (
                      <div key={verse.number} className="relative group">
                        <p
                          onClick={(e) => {
                            if (e.ctrlKey || e.metaKey) {
                              e.preventDefault();
                              toggleVerseSelection(page.chapterId, verse.number);
                            } else if (multiSelectMode) {
                              toggleVerseSelection(page.chapterId, verse.number);
                            } else {
                              setSelectedVerse(
                                isSelected
                                  ? null
                                  : { chapter: page.chapterId, number: verse.number }
                              );
                              handleWordClick(verse.text || verse.content || '');
                            }
                          }}
                          className={cn(
                            'reader-text px-4 rounded-2xl transition-all cursor-pointer select-none',
                            spacingClass,
                            (boldVerses || verseStyles[key]?.bold) && 'font-bold',
                            verseStyles[key]?.highlight === 'yellow' && 'bg-yellow-400/20',
                            verseStyles[key]?.highlight === 'green' && 'bg-green-400/20',
                            verseStyles[key]?.highlight === 'blue' && 'bg-blue-400/20',
                            verseStyles[key]?.highlight === 'pink' && 'bg-pink-400/20',
                            verseStyles[key]?.highlight === 'purple' && 'bg-purple-400/20',
                            !verseStyles[key]?.highlight &&
                              highlighted.has(key) &&
                              'bg-yellow-500/10',
                            isSelected && 'bg-primary/5 ring-1 ring-primary/20 scale-[1.01]',
                            isMultiSelected && 'ring-2 ring-primary bg-primary/10',
                            verseStyles[key]?.underline &&
                              'underline decoration-2 underline-offset-4'
                          )}
                          style={{
                            fontSize: `${effectiveFontSize}px`,
                            lineHeight,
                            fontFamily: fontFamily === 'System' ? 'inherit' : fontFamily,
                          }}
                        >
                          {showVerseNumbers && (
                            <span className="text-[0.6em] font-black opacity-30 mr-3 align-top">
                              {verse.number}
                            </span>
                          )}
                          {verse.text || verse.content}
                          {note && <StickyNote className="inline h-3 w-3 ml-2 text-primary" />}
                        </p>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute -top-12 left-0 flex gap-1 p-1 glass-panel rounded-xl shadow-xl z-10"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(page.chapterId, verse.number);
                                }}
                                className="p-2 hover:bg-primary/10 rounded-lg"
                                title="Marcar"
                              >
                                {bookmarks.some(
                                  (b) =>
                                    b.bookId === bookId &&
                                    b.chapterId === page.chapterId &&
                                    b.verseNumber === verse.number
                                ) ? (
                                  <BookmarkCheck className="h-4 w-4 text-primary" />
                                ) : (
                                  <Bookmark className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(page.chapterId, verse.number);
                                }}
                                className="p-2 hover:bg-pink-500/10 rounded-lg"
                                title="Favoritar"
                              >
                                <Heart
                                  className={cn(
                                    'h-4 w-4',
                                    favorited.has(key) && 'fill-pink-500 text-pink-500'
                                  )}
                                />
                              </button>

                              {/* Highlight Colors */}
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowHighlightPicker(!showHighlightPicker);
                                  }}
                                  className="p-2 hover:bg-yellow-500/10 rounded-lg"
                                  title="Destacar"
                                >
                                  <Highlighter
                                    className={cn(
                                      'h-4 w-4',
                                      verseStyles[key]?.highlight === 'yellow' && 'text-yellow-500',
                                      verseStyles[key]?.highlight === 'green' && 'text-green-500',
                                      verseStyles[key]?.highlight === 'blue' && 'text-blue-500',
                                      verseStyles[key]?.highlight === 'pink' && 'text-pink-500',
                                      verseStyles[key]?.highlight === 'purple' && 'text-purple-500'
                                    )}
                                  />
                                </button>
                                {showHighlightPicker && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full left-0 mt-1 p-2 bg-card rounded-xl shadow-xl border flex gap-1"
                                  >
                                    {['yellow', 'green', 'blue', 'pink', 'purple'].map((color) => (
                                      <button
                                        key={color}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleHighlight(
                                            page.chapterId,
                                            verse.number,
                                            color as HighlightColor
                                          );
                                          setShowHighlightPicker(false);
                                        }}
                                        className={cn(
                                          'w-6 h-6 rounded-full border-2',
                                          color === 'yellow' && 'bg-yellow-400',
                                          color === 'green' && 'bg-green-400',
                                          color === 'blue' && 'bg-blue-400',
                                          color === 'pink' && 'bg-pink-400',
                                          color === 'purple' && 'bg-purple-400',
                                          verseStyles[key]?.highlight === color &&
                                            'ring-2 ring-offset-2 ring-primary'
                                        )}
                                      />
                                    ))}
                                  </motion.div>
                                )}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleUnderline(page.chapterId, verse.number);
                                }}
                                className={cn(
                                  'p-2 rounded-lg',
                                  verseStyles[key]?.underline
                                    ? 'bg-primary/10'
                                    : 'hover:bg-primary/10'
                                )}
                                title="Sublinhar"
                              >
                                <Underline
                                  className={cn(
                                    'h-4 w-4',
                                    verseStyles[key]?.underline && 'text-primary'
                                  )}
                                />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBold(page.chapterId, verse.number);
                                }}
                                className={cn(
                                  'p-2 rounded-lg',
                                  verseStyles[key]?.bold ? 'bg-primary/10' : 'hover:bg-primary/10'
                                )}
                                title="Negrito"
                              >
                                <Bold
                                  className={cn(
                                    'h-4 w-4',
                                    verseStyles[key]?.bold && 'text-primary'
                                  )}
                                />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenNote(page.chapterId, verse.number);
                                }}
                                className="p-2 hover:bg-primary/10 rounded-lg"
                                title="Anotação"
                              >
                                <StickyNote className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowShareMenu(!showShareMenu);
                                }}
                                className="p-2 hover:bg-primary/10 rounded-lg relative"
                                title="Compartilhar"
                              >
                                <Share2 className="h-4 w-4" />
                              </button>

                              {/* Share Menu */}
                              {showShareMenu && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="absolute top-full left-0 mt-1 p-2 bg-card rounded-xl shadow-xl border flex gap-1 z-20"
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      shareVerse(page.chapterId, verse, 'whatsapp');
                                    }}
                                    className="p-2 hover:bg-green-500/10 rounded-lg"
                                    title="WhatsApp"
                                  >
                                    <MessageCircle className="h-4 w-4 text-green-500" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      shareVerse(page.chapterId, verse, 'telegram');
                                    }}
                                    className="p-2 hover:bg-blue-500/10 rounded-lg"
                                    title="Telegram"
                                  >
                                    <MessageCircle className="h-4 w-4 text-blue-500" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      shareVerse(page.chapterId, verse, 'twitter');
                                    }}
                                    className="p-2 hover:bg-black/10 rounded-lg"
                                    title="Twitter/X"
                                  >
                                    <span className="text-xs font-bold">𝕏</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      shareVerse(page.chapterId, verse, 'copy');
                                    }}
                                    className="p-2 hover:bg-primary/10 rounded-lg"
                                    title="Copiar"
                                  >
                                    {copiedVerse === verse.number ? (
                                      <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Link className="h-4 w-4" />
                                    )}
                                  </button>
                                </motion.div>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyVerse(page.chapterId, verse);
                                }}
                                className="p-2 hover:bg-primary/10 rounded-lg relative"
                                title="Copiar"
                              >
                                {copiedVerse === verse.number ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                                {copiedVerse === verse.number && (
                                  <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-green-500 bg-background px-1 rounded shadow-sm"
                                  >
                                    Copiado!
                                  </motion.span>
                                )}
                              </button>

                              {/* Clear styles */}
                              {(verseStyles[key]?.highlight ||
                                verseStyles[key]?.underline ||
                                verseStyles[key]?.bold) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    clearVerseStyle(page.chapterId, verse.number);
                                  }}
                                  className="p-2 hover:bg-red-500/10 rounded-lg"
                                  title="Limpar"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </button>
                              )}
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
            {isFetchingNextPage ? (
              <Sparkles className="animate-spin" />
            ) : hasNextPage ? (
              'Carregando...'
            ) : (
              'Fim do Livro'
            )}
          </div>
        </div>
      </main>

      {isCompareOpen && (
        <ComparePanel
          bookId={bookId}
          chapterId={chapterId}
          currentVersion={bibleVersion}
          onClose={() => setIsCompareOpen(false)}
        />
      )}

      <AnimatePresence>
        {isNoteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsNoteModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card w-full max-w-lg rounded-3xl p-8 border border-primary/10 relative z-10 shadow-2xl"
            >
              <h3 className="text-xl font-black mb-4">Anotação</h3>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full h-48 bg-foreground/5 rounded-2xl p-4 outline-none resize-none mb-6"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsNoteModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveNote}>Salvar</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dictionaryWord && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm p-6 glass-panel border-primary/20 shadow-2xl z-50"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-black">{dictionaryWord.word}</h4>
              <Badge variant="outline">{dictionaryWord.category}</Badge>
              <button onClick={() => setDictionaryWord(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm opacity-80 italic">{dictionaryWord.definition}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShortcutsHelp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowShortcutsHelp(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card w-full max-w-md rounded-3xl p-6 border border-primary/10 relative z-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black">Atalhos de Teclado</h3>
                <button
                  onClick={() => setShowShortcutsHelp(false)}
                  className="p-2 hover:bg-foreground/5 rounded-xl"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'Alt + →', desc: 'Próximo capítulo' },
                  { key: 'Alt + ←', desc: 'Capítulo anterior' },
                  { key: 'j', desc: 'Próximo versículo' },
                  { key: 'k', desc: 'Versículo anterior' },
                  { key: 'h', desc: 'Destacar (cores)' },
                  { key: 'u', desc: 'Sublinhar' },
                  { key: 'b', desc: 'Negrito' },
                  { key: 's', desc: 'Compartilhar' },
                  { key: 'p', desc: 'Imprimir' },
                  { key: 'Esc', desc: 'Fechar menu' },
                  { key: '?', desc: 'Mostrar atalhos' },
                ].map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between py-2 border-b border-foreground/5 last:border-0"
                  >
                    <kbd className="px-3 py-1.5 bg-foreground/5 rounded-lg font-mono text-sm font-bold">
                      {shortcut.key}
                    </kbd>
                    <span className="text-sm text-muted-foreground">{shortcut.desc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Multi-select Toolbar */}
      <AnimatePresence>
        {multiSelectMode && selectedVerses.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 p-2 glass-panel rounded-2xl shadow-2xl border border-primary/20">
              <span className="px-3 text-sm font-bold text-primary">
                {selectedVerses.size} versículo(s)
              </span>
              <div className="w-px h-6 bg-border" />

              {/* Highlight colors */}
              <div className="flex gap-1">
                {[
                  { color: 'yellow', bg: 'bg-yellow-400' },
                  { color: 'green', bg: 'bg-green-400' },
                  { color: 'blue', bg: 'bg-blue-400' },
                  { color: 'pink', bg: 'bg-pink-400' },
                  { color: 'purple', bg: 'bg-purple-400' },
                ].map(({ color, bg }) => (
                  <button
                    key={color}
                    onClick={() => applyHighlightToSelected(color as HighlightColor)}
                    className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      bg,
                      'hover:opacity-80'
                    )}
                    title={`Destacar ${color}`}
                  >
                    <Highlighter className="h-4 w-4 text-white" />
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-border" />

              <button
                onClick={applyUnderlineToSelected}
                className="p-2 hover:bg-primary/10 rounded-lg"
                title="Sublinhar todos"
              >
                <Underline className="h-4 w-4" />
              </button>
              <button
                onClick={applyBoldToSelected}
                className="p-2 hover:bg-primary/10 rounded-lg"
                title="Negrito todos"
              >
                <Bold className="h-4 w-4" />
              </button>

              <div className="w-px h-6 bg-border" />

              <button
                onClick={clearSelection}
                className="p-2 hover:bg-red-500/10 rounded-lg"
                title="Cancelar"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-select mode indicator */}
      <AnimatePresence>
        {multiSelectMode && selectedVerses.size === 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="flex items-center gap-3 px-6 py-3 glass-panel rounded-full shadow-xl border border-primary/20">
              <CheckSquare className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Toque nos versículos para selecionar</span>
              <button
                onClick={() => setMultiSelectMode(false)}
                className="ml-2 p-1 hover:bg-red-500/10 rounded-full"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
