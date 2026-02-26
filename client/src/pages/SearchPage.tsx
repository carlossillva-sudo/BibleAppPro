import React, { useState } from 'react';
import { Search as SearchIcon, BookOpen, ArrowRight, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface BibleBook { number: string; name: string; chaptersCount: number; }

const POPULAR = ['Gênesis', 'Salmos', 'Provérbios', 'Isaías', 'Mateus', 'João', 'Romanos', 'Apocalipse'];

export const SearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { data: books } = useQuery<BibleBook[]>({ queryKey: ['search-books'], queryFn: async () => (await api.get('/bible/livros')).data });

    const results = query.length >= 1
        ? books?.filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
        : null;

    const highlightTerm = (name: string) => {
        if (!query) return name;
        const idx = name.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return name;
        return (<>{name.slice(0, idx)}<mark className="bg-primary/20 text-primary font-black rounded px-0.5">{name.slice(idx, idx + query.length)}</mark>{name.slice(idx + query.length)}</>);
    };

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
            <header className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight">Busca</h1>
                <p className="text-lg text-muted-foreground">Encontre livros, capítulos e passagens.</p>
            </header>

            {/* Search bar */}
            <div className="relative">
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input value={query} onChange={e => setQuery(e.target.value)}
                    className="pl-14 pr-12 h-16 text-lg rounded-2xl bg-card border-2 focus-visible:border-primary shadow-sm"
                    placeholder="Ex: João, Salmos, Gênesis..." autoFocus />
                {query && (
                    <button onClick={() => setQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg transition-colors">
                        <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                )}
            </div>

            {/* Results */}
            {results && (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium px-1">
                        {results.length} resultado(s) para "<span className="text-foreground font-bold">{query}</span>"
                    </p>
                    {results.length === 0 ? (
                        <div className="p-10 bg-card border rounded-2xl text-center text-muted-foreground">
                            <SearchIcon className="mx-auto h-10 w-10 mb-3 opacity-10" />
                            <p className="font-bold">Nenhum livro encontrado</p>
                            <p className="text-sm mt-1">Tente outro termo.</p>
                        </div>
                    ) : (
                        <div className="bg-card border rounded-2xl overflow-hidden divide-y">
                            {results.map(b => (
                                <button key={b.number} onClick={() => navigate(`/reader/${b.number}/1`)}
                                    className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors text-left">
                                    <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm">{highlightTerm(b.name)}</p>
                                        <p className="text-xs text-muted-foreground">{b.chaptersCount} capítulos</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Empty state — popular books */}
            {!results && (
                <div className="space-y-4">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-1">Populares</p>
                    <div className="flex flex-wrap gap-2">
                        {POPULAR.map(name => (
                            <button key={name} onClick={() => setQuery(name)}
                                className="px-4 py-2.5 bg-card border rounded-xl text-sm font-medium hover:border-primary/40 hover:shadow-md hover:text-primary transition-all">
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
