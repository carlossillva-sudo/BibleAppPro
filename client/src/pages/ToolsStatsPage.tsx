import React from 'react';
import { BarChart3, PieChart, BookOpen, Award, Flame, Download, History, Bookmark, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../store/historyStore';
import { motion } from 'framer-motion';

export const ToolsStatsPage: React.FC = () => {
    const navigate = useNavigate();
    const { history, bookmarks } = useHistoryStore();

    // Dados de estatísticas simulados (substituir por dados reais do store/API se disponível)
    const STATS = {
        streak: 7,
        chaptersRead: history.length,
        biblePercent: Math.min(Math.round((history.length / 1189) * 100), 100),
        weeklyActivity: [
            { h: 40, d: 'Seg' }, { h: 70, d: 'Ter' }, { h: 45, d: 'Qua' },
            { h: 90, d: 'Qui' }, { h: 65, d: 'Sex' }, { h: 30, d: 'Sáb' }, { h: 85, d: 'Dom' },
        ],
        testament: [
            { label: 'Antigo Testamento', pct: 15 },
            { label: 'Novo Testamento', pct: 8 },
        ],
    };

    const handleExport = () => {
        const hoje = new Date().toLocaleDateString('pt-BR');
        const linhas = [
            '============================',
            '   BibleAppPro — Estatísticas',
            `   Exportado em: ${hoje}`,
            '============================',
            '',
            `Sequência de leitura : ${STATS.streak} dias`,
            `Capítulos lidos      : ${STATS.chaptersRead}`,
            `Bíblia completa      : ${STATS.biblePercent}%`,
            '',
            '--- Histórico Recente ---',
            ...history.slice(0, 10).map(h => `  ${new Date(h.timestamp).toLocaleDateString()} - ${h.bookName} ${h.chapterId}`),
            '',
            '--- Marcadores ---',
            ...bookmarks.map(b => `  ${b.bookName} ${b.chapterId}:${b.verseNumber}`),
            '',
            'Continue sua jornada bíblica!',
        ];

        const conteudo = linhas.join('\n');
        const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `estatisticas-biblia-${hoje.replace(/\//g, '-')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Estatísticas</h1>
                    <p className="text-lg text-muted-foreground">Sua jornada espiritual em números.</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleExport} className="gap-2">
                    <Download className="h-4 w-4" /> Exportar Relatório
                </Button>
            </header>

            {/* Resumo Principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 space-y-2 bg-primary/5 border-primary/10">
                    <Flame className="h-8 w-8 text-orange-500" />
                    <p className="text-4xl font-black">{STATS.streak} dias</p>
                    <p className="text-sm font-bold opacity-60">Sequência Atual</p>
                </div>
                <div className="bg-card border rounded-3xl p-6 space-y-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <p className="text-4xl font-black">{STATS.chaptersRead}</p>
                    <p className="text-sm font-bold opacity-60">Capítulos Lidos</p>
                </div>
                <div className="bg-card border rounded-3xl p-6 space-y-2">
                    <Award className="h-8 w-8 text-yellow-500" />
                    <p className="text-4xl font-black">{STATS.biblePercent}%</p>
                    <p className="text-sm font-bold opacity-60">Conclusão da Bíblia</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Histórico de Leitura */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" /> Histórico de Leitura
                    </h2>
                    <div className="bg-card border rounded-3xl overflow-hidden">
                        {history.length > 0 ? (
                            <div className="divide-y divide-border">
                                {history.slice(0, 5).map((item, i) => (
                                    <motion.div
                                        key={`${item.bookId}-${item.chapterId}-${item.timestamp}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer transition-colors"
                                        onClick={() => navigate(`/reader/${item.bookId}/${item.chapterId}`)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary/10 p-2 rounded-xl text-primary">
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{item.bookName} {item.chapterId}</p>
                                                <p className="text-xs opacity-50">{new Date(item.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 opacity-30" />
                                    </motion.div>
                                ))}
                                {history.length > 5 && (
                                    <div className="p-3 text-center">
                                        <Button variant="ghost" size="sm" className="text-xs font-bold opacity-60">Ver Histórico Completo</Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-12 text-center opacity-40">Nenhum histórico disponível ainda.</div>
                        )}
                    </div>
                </div>

                {/* Marcadores */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Bookmark className="h-5 w-5 text-primary" /> Meus Marcadores
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        {bookmarks.length > 0 ? (
                            bookmarks.map(b => (
                                <button
                                    key={`${b.bookId}-${b.chapterId}-${b.verseNumber}`}
                                    onClick={() => navigate(`/reader/${b.bookId}/${b.chapterId}?v=${b.verseNumber}`)}
                                    className="p-4 bg-card border rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all text-left"
                                >
                                    <div>
                                        <p className="font-bold">{b.bookName} {b.chapterId}:{b.verseNumber}</p>
                                        <p className="text-xs opacity-50">Marcado em {new Date().toLocaleDateString()}</p>
                                    </div>
                                    <Bookmark className="h-4 w-4 text-primary fill-primary" />
                                </button>
                            ))
                        ) : (
                            <div className="bg-card border border-dashed rounded-2xl p-8 text-center opacity-40">
                                Nenhum marcador salvo.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Atividade e Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border rounded-3xl p-6 space-y-6">
                    <h2 className="font-bold flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" /> Atividade Semanal
                    </h2>
                    <div className="h-48 flex items-end gap-3 px-2">
                        {STATS.weeklyActivity.map((bar, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${bar.h}%` }}
                                    className="w-full bg-primary/20 rounded-t-xl hover:bg-primary/50 transition-colors"
                                />
                                <span className="text-[10px] font-bold opacity-40">{bar.d}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-card border rounded-3xl p-6 space-y-6">
                    <h2 className="font-bold flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-primary" /> Progresso do Testamento
                    </h2>
                    <div className="space-y-6">
                        {STATS.testament.map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold">{item.label}</span>
                                    <span className="font-black text-primary">{item.pct}%</span>
                                </div>
                                <div className="w-full h-3 bg-primary/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.pct}%` }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
