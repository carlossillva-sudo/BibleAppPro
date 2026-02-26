import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, BookOpen, Flame, Target, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PlanCard, type PlanData } from '../components/plans/PlanCard';

const DEFAULT_PLANS: PlanData[] = [
    { id: '1', title: 'Bíblia em 1 Ano', description: 'Leia toda a Bíblia seguindo um plano cronológico de 365 dias com leituras do AT e NT.', totalDays: 365, currentDay: 164, category: 'Completo' },
    { id: '2', title: 'Sermão da Montanha', description: 'Estudo profundo de Mateus 5-7 com reflexões devocionais diárias.', totalDays: 14, currentDay: 14, category: 'Devocional' },
    { id: '3', title: 'Salmos de Conforto', description: 'Uma seleção de Salmos para momentos de dificuldade e busca por paz.', totalDays: 30, currentDay: 12, category: 'Temático' },
    { id: '4', title: 'Cartas de Paulo', description: 'Explore as epístolas paulinas e seus ensinamentos práticos para a vida cristã.', totalDays: 60, currentDay: 0, category: 'Estudo' },
    { id: '5', title: 'Provérbios em 31 Dias', description: 'Um capítulo de Provérbios por dia para sabedoria prática.', totalDays: 31, currentDay: 8, category: 'Sabedoria' },
];

const STORAGE_KEY = 'bible-reading-plans';

function loadPlans(): PlanData[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch { }
    return DEFAULT_PLANS;
}

function savePlans(plans: PlanData[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

const DAILY_READING = {
    title: 'Leitura de Hoje',
    plan: 'Bíblia em 1 Ano — Dia 164',
    passages: ['Salmo 119:89-176', '1 Reis 3-4', 'Atos 10:1-23'],
    verse: '"A exposição das tuas palavras dá luz; ela dá entendimento aos simples." — Salmo 119:130',
};

export const ReadingPlansPage: React.FC = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState<PlanData[]>(loadPlans);
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newDays, setNewDays] = useState('30');
    const [filter, setFilter] = useState<'all' | 'active' | 'complete'>('all');
    const [justCreated, setJustCreated] = useState<string | null>(null);

    // Persist plans to localStorage whenever they change
    useEffect(() => { savePlans(plans); }, [plans]);

    const addPlan = () => {
        if (!newTitle.trim()) return;
        const id = Date.now().toString();
        const plan: PlanData = {
            id,
            title: newTitle.trim(),
            description: newDesc.trim() || 'Plano personalizado de leitura bíblica.',
            totalDays: Math.max(1, parseInt(newDays) || 30),
            currentDay: 0,
            category: 'Pessoal',
        };
        setPlans(prev => [plan, ...prev]);
        setNewTitle('');
        setNewDesc('');
        setNewDays('30');
        setShowForm(false);
        setJustCreated(id);
        setTimeout(() => setJustCreated(null), 3000);
    };

    const handleContinue = (_plan: PlanData) => navigate('/reader/1/1');
    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este plano?')) {
            setPlans(ps => ps.filter(p => p.id !== id));
        }
    };

    const filtered = plans.filter(p => {
        if (filter === 'active') return p.currentDay < p.totalDays && p.currentDay > 0;
        if (filter === 'complete') return p.currentDay >= p.totalDays;
        return true;
    });

    const activePlans = plans.filter(p => p.currentDay > 0 && p.currentDay < p.totalDays);
    const streak = 7;

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight">Planos e Devocionais</h1>
                    <p className="text-lg text-muted-foreground">Cresça em fé com leituras guiadas e devocionais diários.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="rounded-xl gap-2 h-12 shrink-0">
                    {showForm ? <><X className="h-4 w-4" /> Cancelar</> : <><Plus className="h-4 w-4" /> Novo Plano</>}
                </Button>
            </header>

            {/* Success message */}
            {justCreated && (
                <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                    <Check className="h-5 w-5" /> Plano criado com sucesso!
                </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-2xl p-5 flex items-center gap-4">
                    <div className="bg-orange-500/20 p-3 rounded-xl"><Flame className="h-6 w-6 text-orange-500" /></div>
                    <div><p className="text-2xl font-black">{streak} dias</p><p className="text-xs text-muted-foreground font-medium">Sequência de leitura</p></div>
                </div>
                <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl"><Target className="h-6 w-6 text-primary" /></div>
                    <div><p className="text-2xl font-black">{activePlans.length}</p><p className="text-xs text-muted-foreground font-medium">Planos em andamento</p></div>
                </div>
                <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
                    <div className="bg-green-500/10 p-3 rounded-xl"><BookOpen className="h-6 w-6 text-green-600" /></div>
                    <div><p className="text-2xl font-black">{plans.filter(p => p.currentDay >= p.totalDays).length}</p><p className="text-xs text-muted-foreground font-medium">Planos concluídos</p></div>
                </div>
            </div>

            {/* Daily reading card */}
            <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest">
                    <BookOpen className="h-4 w-4" /> {DAILY_READING.title}
                </div>
                <p className="text-sm text-muted-foreground">{DAILY_READING.plan}</p>
                <div className="flex flex-wrap gap-2">
                    {DAILY_READING.passages.map((p, i) => (
                        <button key={i} onClick={() => navigate('/reader/19/119')}
                            className="px-4 py-2 bg-card border rounded-xl text-sm font-medium hover:border-primary/40 hover:shadow-md transition-all">
                            {p}
                        </button>
                    ))}
                </div>
                <blockquote className="font-serif text-base italic text-muted-foreground border-l-2 border-primary/30 pl-4 mt-4">
                    {DAILY_READING.verse}
                </blockquote>
            </div>

            {/* New plan form */}
            {showForm && (
                <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 space-y-4 shadow-lg">
                    <h3 className="font-bold text-lg">✨ Criar Plano Personalizado</h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold">Nome do Plano *</label>
                            <Input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                                placeholder="Ex: Evangelho de João em 21 dias" className="h-12 rounded-xl" autoFocus />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold">Descrição</label>
                            <Input value={newDesc} onChange={e => setNewDesc(e.target.value)}
                                placeholder="Descreva brevemente o objetivo deste plano" className="h-12 rounded-xl" />
                        </div>
                        <div className="flex gap-4 items-end">
                            <div className="space-y-1 w-32">
                                <label className="text-sm font-bold">Duração (dias)</label>
                                <Input type="number" min="1" max="365" value={newDays} onChange={e => setNewDays(e.target.value)} className="h-12 rounded-xl" />
                            </div>
                            <Button onClick={addPlan} disabled={!newTitle.trim()} className="h-12 rounded-xl px-8 flex-1 gap-2 text-base">
                                <Plus className="h-5 w-5" /> Criar Plano
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter tabs */}
            <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
                {[
                    { key: 'all' as const, label: 'Todos', count: plans.length },
                    { key: 'active' as const, label: 'Em Andamento', count: activePlans.length },
                    { key: 'complete' as const, label: 'Finalizados', count: plans.filter(p => p.currentDay >= p.totalDays).length },
                ].map(tab => (
                    <button key={tab.key} onClick={() => setFilter(tab.key)}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${filter === tab.key ? 'bg-card shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* Plans grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(plan => (
                    <div key={plan.id} className={justCreated === plan.id ? 'ring-2 ring-green-500/50 rounded-2xl animate-in fade-in zoom-in-95 duration-500' : ''}>
                        <PlanCard plan={plan} onContinue={handleContinue} onDelete={handleDelete} />
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
                    <p className="font-bold text-lg">Nenhum plano encontrado</p>
                    <p className="text-sm mt-1">Tente outro filtro ou crie um novo plano.</p>
                    <Button onClick={() => setShowForm(true)} variant="outline" className="mt-4 rounded-xl gap-2">
                        <Plus className="h-4 w-4" /> Criar Primeiro Plano
                    </Button>
                </div>
            )}
        </div>
    );
};
