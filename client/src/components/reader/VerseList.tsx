import { memo, useState, useEffect } from 'react';
import { Bookmark, Copy, Highlighter, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface Verse {
    number: string;
    text: string;
}

interface VerseItemProps {
    verse: Verse;
    isHighlighted: boolean;
    isFavorited: boolean;
    onCopy: (text: string) => void;
    onFavorite: (verse: Verse) => void;
    onHighlight: (verse: Verse) => void;
}

const VerseItem = memo(({
    verse,
    isHighlighted,
    isFavorited,
    onCopy,
    onFavorite,
    onHighlight,
}: VerseItemProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCopy(verse.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={cn(
                'group relative pl-10 pr-4 py-3 rounded-lg transition-all duration-200 cursor-pointer',
                'hover:bg-accent/50',
                isHighlighted && 'bg-yellow-100/50 dark:bg-yellow-900/20',
            )}
        >
            <span className="absolute left-2 top-4 text-xs font-sans font-bold text-primary/40 select-none">
                {verse.number}
            </span>

            <p className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90">
                {verse.text}
            </p>

            {/* Menu de ações (visível ao passar o mouse) */}
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background border shadow-sm rounded-md p-1 z-20">
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-8 w-8', isFavorited ? 'text-pink-500' : 'text-muted-foreground hover:text-primary')}
                    onClick={(e) => { e.stopPropagation(); onFavorite(verse); }}
                    title={isFavorited ? 'Remover dos favoritos' : 'Favoritar'}
                    aria-label={isFavorited ? 'Remover dos favoritos' : 'Favoritar versículo'}
                >
                    <Bookmark className={cn('h-4 w-4', isFavorited && 'fill-pink-500')} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={handleCopy}
                    title="Copiar versículo"
                    aria-label="Copiar versículo"
                >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn('h-8 w-8', isHighlighted ? 'text-yellow-500' : 'text-muted-foreground hover:text-primary')}
                    onClick={(e) => { e.stopPropagation(); onHighlight(verse); }}
                    title={isHighlighted ? 'Remover destaque' : 'Destacar'}
                    aria-label={isHighlighted ? 'Remover destaque do versículo' : 'Destacar versículo'}
                >
                    <Highlighter className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
});

VerseItem.displayName = 'VerseItem';

interface VerseListProps {
    verses: Verse[];
    bookId?: string;
    chapterId?: string;
}

export const VerseList = memo(({ verses, bookId = '0', chapterId = '0' }: VerseListProps) => {
    const storageKeyFav = 'favorited-verses';
    const storageKeyHL = 'highlighted-verses';

    const [favorited, setFavorited] = useState<Set<string>>(() => {
        try { return new Set(JSON.parse(localStorage.getItem(storageKeyFav) || '[]')); } catch { return new Set(); }
    });
    const [highlighted, setHighlighted] = useState<Set<string>>(() => {
        try { return new Set(JSON.parse(localStorage.getItem(storageKeyHL) || '[]')); } catch { return new Set(); }
    });

    // Persiste no localStorage ao alterar
    useEffect(() => {
        localStorage.setItem(storageKeyFav, JSON.stringify([...favorited]));
    }, [favorited]);

    useEffect(() => {
        localStorage.setItem(storageKeyHL, JSON.stringify([...highlighted]));
    }, [highlighted]);

    const makeKey = (num: string) => `${bookId}:${chapterId}:${num}`;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleFavorite = (verse: Verse) => {
        const key = makeKey(verse.number);
        setFavorited(prev => {
            const s = new Set(prev);
            s.has(key) ? s.delete(key) : s.add(key);
            return s;
        });
    };

    const handleHighlight = (verse: Verse) => {
        const key = makeKey(verse.number);
        setHighlighted(prev => {
            const s = new Set(prev);
            s.has(key) ? s.delete(key) : s.add(key);
            return s;
        });
    };

    return (
        <div className="space-y-1">
            {verses.map((verse) => (
                <VerseItem
                    key={verse.number}
                    verse={verse}
                    isHighlighted={highlighted.has(makeKey(verse.number))}
                    isFavorited={favorited.has(makeKey(verse.number))}
                    onCopy={handleCopy}
                    onFavorite={handleFavorite}
                    onHighlight={handleHighlight}
                />
            ))}
        </div>
    );
});

VerseList.displayName = 'VerseList';
