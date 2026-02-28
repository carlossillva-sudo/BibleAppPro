import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Button } from '../ui/Button';
import { X, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Verse { number: string; text?: string; content?: string; }

interface ComparePanelProps {
    bookId: string;
    chapterId: string;
    currentVersion: string;
    onClose: () => void;
}

export const ComparePanel: React.FC<ComparePanelProps> = ({ bookId, chapterId, currentVersion, onClose }) => {
    const [secondVersion, setSecondVersion] = useState<string>('ARA');
    const [isOpen, setIsOpen] = useState(false);

    const { data: versions } = useQuery<string[]>({
        queryKey: ['bible-versions-compare'],
        queryFn: async () => (await api.get('/bible/versoes')).data
    });

    const { data: verses1 } = useQuery<Verse[]>({
        queryKey: ['verses-compare-1', bookId, chapterId, currentVersion],
        queryFn: async () => (await api.get(`/bible/livros/${bookId}/capitulos/${chapterId}/versiculos`, { params: { v: currentVersion } })).data,
    });

    const { data: verses2, isLoading: isLoading2 } = useQuery<Verse[]>({
        queryKey: ['verses-compare-2', bookId, chapterId, secondVersion],
        queryFn: async () => (await api.get(`/bible/livros/${bookId}/capitulos/${chapterId}/versiculos`, { params: { v: secondVersion } })).data,
    });

    return (
        <div className="fixed inset-y-0 right-0 w-full md:w-[500px] glass-panel border-l border-foreground/10 z-[60] shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-6 border-b border-foreground/5 flex items-center justify-between bg-primary/5">
                <div>
                    <h3 className="text-xl font-black tracking-tight text-primary">Comparar Versões</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Lado a Lado</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-destructive/10 hover:text-destructive">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="p-6 shrink-0 z-10">
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between p-4 premium-card border-primary/20 bg-background text-sm font-black hover:scale-[1.01] transition-all"
                    >
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] text-muted-foreground uppercase mb-1">Versão Secundária</span>
                            <span>{secondVersion}</span>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 p-2 glass-panel border-primary/10 rounded-2xl shadow-2xl space-y-1 animate-in zoom-in-95 duration-200">
                            {versions?.map(v => (
                                <button
                                    key={v}
                                    onClick={() => { setSecondVersion(v); setIsOpen(false); }}
                                    className={cn(
                                        "w-full flex items-center justify-between p-3 rounded-xl text-xs font-black transition-all",
                                        secondVersion === v ? "bg-primary text-white shadow-lg shadow-primary/30" : "hover:bg-primary/10"
                                    )}
                                >
                                    {v}
                                    {secondVersion === v && <Check className="h-3 w-3" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {verses1?.map((v1, idx) => {
                    const v2 = verses2?.[idx];
                    return (
                        <div key={v1.number} className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                    {v1.number}
                                </span>
                                <div className="h-px flex-1 bg-foreground/5" />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-transparent">
                                    <span className="text-[9px] font-black text-primary/40 uppercase block mb-1">{currentVersion}</span>
                                    <p className="text-sm font-medium leading-relaxed font-scripture">{v1.text || v1.content}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-primary/[0.03] border border-primary/5">
                                    <span className="text-[9px] font-black text-primary/40 uppercase block mb-1">{secondVersion}</span>
                                    {isLoading2 ? (
                                        <div className="h-4 w-full bg-primary/5 animate-pulse rounded" />
                                    ) : (
                                        <p className="text-sm font-medium leading-relaxed font-scripture">{v2?.text || v2?.content || '—'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
