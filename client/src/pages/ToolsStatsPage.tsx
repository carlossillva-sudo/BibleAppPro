import React from 'react';
import { BarChart3, PieChart, Activity, BookOpen, Award, Flame } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const ToolsStatsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
            <header>
                <h1 className="text-4xl font-extrabold tracking-tight">Estatísticas</h1>
                <p className="text-lg text-muted-foreground">Acompanhe sua jornada bíblica.</p>
            </header>

            {/* Streak and summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 rounded-2xl p-6 space-y-2">
                    <Flame className="h-8 w-8 text-primary" />
                    <p className="text-3xl font-black">7 dias</p>
                    <p className="text-sm text-muted-foreground font-medium">Sequência de leitura</p>
                </div>
                <div className="bg-card border rounded-2xl p-6 space-y-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <p className="text-3xl font-black">142</p>
                    <p className="text-sm text-muted-foreground font-medium">Capítulos lidos</p>
                </div>
                <div className="bg-card border rounded-2xl p-6 space-y-2">
                    <Award className="h-8 w-8 text-primary" />
                    <p className="text-3xl font-black">12%</p>
                    <p className="text-sm text-muted-foreground font-medium">Bíblia completa</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-card border rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Atividade Semanal</h2>
                    <Button variant="ghost" size="sm" onClick={() => alert('Exportação em breve!')}>Exportar</Button>
                </div>
                <div className="h-48 flex items-end gap-4 px-4">
                    {[
                        { h: 40, d: 'Seg' }, { h: 70, d: 'Ter' }, { h: 45, d: 'Qua' },
                        { h: 90, d: 'Qui' }, { h: 65, d: 'Sex' }, { h: 30, d: 'Sáb' }, { h: 85, d: 'Dom' },
                    ].map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-primary">{bar.h}%</span>
                            <div className="w-full bg-primary/10 rounded-t-lg hover:bg-primary/80 transition-colors cursor-pointer" style={{ height: `${bar.h}%` }} />
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">{bar.d}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border rounded-2xl p-6 space-y-4">
                    <h2 className="font-bold flex items-center gap-2"><PieChart className="h-5 w-5 text-primary" /> Progresso por Testamento</h2>
                    {[
                        { label: 'Antigo Testamento', pct: 15 },
                        { label: 'Novo Testamento', pct: 8 },
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span>{item.label}</span>
                                <span className="font-bold">{item.pct}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-secondary rounded-full">
                                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${item.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-card border rounded-2xl p-6 space-y-4">
                    <h2 className="font-bold flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Ações Rápidas</h2>
                    <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate('/reader/1/1')}>
                            <BookOpen className="h-4 w-4" /> Continuar Lendo
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate('/plans')}>
                            📅 Ver Planos de Leitura
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate('/favorites')}>
                            ❤️ Meus Favoritos
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
