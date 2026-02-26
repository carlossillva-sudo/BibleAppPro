import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { BookOpen, ChevronRight, Sparkles, ArrowRight, Flame, Heart, Calendar, Target } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { usePreferencesStore } from '../store/preferencesStore';
import { PlanProgress } from '../components/plans/PlanProgress';

interface BibleBook { number: string; name: string; chaptersCount: number; }

const VERSES_OF_DAY = [
    { ref: 'Salmo 119:105', text: 'Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.' },
    { ref: 'Jeremias 29:11', text: 'Porque eu sei os planos que tenho para vocês, planos de fazê-los prosperar e não de lhes causar dano, planos de dar-lhes esperança e um futuro.' },
    { ref: 'Filipenses 4:13', text: 'Tudo posso naquele que me fortalece.' },
    { ref: 'Salmo 23:1', text: 'O Senhor é meu pastor; nada me faltará.' },
    { ref: 'Isaías 41:10', text: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.' },
    { ref: 'Romanos 8:28', text: 'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus.' },
    { ref: 'Provérbios 3:5', text: 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.' },
];

function getVerseOfDay() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return VERSES_OF_DAY[dayOfYear % VERSES_OF_DAY.length];
}

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore(s => s.user);
    const lastRead = usePreferencesStore(s => s.lastRead);
    const { data: books, isLoading, error } = useQuery<BibleBook[]>({
        queryKey: ['bible-books'],
        queryFn: async () => (await api.get('/bible/livros')).data,
    });

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
    const verseOfDay = getVerseOfDay();

    const continueBook = lastRead?.bookName || 'Gênesis';
    const continueChapter = lastRead?.chapterId || '1';
    const continueBookId = lastRead?.bookId || '1';

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Hero row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-3 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 rounded-2xl p-7 flex flex-col justify-between gap-6">
                    <div className="space-y-2">
                        <p className="text-sm font-bold text-primary uppercase tracking-widest">{greeting}</p>
                        <h1 className="text-3xl font-black tracking-tight">{user?.name || 'Leitor'} 👋</h1>
                        <p className="text-muted-foreground">Continue de onde parou, ou explore algo novo.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={() => navigate(`/reader/${continueBookId}/${continueChapter}`)}
                            className="rounded-xl gap-2 shadow-lg shadow-primary/20 h-12 px-6">
                            <BookOpen className="h-5 w-5" /> Continuar: {continueBook} {continueChapter} <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/plans')} className="rounded-xl gap-2 h-12">
                            <Calendar className="h-5 w-5" /> Plano do Dia
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-card border rounded-2xl p-6 flex flex-col justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest">
                        <Sparkles className="h-4 w-4" /> Versículo do Dia
                    </div>
                    <blockquote className="font-serif text-xl italic leading-relaxed flex-1 flex items-center">"{verseOfDay.text}"</blockquote>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground font-medium">— {verseOfDay.ref}</p>
                        <Button variant="ghost" size="sm" onClick={() => {
                            navigator.clipboard.writeText(`"${verseOfDay.text}" — ${verseOfDay.ref}`);
                        }} className="text-xs gap-1"><Heart className="h-3 w-3" /> Copiar</Button>
                    </div>
                </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-orange-500/10 p-2.5 rounded-xl"><Flame className="h-5 w-5 text-orange-500" /></div>
                    <div><p className="text-xl font-black">7</p><p className="text-[11px] text-muted-foreground">Dias seguidos</p></div>
                </div>
                <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-xl"><BookOpen className="h-5 w-5 text-primary" /></div>
                    <div><p className="text-xl font-black">142</p><p className="text-[11px] text-muted-foreground">Capítulos lidos</p></div>
                </div>
                <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-pink-500/10 p-2.5 rounded-xl"><Heart className="h-5 w-5 text-pink-500" /></div>
                    <div><p className="text-xl font-black">23</p><p className="text-[11px] text-muted-foreground">Favoritos</p></div>
                </div>
                <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-green-500/10 p-2.5 rounded-xl"><Target className="h-5 w-5 text-green-600" /></div>
                    <div><p className="text-xl font-black">45%</p><p className="text-[11px] text-muted-foreground">Plano ativo</p></div>
                </div>
            </div>

            {/* Active plan strip */}
            <div className="bg-card border rounded-2xl p-5 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 space-y-2 w-full">
                    <p className="text-xs font-black text-primary uppercase tracking-widest">Plano Ativo</p>
                    <p className="font-bold text-lg">Bíblia em 1 Ano — Dia 164/365</p>
                    <PlanProgress current={164} total={365} />
                </div>
                <Button onClick={() => navigate('/plans')} variant="outline" className="rounded-xl gap-2 shrink-0">
                    Ver Planos <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Quick nav */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Buscar', emoji: '🔍', path: '/search' },
                    { label: 'Favoritos', emoji: '❤️', path: '/favorites' },
                    { label: 'Orações', emoji: '🙏', path: '/journal' },
                    { label: 'Estatísticas', emoji: '📊', path: '/stats' },
                ].map(q => (
                    <button key={q.path} onClick={() => navigate(q.path)} className="bg-card border rounded-xl p-4 text-left hover:border-primary/40 hover:shadow-md transition-all group">
                        <span className="text-2xl">{q.emoji}</span>
                        <p className="font-bold text-sm mt-2 group-hover:text-primary transition-colors">{q.label}</p>
                    </button>
                ))}
            </div>

            {/* Book grid */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Biblioteca</h2>
                    <p className="text-xs text-muted-foreground">66 livros</p>
                </div>
                {error && <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">Erro ao carregar. Verifique o backend na porta 3000.</div>}
                {isLoading && (
                    <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-11 gap-2">
                        {[...Array(22)].map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)}
                    </div>
                )}
                {books && (
                    <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-11 gap-2">
                        {books.map(b => (
                            <button key={b.number} onClick={() => navigate(`/reader/${b.number}/1`)}
                                className="group bg-card border rounded-xl p-2.5 text-center hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg transition-all">
                                <p className="text-[11px] font-bold leading-tight group-hover:text-primary transition-colors truncate">{b.name}</p>
                                <p className="text-[9px] text-muted-foreground mt-0.5">{b.chaptersCount}</p>
                            </button>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
