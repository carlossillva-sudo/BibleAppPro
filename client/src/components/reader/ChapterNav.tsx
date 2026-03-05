import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface ChapterNavProps {
    onPrev: () => void;
    onNext: () => void;
    hasPrev: boolean;
    hasNext: boolean;
}

export const ChapterNav: React.FC<ChapterNavProps> = ({ onPrev, onNext, hasPrev, hasNext }) => {
    return (
        <div className="flex items-center justify-center gap-4 bg-background/80 border px-6 py-4 rounded-full w-fit mx-auto my-8">
            <Button
                variant="ghost"
                size="sm"
                onClick={onPrev}
                disabled={!hasPrev}
                className="gap-2 rounded-full px-4"
            >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Anterior</span>
            </Button>

            <div className="w-[1px] h-4 bg-border mx-2" />

            <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                disabled={!hasNext}
                className="gap-2 rounded-full px-4"
            >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};
