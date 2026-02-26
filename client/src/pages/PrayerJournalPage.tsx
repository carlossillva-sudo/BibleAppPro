import React, { useState } from 'react';
import { PenLine, Sparkles, Plus, Calendar, Heart, Trash2, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface Prayer { id: string; title: string; text: string; date: string; answered: boolean; }

const initialPrayers: Prayer[] = [
    { id: '1', title: 'Gratidão pela Nova Jornada', text: 'Senhor, obrigado por abrir as portas deste novo projeto e pela clareza mental...', date: '25 Fev', answered: true },
    { id: '2', title: 'Proteção para a Família', text: 'Pai, cobre minha família com Tua proteção...', date: '24 Fev', answered: false },
];

export const PrayerJournalPage: React.FC = () => {
    const [prayers, setPrayers] = useState<Prayer[]>(initialPrayers);
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newText, setNewText] = useState('');

    const addPrayer = () => {
        if (!newTitle.trim() || !newText.trim()) return;
        const prayer: Prayer = { id: Date.now().toString(), title: newTitle, text: newText, date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }), answered: false };
        setPrayers([prayer, ...prayers]);
        setNewTitle(''); setNewText(''); setShowForm(false);
    };

    const toggleAnswered = (id: string) => setPrayers(ps => ps.map(p => p.id === id ? { ...p, answered: !p.answered } : p));
    const remove = (id: string) => setPrayers(ps => ps.filter(p => p.id !== id));

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
            <header className="flex justify-between items-start">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
                        <PenLine className="h-8 w-8 text-primary" /> Diário de Oração
                    </h1>
                    <p className="text-lg text-muted-foreground">{prayers.length} oração(ões) registradas.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="rounded-xl gap-2">
                    {showForm ? <><X className="h-4 w-4" /> Cancelar</> : <><Plus className="h-4 w-4" /> Nova Oração</>}
                </Button>
            </header>

            {/* New prayer form */}
            {showForm && (
                <div className="bg-card border rounded-2xl p-6 space-y-4">
                    <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Título da oração" className="h-12 rounded-xl" />
                    <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Escreva sua oração aqui..."
                        className="w-full h-32 p-4 rounded-xl bg-accent/30 border-none outline-none resize-none text-sm" />
                    <Button onClick={addPrayer} className="rounded-xl gap-2"><Plus className="h-4 w-4" /> Salvar Oração</Button>
                </div>
            )}

            <div className="space-y-4">
                {prayers.map(p => (
                    <div key={p.id} className="group p-6 bg-card border rounded-2xl space-y-3 hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start">
                            <button onClick={() => toggleAnswered(p.id)}
                                className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 transition-colors ${p.answered ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                                <Sparkles className="h-3 w-3" /> {p.answered ? 'Respondida' : 'Em oração'}
                            </button>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-muted-foreground flex items-center gap-1 mr-2"><Calendar className="h-3 w-3" /> {p.date}</span>
                                <Button variant="ghost" size="icon" onClick={() => remove(p.id)} className="h-7 w-7 rounded-lg text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold">{p.title}</h3>
                        <p className="text-muted-foreground italic leading-relaxed">"{p.text}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
