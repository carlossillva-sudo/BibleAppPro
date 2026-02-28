import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { BookOpen, Search, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

import { usePreferencesStore } from '../store/preferencesStore';

interface BibleBook { number: string; name: string; chaptersCount: number; }

export const LibraryPage: React.FC = () => {
    const navigate = useNavigate();
    const { bibleVersion, lastRead } = usePreferencesStore();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'at' | 'nt'>('all');

    const { data: books, isLoading } = useQuery<BibleBook[]>({
        queryKey: ['bible-books', bibleVersion],
        queryFn: async () => (await api.get('/bible/livros', { params: { v: bibleVersion } })).data,
    });

    const filteredBooks = books?.filter(b => {
        const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
        const num = parseInt(b.number);
        if (filter === 'at') return matchesSearch && num <= 39;
        if (filter === 'nt') return matchesSearch && num > 39;
        return matchesSearch;
    });

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-32">
            <header className="space-y-6">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="-ml-2 gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-4 w-4" /> Voltar ao Início
                </Button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.2em]">
                            <BookOpen className="h-4 w-4" /> Biblioteca Sagrada
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter">Escolha um <span className="text-primary italic">Livro.</span></h1>
                        <p className="text-lg text-muted-foreground font-medium">Explore as 66 jóias da revelação divina.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar livro..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-11 h-12 rounded-2xl bg-card border-foreground/10 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 p-1 bg-muted/30 rounded-2xl w-fit border border-foreground/5">
                    {[
                        { id: 'all', label: 'Todos' },
                        { id: 'at', label: 'Antigo Testamento' },
                        { id: 'nt', label: 'Novo Testamento' },
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setFilter(t.id as any)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === t.id ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...Array(24)].map((_, i) => (
                        <div key={i} className="h-32 bg-card/50 animate-pulse rounded-[24px] border border-foreground/5" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {filteredBooks?.map(b => (
                        <button
                            key={b.number}
                            onClick={() => navigate(`/reader/${b.number}/1`)}
                            className="group bg-card border border-foreground/5 p-6 rounded-[24px] text-left hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all relative overflow-hidden"
                        >
                            <div className="absolute -right-4 -top-4 bg-primary/5 p-8 rounded-full group-hover:bg-primary/10 transition-colors">
                                <BookOpen className="h-6 w-6 text-primary/20" />
                            </div>

                            <div className="relative z-10 space-y-2">
                                <p className="text-xs font-black text-muted-foreground uppercase opacity-50">#{b.number}</p>
                                <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{b.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                        {b.chaptersCount} Capítulos
                                    </div>
                                    {lastRead?.bookId === b.number && (
                                        <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter animate-pulse">
                                            Lendo agora
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {!isLoading && filteredBooks?.length === 0 && (
                <div className="text-center py-20 space-y-4">
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto opacity-50">
                        <Search className="h-8 w-8" />
                    </div>
                    <p className="text-xl font-bold text-muted-foreground">Nenhum livro encontrado para "{search}"</p>
                </div>
            )}

            {/* Quick Tips Footer */}
            <div className="mt-20 p-8 rounded-[40px] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 flex flex-col md:flex-row items-center gap-8">
                <div className="bg-primary/10 p-4 rounded-2xl">
                    <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-black mb-1">Dica de Estudo</h4>
                    <p className="text-muted-foreground font-medium italic">"Toda a Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção e para a instrução na justiça."</p>
                </div>
            </div>
        </div>
    );
};
