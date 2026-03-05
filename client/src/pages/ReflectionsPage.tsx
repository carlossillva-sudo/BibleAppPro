import React, { useState } from 'react';
import {
    MessageSquare,
    Plus,
    Search,
    Calendar,
    Trash2,
    MoreVertical,
    BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

interface Reflection {
    id: string;
    title: string;
    content: string;
    category: string;
    date: string;
    verseRef?: string;
}

const CATEGORIES = [
    { id: 'all', label: 'Tudo', color: 'bg-slate-500' },
    { id: 'criacao', label: 'Criação', color: 'bg-emerald-500' },
    { id: 'teologia', label: 'Teologia', color: 'bg-blue-500' },
    { id: 'estudo', label: 'Estudo Bíblico', color: 'bg-purple-500' },
    { id: 'pratica', label: 'Aplicação Prática', color: 'bg-rose-500' },
];

export const ReflectionsPage: React.FC = () => {
    const [reflections] = useState<Reflection[]>([
        {
            id: '1',
            title: 'A Perfeição da Criação',
            content: 'Ao olhar para o Gênesis, percebemos que a criação não foi apenas um ato de poder, mas um ato de amor e organização...',
            category: 'criacao',
            date: '2026-02-27',
            verseRef: 'Gênesis 1:1'
        }
    ]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = reflections.filter(r => {
        const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10 pb-32">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.2em]">
                        <MessageSquare className="h-4 w-4" /> Pensamentos & Estudos
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter">Reflexões.</h1>
                    <p className="text-lg text-muted-foreground font-medium">Seu diário pessoal de descobertas bíblicas.</p>
                </div>
                <Button className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black gap-2 shadow-xl shadow-primary/20">
                    <Plus className="h-5 w-5" /> Nova Reflexão
                </Button>
            </header>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Pesquisar em suas reflexões..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 h-14 bg-card border border-foreground/5 rounded-2xl font-medium focus:ring-2 ring-primary transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                                "px-6 h-14 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border",
                                selectedCategory === cat.id
                                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10"
                                    : "bg-card text-muted-foreground border-foreground/5 hover:bg-muted"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map(r => (
                    <div key={r.id} className="bg-card border border-foreground/5 rounded-[32px] p-8 space-y-6 hover:shadow-2xl transition-all group">
                        <div className="flex justify-between items-start">
                            <span className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm",
                                CATEGORIES.find(c => c.id === r.category)?.color || 'bg-slate-500'
                            )}>
                                {CATEGORIES.find(c => c.id === r.category)?.label}
                            </span>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <span className="text-xs font-bold flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" /> {new Date(r.date).toLocaleDateString('pt-BR')}
                                </span>
                                <button className="p-2 hover:bg-muted rounded-xl transition-colors">
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{r.title}</h3>
                            {r.verseRef && (
                                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-tighter">
                                    <BookOpen className="h-3.5 w-3.5" /> {r.verseRef}
                                </div>
                            )}
                        </div>

                        <p className="text-muted-foreground leading-relaxed line-clamp-4 font-medium italic">
                            "{r.content}"
                        </p>

                        <div className="pt-6 border-t border-foreground/5 flex items-center justify-between">
                            <Button variant="ghost" className="text-xs font-black p-0 h-auto hover:bg-transparent text-primary tracking-widest uppercase">Ler completo →</Button>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl text-destructive hover:bg-destructive/5">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {reflections.length === 0 && (
                <div className="text-center py-20 bg-card border-2 border-dashed border-foreground/5 rounded-[40px]">
                    <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black">Nenhuma reflexão ainda.</h3>
                    <Button className="mt-6 h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black">
                        Criar Primeira Reflexão
                    </Button>
                </div>
            )}
        </div>
    );
};
