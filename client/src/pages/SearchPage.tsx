import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, BookOpen, ArrowRight, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Input } from '../components/ui/Input';

interface BibleBook { number: string; name: string; chaptersCount: number; }
interface SearchResult { bookNumber: string; bookName: string; chapterNumber: string; verseNumber: string; text: string; }

const POPULAR = ['Gênesis', 'Salmos', 'Provérbios', 'Isaías', 'Mateus', 'João', 'Romanos', 'Apocalipse'];

export const SearchPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const navigate = useNavigate();

    // Debounce manual
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 400);
        return () => clearTimeout(timer);
    }, [query]);

    const { data: books } = useQuery<BibleBook[]>({
        queryKey: ['search-books'],
        queryFn: async () => (await api.get('/bible/livros')).data
    });

    const { data: verseResults, isLoading: isSearching } = useQuery<SearchResult[]>({
        queryKey: ['search-verses', debouncedQuery],
        queryFn: async () => (await api.get(`/bible/busca?q=${debouncedQuery}`)).data,
        enabled: debouncedQuery.length >= 3,
    });

    const filteredBooks = query.length >= 1
        ? books?.filter(b => b.name.toLowerCase().includes(query.toLowerCase()))
        : null;

    const highlightTerm = (name: string, term: string) => {
        if (!term) return name;
        const idx = name.toLowerCase().indexOf(term.toLowerCase());
        if (idx === -1) return name;
        return (<>{name.slice(0, idx)}<mark className="bg-primary/20 text-primary font-black rounded px-0.5">{name.slice(idx, idx + term.length)}</mark>{name.slice(idx + term.length)}</>);
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
                    placeholder="Busque por livro ou palavra (ex: 'Amor', 'Fé')..." autoFocus />
                {(query || isSearching) && (
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {isSearching && <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                        {query && (
                            <button onClick={() => setQuery('')} className="p-1 hover:bg-muted rounded-lg transition-colors">
                                <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Book Results */}
            {filteredBooks && filteredBooks.length > 0 && (
                <div className="space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Livros Encontrados</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredBooks.slice(0, 4).map(b => (
                            <button key={b.number} onClick={() => navigate(`/reader/${b.number}/1`)}
                                className="flex items-center gap-4 p-4 bg-card border rounded-2xl hover:bg-accent/50 transition-colors text-left group">
                                <div className="bg-primary/10 p-2.5 rounded-xl group-hover:bg-primary/20 transition-colors">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm">{highlightTerm(b.name, query)}</p>
                                    <p className="text-xs text-muted-foreground">{b.chaptersCount} capítulos</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Verse Results */}
            {verseResults && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Versículos Encontrados</p>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-bold">{verseResults.length} resultados</span>
                    </div>
                    {verseResults.length === 0 ? (
                        <div className="p-10 bg-card border rounded-2xl text-center text-muted-foreground">
                            <p className="font-bold">Nenhum versículo encontrado</p>
                            <p className="text-sm mt-1">Tente palavras mais comuns ou verifique a ortografia.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {verseResults.map((v, i) => (
                                <button key={`${v.bookNumber}-${v.chapterNumber}-${v.verseNumber}-${i}`}
                                    onClick={() => navigate(`/reader/${v.bookNumber}/${v.chapterNumber}`)}
                                    className="w-full p-5 bg-card border rounded-2xl hover:border-primary/40 hover:shadow-md transition-all text-left space-y-2 group">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded">
                                            {v.bookName} {v.chapterNumber}:{v.verseNumber}
                                        </span>
                                        <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                    <p className="text-sm leading-relaxed text-foreground/90">
                                        {highlightTerm(v.text, debouncedQuery)}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Popular books */}
            {!query && (
                <div className="space-y-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Sugestões de Leitura</p>
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
