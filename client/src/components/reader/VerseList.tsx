import { memo } from 'react';
import { Bookmark, Copy, Highlighter } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface Verse {
    number: string;
    text: string;
}

interface VerseItemProps {
    verse: Verse;
    isHighlighted?: boolean;
    onCopy: (text: string) => void;
    onFavorite: (verse: Verse) => void;
    onHighlight: (verse: Verse) => void;
}

const VerseItem = memo(({ verse, isHighlighted, onCopy, onFavorite, onHighlight }: VerseItemProps) => {
    return (
        <div
            className={cn(
                "group relative pl-10 pr-4 py-3 rounded-lg transition-all duration-200 cursor-pointer",
                "hover:bg-accent/50",
                isHighlighted && "bg-yellow-100/50 dark:bg-yellow-900/20"
            )}
        >
            <span className="absolute left-2 top-4 text-xs font-sans font-bold text-primary/40 select-none">
                {verse.number}
            </span>

            <p className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90">
                {verse.text}
            </p>

            {/* Action Menu (Visible on hover) */}
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background border shadow-sm rounded-md p-1 z-20">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={(e) => { e.stopPropagation(); onFavorite(verse); }}
                    title="Favoritar"
                >
                    <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={(e) => { e.stopPropagation(); onCopy(verse.text); }}
                    title="Copiar"
                >
                    <Copy className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={(e) => { e.stopPropagation(); onHighlight(verse); }}
                    title="Destacar"
                >
                    <Highlighter className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
});

interface VerseListProps {
    verses: Verse[];
    highlights?: string[]; // Array of verse numbers
}

export const VerseList = memo(({ verses, highlights = [] }: VerseListProps) => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // TODO: Toast notification
    };

    const handleFavorite = (verse: Verse) => {
        console.log('Favoritou:', verse.number);
    };

    const handleHighlight = (verse: Verse) => {
        console.log('Destacou:', verse.number);
    };

    return (
        <div className="space-y-1">
            {verses.map((verse) => (
                <VerseItem
                    key={verse.number}
                    verse={verse}
                    isHighlighted={highlights.includes(verse.number)}
                    onCopy={handleCopy}
                    onFavorite={handleFavorite}
                    onHighlight={handleHighlight}
                />
            ))}
        </div>
    );
});
