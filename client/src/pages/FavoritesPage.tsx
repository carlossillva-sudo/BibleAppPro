import React, { useState } from 'react';
import { Heart, Highlighter, Trash2, Copy, Check, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const mockFavorites = [
    { id: '1', ref: 'João 3:16', book: '43', ch: '3', text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.', date: '25 Fev' },
    { id: '2', ref: 'Salmo 23:1', book: '19', ch: '23', text: 'O Senhor é meu pastor; nada me faltará.', date: '24 Fev' },
    { id: '3', ref: 'Filipenses 4:13', book: '50', ch: '4', text: 'Posso todas as coisas naquele que me fortalece.', date: '23 Fev' },
    { id: '4', ref: 'Romanos 8:28', book: '45', ch: '8', text: 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.', date: '22 Fev' },
];

const mockHighlights = [
    { id: 'h1', ref: 'Gênesis 1:1', book: '1', ch: '1', text: 'No princípio, criou Deus os céus e a terra.', color: 'yellow', date: '25 Fev' },
    { id: 'h2', ref: 'Isaías 41:10', book: '23', ch: '41', text: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.', color: 'blue', date: '24 Fev' },
];

type Tab = 'favorites' | 'highlights';

export const FavoritesPage: React.FC = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>('favorites');
    const [favorites, setFavorites] = useState(mockFavorites);
    const [highlights, setHighlights] = useState(mockHighlights);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const removeFav = (id: string) => setFavorites(fs => fs.filter(f => f.id !== id));
    const removeHL = (id: string) => setHighlights(hs => hs.filter(h => h.id !== id));

    const copy = (text: string, ref: string, id: string) => {
        navigator.clipboard.writeText(`"${text}" — ${ref}`);
        setCopiedId(id); setTimeout(() => setCopiedId(null), 2000);
    };

    const items = tab === 'favorites' ? favorites : highlights;

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
            <header className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                    {tab === 'favorites' ? <Heart className="h-8 w-8 text-pink-500 fill-pink-500" /> : <Highlighter className="h-8 w-8 text-yellow-500" />}
                    {tab === 'favorites' ? 'Favoritos' : 'Destaques'}
                </h1>
                <p className="text-lg text-muted-foreground">
                    {items.length} {tab === 'favorites' ? 'versículo(s) salvo(s)' : 'trecho(s) destacado(s)'}
                </p>
            </header>

            {/* Tabs */}
            <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
                <button onClick={() => setTab('favorites')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${tab === 'favorites' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
                    <Heart className="h-4 w-4" /> Favoritos <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{favorites.length}</span>
                </button>
                <button onClick={() => setTab('highlights')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${tab === 'highlights' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
                    <Highlighter className="h-4 w-4" /> Destaques <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-full">{highlights.length}</span>
                </button>
            </div>

            {items.length === 0 ? (
                <div className="p-16 border-2 border-dashed rounded-3xl text-center text-muted-foreground">
                    <BookOpen className="mx-auto h-16 w-16 mb-4 opacity-10" />
                    <p className="text-xl font-bold">Nenhum item ainda</p>
                    <p className="text-sm mt-2">Use o Leitor Bíblico para favoritar ou destacar versículos.</p>
                    <Button onClick={() => navigate('/reader/1/1')} className="mt-4 rounded-xl">Abrir Leitor</Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {tab === 'favorites' ? favorites.map(fav => (
                        <div key={fav.id} className="group bg-card border rounded-2xl p-5 hover:border-primary/20 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 mt-1">
                                    <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                                </div>
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <button onClick={() => navigate(`/reader/${fav.book}/${fav.ch}`)}
                                            className="text-sm font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                                            {fav.ref} <ChevronRight className="h-3 w-3" />
                                        </button>
                                        <span className="text-[11px] text-muted-foreground">{fav.date}</span>
                                    </div>
                                    <p className="font-serif text-base italic leading-relaxed">"{fav.text}"</p>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="sm" onClick={() => copy(fav.text, fav.ref, fav.id)} className="h-7 text-xs gap-1 rounded-lg">
                                            {copiedId === fav.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                            {copiedId === fav.id ? 'Copiado!' : 'Copiar'}
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => removeFav(fav.id)} className="h-7 text-xs gap-1 rounded-lg text-destructive"><Trash2 className="h-3 w-3" /> Remover</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : highlights.map(hl => (
                        <div key={hl.id} className="group bg-card border rounded-2xl p-5 hover:border-yellow-500/20 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="shrink-0 mt-1 h-5 w-5 bg-yellow-300/60 rounded" />
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <button onClick={() => navigate(`/reader/${hl.book}/${hl.ch}`)}
                                            className="text-sm font-black text-yellow-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                                            {hl.ref} <ChevronRight className="h-3 w-3" />
                                        </button>
                                        <span className="text-[11px] text-muted-foreground">{hl.date}</span>
                                    </div>
                                    <p className="font-serif text-base leading-relaxed bg-yellow-200/40 px-2 py-1 rounded-lg">"{hl.text}"</p>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="sm" onClick={() => copy(hl.text, hl.ref, hl.id)} className="h-7 text-xs gap-1 rounded-lg">
                                            {copiedId === hl.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                            {copiedId === hl.id ? 'Copiado!' : 'Copiar'}
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => removeHL(hl.id)} className="h-7 text-xs gap-1 rounded-lg text-destructive"><Trash2 className="h-3 w-3" /> Remover</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
