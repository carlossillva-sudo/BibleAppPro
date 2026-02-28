import React, { useState } from 'react';
import {
    PenLine,
    Plus,
    Calendar,
    Trash2,
    Sparkles,
    Heart,
    Briefcase,
    Users,
    Activity,
    Clock,
    Target,
    CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { cn } from '../utils/cn';

interface Prayer {
    id: string;
    title: string;
    text: string;
    category: string;
    date: string;
    answered: boolean;
    daysCount: number;
}

const CATEGORIES = [
    { id: 'espiritual', label: 'Vida Espiritual', icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { id: 'profissional', label: 'Vida Profissional', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'familia', label: 'Família', icon: Users, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { id: 'saude', label: 'Saúde', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'intercessao', label: 'Intercessão', icon: Heart, color: 'text-orange-500', bg: 'bg-orange-500/10' },
];

export const PrayerJournalPage: React.FC = () => {
    const [prayers, setPrayers] = useState<Prayer[]>([
        {
            id: '1',
            title: 'Sabedoria no Trabalho',
            text: 'Senhor, me dê clareza para tomar as melhores decisões no novo projeto...',
            category: 'profissional',
            date: '2026-02-25',
            answered: false,
            daysCount: 2
        },
        {
            id: '2',
            title: 'Saúde da minha mãe',
            text: 'Pai, restaura as forças da minha mãe e que os exames tragam boas notícias.',
            category: 'saude',
            date: '2026-02-20',
            answered: true,
            daysCount: 7
        },
    ]);
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newText, setNewText] = useState('');
    const [newCategory, setNewCategory] = useState('espiritual');
    const [activeFilter, setActiveFilter] = useState('all');

    const [confirm, setConfirm] = useState<{ open: boolean; id: string | null; title: string }>({
        open: false, id: null, title: ''
    });

    const addPrayer = () => {
        if (!newTitle.trim() || !newText.trim()) return;
        const prayer: Prayer = {
            id: Date.now().toString(),
            title: newTitle,
            text: newText,
            category: newCategory,
            date: new Date().toISOString().split('T')[0],
            answered: false,
            daysCount: 0
        };
        setPrayers([prayer, ...prayers]);
        resetForm();
    };

    const resetForm = () => {
        setNewTitle('');
        setNewText('');
        setNewCategory('espiritual');
        setShowForm(false);
    };

    const toggleAnswered = (id: string) =>
        setPrayers(ps => ps.map(p => p.id === id ? { ...p, answered: !p.answered } : p));

    const handleDelete = () => {
        if (confirm.id) {
            setPrayers(ps => ps.filter(p => p.id !== confirm.id));
            setConfirm({ open: false, id: null, title: '' });
        }
    };

    const filtered = prayers.filter(p => activeFilter === 'all' || p.category === activeFilter);

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10 pb-32">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.2em]">
                        <PenLine className="h-4 w-4" /> Diário de Conversa
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter">Minhas Orações.</h1>
                    <p className="text-lg text-muted-foreground font-medium">Um lugar seguro para seus diálogos com Deus.</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black gap-2 shadow-xl shadow-primary/20">
                    <Plus className="h-5 w-5" /> Nova Oração
                </Button>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: prayers.length, icon: Calendar },
                    { label: 'Respondidas', value: prayers.filter(p => p.answered).length, icon: CheckCircle2, color: 'text-emerald-500' },
                    { label: 'Em Clamor', value: prayers.filter(p => !p.answered).length, icon: Target, color: 'text-primary' },
                    { label: 'Categorias', value: 5, icon: Target },
                ].map((s, i) => (
                    <div key={i} className="bg-card border border-foreground/5 rounded-2xl p-4 flex items-center gap-3">
                        <div className="bg-muted p-2 rounded-lg">
                            <s.icon className={cn("h-4 w-4", s.color)} />
                        </div>
                        <div>
                            <p className="text-lg font-black leading-none">{s.value}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <button
                    onClick={() => setActiveFilter('all')}
                    className={cn(
                        "px-6 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        activeFilter === 'all' ? "bg-foreground text-background" : "bg-card border hover:bg-muted"
                    )}
                >
                    Tudo
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveFilter(cat.id)}
                        className={cn(
                            "px-6 h-12 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border",
                            activeFilter === cat.id ? "bg-primary border-primary text-white" : "bg-card hover:bg-muted"
                        )}
                    >
                        <cat.icon className="h-3.5 w-3.5" /> {cat.label}
                    </button>
                ))}
            </div>

            {/* Prayer List */}
            <div className="grid gap-4">
                {filtered.map(p => {
                    const cat = CATEGORIES.find(c => c.id === p.category) || CATEGORIES[0];
                    return (
                        <div key={p.id} className="bg-card border border-foreground/5 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all group">
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className={cn("px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", cat.bg, cat.color)}>
                                        <cat.icon className="h-3 w-3" /> {cat.label}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                                        <Clock className="h-3.5 w-3.5" /> Criado há {p.daysCount} dias
                                    </div>
                                    {p.answered && (
                                        <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-in zoom-in-50">
                                            <Sparkles className="h-3 w-3" /> Respondida
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-2xl font-black tracking-tight">{p.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed italic">"{p.text}"</p>
                            </div>

                            <div className="flex md:flex-col gap-2 justify-end border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-foreground/5">
                                <Button
                                    onClick={() => toggleAnswered(p.id)}
                                    className={cn(
                                        "h-12 w-12 md:h-14 md:w-14 rounded-2xl transition-all shadow-lg",
                                        p.answered ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary"
                                    )}
                                >
                                    <CheckCircle2 className="h-6 w-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setConfirm({ open: true, id: p.id, title: p.title })}
                                    className="h-12 w-12 md:h-14 md:w-14 rounded-2xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* New Prayer Dialog (Overlay) */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card border shadow-2xl rounded-[40px] w-full max-w-lg p-10 space-y-8 animate-in slide-in-from-bottom-10 duration-500">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black tracking-tight">Nova Oração.</h2>
                            <p className="text-muted-foreground font-medium">Escreva com o coração, sem pressa.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Tema da Oração</label>
                                <Input
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    placeholder="Ex: Novos passos no trabalho"
                                    className="h-14 rounded-2xl border-2 focus:ring-0"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Categoria</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setNewCategory(cat.id)}
                                            className={cn(
                                                "px-4 py-3 rounded-xl text-xs font-bold transition-all border-2 text-left",
                                                newCategory === cat.id ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-muted/50 hover:bg-muted"
                                            )}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Seu Clamor</label>
                                <textarea
                                    value={newText}
                                    onChange={e => setNewText(e.target.value)}
                                    placeholder="Abra o seu coração aqui..."
                                    className="w-full h-40 p-5 rounded-2xl bg-muted/50 border-2 border-transparent focus:border-primary focus:bg-card transition-all outline-none resize-none font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={resetForm} variant="ghost" className="flex-1 h-16 rounded-2xl font-black">CANCELAR</Button>
                            <Button onClick={addPrayer} className="flex-1 h-16 rounded-2xl font-black bg-primary text-white shadow-xl">SALVAR ORAÇÃO</Button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={confirm.open}
                title="Remover Oração?"
                description="Este registro será permanentemente removido do seu diário."
                itemName={confirm.title}
                onConfirm={handleDelete}
                onCancel={() => setConfirm({ open: false, id: null, title: '' })}
            />
        </div>
    );
};
