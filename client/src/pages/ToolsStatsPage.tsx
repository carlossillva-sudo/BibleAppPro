import React from 'react';
import {
  BarChart3,
  PieChart,
  BookOpen,
  Award,
  Flame,
  Download,
  History,
  Bookmark,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useHistoryStore } from '../store/historyStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useGamificationStore } from '../store/gamificationStore';
import { motion } from 'framer-motion';

export const ToolsStatsPage: React.FC = () => {
  const navigate = useNavigate();
  const { history, bookmarks } = useHistoryStore();
  const {
    getTotalChaptersThisWeek,
    getTotalChaptersThisMonth,
    getAverageDailyReading,
    getWeeklyData,
  } = useAnalyticsStore();
  const { currentStreak, chaptersRead, xp, getCurrentLevel } = useGamificationStore();

  const currentLevel = getCurrentLevel();
  const weeklyData = getWeeklyData();

  const weeklyChapters = getTotalChaptersThisWeek();
  const monthlyChapters = getTotalChaptersThisMonth();
  const avgDaily = getAverageDailyReading();

  const STATS = {
    streak: currentStreak,
    chaptersRead: chaptersRead,
    xp: xp,
    level: currentLevel.level,
    levelTitle: currentLevel.title,
    weeklyChapters,
    monthlyChapters,
    avgDaily,
    biblePercent: Math.min(Math.round((chaptersRead / 1189) * 100), 100),
    weeklyActivity: weeklyData.map((d) => ({
      h: d.value * 10,
      d: new Date(d.date).toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3),
    })),
    testament: [
      { label: 'Antigo Testamento', pct: Math.round((chaptersRead / 813) * 100) || 0 },
      { label: 'Novo Testamento', pct: Math.round((chaptersRead / 376) * 100) || 0 },
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
      `Nível                : ${STATS.levelTitle} (${STATS.level})`,
      `XP Total             : ${STATS.xp}`,
      `Sequência de leitura : ${STATS.streak} dias`,
      `Capítulos lidos      : ${STATS.chaptersRead}`,
      `Bíblia completa      : ${STATS.biblePercent}%`,
      `Esta semana          : ${STATS.weeklyChapters} capítulos`,
      `Este mês             : ${STATS.monthlyChapters} capítulos`,
      `Média diária         : ${STATS.avgDaily} capítulos/dia`,
      '',
      '--- Histórico Recente ---',
      ...history
        .slice(0, 10)
        .map(
          (h) => `  ${new Date(h.timestamp).toLocaleDateString()} - ${h.bookName} ${h.chapterId}`
        ),
      '',
      '--- Marcadores ---',
      ...bookmarks.map((b) => `  ${b.bookName} ${b.chapterId}:${b.verseNumber}`),
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="premium-card p-4 space-y-2 bg-primary/5 border-primary/10">
          <Flame className="h-6 w-6 text-orange-500" />
          <p className="text-2xl font-black">{STATS.streak}</p>
          <p className="text-xs font-bold opacity-60">Dias de sequência</p>
        </div>
        <div className="bg-card border rounded-2xl p-4 space-y-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <p className="text-2xl font-black">{STATS.chaptersRead}</p>
          <p className="text-xs font-bold opacity-60">Capítulos lidos</p>
        </div>
        <div className="bg-card border rounded-2xl p-4 space-y-2">
          <Award className="h-6 w-6 text-yellow-500" />
          <p className="text-2xl font-black">
            {STATS.xp} <span className="text-xs font-normal">XP</span>
          </p>
          <p className="text-xs font-bold opacity-60">
            {STATS.levelTitle} (Nível {STATS.level})
          </p>
        </div>
        <div className="bg-card border rounded-2xl p-4 space-y-2">
          <PieChart className="h-6 w-6 text-purple-500" />
          <p className="text-2xl font-black">{STATS.biblePercent}%</p>
          <p className="text-xs font-bold opacity-60">Bíblia completa</p>
        </div>
      </div>

      {/* Estatísticas Semanais/Mensais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-card border rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase">Esta semana</p>
          <p className="text-xl font-black text-primary">
            {STATS.weeklyChapters} <span className="text-xs font-normal">capítulos</span>
          </p>
        </div>
        <div className="bg-card border rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase">Este mês</p>
          <p className="text-xl font-black text-primary">
            {STATS.monthlyChapters} <span className="text-xs font-normal">capítulos</span>
          </p>
        </div>
        <div className="bg-card border rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase">Média diária</p>
          <p className="text-xl font-black text-primary">
            {STATS.avgDaily} <span className="text-xs font-normal">capítulos</span>
          </p>
        </div>
        <div className="bg-card border rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase">Testamentos</p>
          <div className="text-xs font-bold">
            <p>AT: {STATS.testament[0].pct}%</p>
            <p>NT: {STATS.testament[1].pct}%</p>
          </div>
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
                        <p className="font-bold">
                          {item.bookName} {item.chapterId}
                        </p>
                        <p className="text-xs opacity-50">
                          {new Date(item.timestamp).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-30" />
                  </motion.div>
                ))}
                {history.length > 5 && (
                  <div className="p-3 text-center">
                    <Button variant="ghost" size="sm" className="text-xs font-bold opacity-60">
                      Ver Histórico Completo
                    </Button>
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
              bookmarks.map((b) => (
                <button
                  key={`${b.bookId}-${b.chapterId}-${b.verseNumber}`}
                  onClick={() => navigate(`/reader/${b.bookId}/${b.chapterId}?v=${b.verseNumber}`)}
                  className="p-4 bg-card border rounded-2xl flex items-center justify-between hover:border-primary/30 transition-all text-left"
                >
                  <div>
                    <p className="font-bold">
                      {b.bookName} {b.chapterId}:{b.verseNumber}
                    </p>
                    <p className="text-xs opacity-50">
                      Marcado em {new Date().toLocaleDateString()}
                    </p>
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
