import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    BookOpen,
    Sparkles,
    ArrowRight,
    Flame,
    Heart,
    Target,
    BarChart3,
    Handshake as HandsPraying,
    ChevronRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { usePreferencesStore } from '../store/preferencesStore';
import { PlanProgress } from '../components/plans/PlanProgress';

interface BibleBook { number: string; name: string; chaptersCount: number; }

const VERSES_OF_DAY = [
    { ref: 'Salmo 119:105', text: 'Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.' },
    { ref: 'Jeremias 29:11', text: 'Porque eu sei os planos que tenho para vocês, planos de fazê-los prosperar e não de lhes causar dano, planos de dar-lhes esperança e um futuro.' },
    { ref: 'Filipenses 4:13', text: 'Tudo posso naquele que me fortalece.' },
];

function getVerseOfDay() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return VERSES_OF_DAY[dayOfYear % VERSES_OF_DAY.length];
}

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore(s => s.user);
    const lastRead = usePreferencesStore(s => s.lastRead);

    const { data: books } = useQuery<BibleBook[]>({
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
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 relative overflow-hidden bg-primary p-10 rounded-[40px] flex flex-col justify-between min-h-[320px] shadow-2xl">
                    <div className="space-y-3 relative z-10">
                        <p className="text-xs font-black text-primary-foreground/60 uppercase tracking-[0.2em]">{greeting}</p>
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                            {user?.name || 'Leitor'} 👋
                        </h1>
                        <p className="text-primary-foreground/80 font-medium text-lg max-w-md">Que sua jornada seja transformadora hoje.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 relative z-10 mt-8">
                        <Button onClick={() => navigate(`/reader/${continueBookId}/${continueChapter}`)} className="h-16 px-10 rounded-2xl bg-white text-primary hover:bg-white/90 font-black text-lg gap-3 shadow-xl">
                            <BookOpen className="h-5 w-5" /> Continuar: {continueBook} {continueChapter}
                        </Button>
                        <Button variant="ghost" onClick={() => navigate('/library')} className="h-16 px-8 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold gap-2 backdrop-blur-md">
                            <ChevronRight className="h-5 w-5" /> Explorar Bíblia
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-card border border-foreground/5 rounded-[40px] p-10 flex flex-col justify-between gap-8 relative overflow-hidden group">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest">
                            <Sparkles className="h-4 w-4" /> Versículo do Dia
                        </div>
                        <blockquote className="font-serif text-3xl italic leading-tight">"{verseOfDay.text}"</blockquote>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-foreground/5">
                        <p className="text-base text-muted-foreground font-bold">— {verseOfDay.ref}</p>
                        <Button variant="ghost" onClick={() => navigator.clipboard.writeText(`"${verseOfDay.text}" — ${verseOfDay.ref}`)} className="h-10 rounded-xl gap-2 font-black text-xs hover:bg-primary/5 text-primary"><Heart className="h-4 w-4" /> Copiar</Button>
                    </div>
                </div>
            </div>

            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">Acesso Rápido</h2>
                    <Button variant="ghost" onClick={() => navigate('/library')} className="text-xs font-black text-primary gap-2 hover:bg-primary/5">VER TODOS <ArrowRight className="h-3 w-3" /></Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Biblioteca', desc: '66 Livros', icon: BookOpen, path: '/library', emoji: '📖' },
                        { label: 'Orações', desc: 'Seu Diário', icon: HandsPraying, path: '/journal', emoji: '🙏' },
                        { label: 'Favoritos', desc: 'Versículos', icon: Heart, path: '/favorites', emoji: '❤️' },
                        { label: 'Estatísticas', desc: 'Seu Progresso', icon: BarChart3, path: '/stats', emoji: '📊' },
                    ].map(q => (
                        <button key={q.path} onClick={() => navigate(q.path)} className="bg-card border border-foreground/5 rounded-[32px] p-8 text-left hover:border-primary/40 hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col justify-between aspect-square md:aspect-auto md:h-48">
                            <span className="text-4xl mb-4 block group-hover:scale-125 transition-transform">{q.emoji}</span>
                            <div>
                                <p className="font-black text-xl tracking-tight group-hover:text-primary transition-colors">{q.label}</p>
                                <p className="text-[10px] text-muted-foreground font-black mt-1 uppercase tracking-widest opacity-60">{q.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: Flame, value: '7', label: 'Dias seguidos', color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    { icon: BookOpen, value: '142', label: 'Capítulos lidos', color: 'text-primary', bg: 'bg-primary/10' },
                    { icon: Heart, value: '23', label: 'Favoritos', color: 'text-pink-500', bg: 'bg-pink-500/10' },
                    { icon: Target, value: '45%', label: 'Plano ativo', color: 'text-green-600', bg: 'bg-green-500/10' },
                ].map((s, i) => (
                    <div key={i} className="bg-card border border-foreground/5 rounded-2xl p-5 flex items-center gap-4 group">
                        <div className={`${s.bg} p-3 rounded-2xl`}>
                            <s.icon className={`h-6 w-6 ${s.color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-black leading-none">{s.value}</p>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-card border border-foreground/5 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="flex-1 space-y-4 w-full">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Plano Ativo</p>
                    <p className="text-2xl font-black tracking-tight">Bíblia em 1 Ano — <span className="text-primary italic">Dia 164/365</span></p>
                    <PlanProgress current={164} total={365} />
                </div>
                <div className="shrink-0 flex items-center gap-4 relative z-10">
                    <Button onClick={() => navigate('/plans')} className="h-14 px-10 rounded-2xl bg-foreground text-background hover:bg-foreground/80 font-black gap-2 shadow-xl transition-all hover:translate-x-1">
                        Ver Planos <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {books && <div className="hidden">{books.length}</div>}
        </div>
    );
};
