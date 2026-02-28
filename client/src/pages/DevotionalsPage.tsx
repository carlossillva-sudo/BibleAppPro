import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, Heart, Share2, CheckCircle2, Bookmark, Flame, Sun, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '../utils/cn';
import { Button } from '../components/ui/Button';

interface DevotionalEntry {
    date: string;
    title: string;
    verse: string;
    reference: string;
    content: string;
    reflection: string;
    prayer: string;
}

const MONTHS = [
    { name: 'Janeiro', theme: 'Fé e Novos Começos' },
    { name: 'Fevereiro', theme: 'Amor e Relacionamentos' },
    { name: 'Março', theme: 'Renovação e Crescimento' },
    { name: 'Abril', theme: 'Propósito e Missão' },
    { name: 'Maio', theme: 'Família e Legado' },
    { name: 'Junho', theme: 'Sabedoria e Decisões' },
    { name: 'Julho', theme: 'Descanso e Restauração' },
    { name: 'Agosto', theme: 'Perseverança e Luta' },
    { name: 'Setembro', theme: 'Gratidão e Colheita' },
    { name: 'Outubro', theme: 'Identidade em Cristo' },
    { name: 'Novembro', theme: 'Generosidade e Serviço' },
    { name: 'Dezembro', theme: 'Esperança e Promessa' }
];

const DEVOTIONAL_DATA: Record<string, DevotionalEntry> = {
    '2026-01-01': {
        date: '2026-01-01',
        title: 'Um Novo Tabuleiro de Cores',
        verse: 'E aquele que estava assentado sobre o trono disse: Eis que faço novas todas as coisas.',
        reference: 'Apocalipse 21:5',
        content: 'O primeiro dia do ano é como uma tela em branco diante de um artista. Muitas vezes carregamos as manchas e erros do passado, mas a promessa divina é de renovação. Deus não apenas limpa o que passou; Ele cria algo inteiramente novo. Começar com fé significa confiar que o Autor da Vida tem cores mais vibrantes preparadas para este novo ciclo do que as que vimos anteriormente.',
        reflection: 'Que área da sua vida você mais deseja que Deus torne "nova" este ano?',
        prayer: 'Senhor, entrego este ano em Tuas mãos. Que a Tua renovação alcance meu coração e minha mente, fazendo-me enxergar as novas oportunidades que Tu tens para mim. Amém.'
    },
    '2026-02-01': {
        date: '2026-02-01',
        title: 'O Fundamento do Amor',
        verse: 'Nós amamos porque ele nos amou primeiro.',
        reference: '1 João 4:19',
        content: 'Iniciamos fevereiro focando no amor. Muitas vezes tentamos amar por esforço próprio, mas o verdadeiro amor cristão é um reflexo. Só conseguimos dar o que primeiro recebemos dEle. Quando entendemos a profundidade do sacrifício de Jesus, amar ao próximo deixa de ser um peso e passa a ser um transbordar natural da graça que nos alcançou.',
        reflection: 'Como a consciência do amor de Deus por você muda a forma como você trata quem te magoou?',
        prayer: 'Pai, mergulha-me no Teu amor hoje. Que cada ação minha seja uma resposta à Tua bondade infinita. Amém.'
    }
};

export const DevotionalsPage: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [readDates, setReadDates] = useState<Set<string>>(() => {
        try { return new Set(JSON.parse(localStorage.getItem('read-devotionals') || '[]')); } catch { return new Set(); }
    });
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        localStorage.setItem('read-devotionals', JSON.stringify([...readDates]));
    }, [readDates]);

    const daysInMonth = useMemo(() => {
        const date = new Date(2026, currentMonth, 1);
        const days = [];
        while (date.getMonth() === currentMonth) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [currentMonth]);

    const currentDevotional = useMemo(() => {
        return DEVOTIONAL_DATA[selectedDate] || {
            date: selectedDate,
            title: `Estudo: ${MONTHS[currentMonth].theme}`,
            verse: 'Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.',
            reference: 'Salmos 119:105',
            content: `Hoje meditamos sobre ${MONTHS[currentMonth].theme.toLowerCase()}. A Palavra de Deus nos convida a aprofundar nossa jornada de fé a cada dia. (Conteúdo para o plano completo de 2026 disponível em tempo real).`,
            reflection: 'Como este tema se aplica aos desafios que você está enfrentando esta semana?',
            prayer: 'Senhor, continua nos guiando através da Tua Palavra todos os dias deste ano. Amém.'
        };
    }, [selectedDate, currentMonth]);

    const isRead = readDates.has(selectedDate);

    const toggleRead = () => {
        setReadDates(prev => {
            const next = new Set(prev);
            if (next.has(selectedDate)) next.delete(selectedDate);
            else next.add(selectedDate);
            return next;
        });
    };

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden pb-20">
            <header className="p-6 md:p-10 border-b bg-card/50 backdrop-blur-xl shrink-0">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                            <Sun className="h-3 w-3" /> Jornada Diária 2026
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter">Devocional.</h1>
                        <p className="text-muted-foreground font-bold flex items-center gap-2">
                            {MONTHS[currentMonth].name} — <span className="text-primary italic">{MONTHS[currentMonth].theme}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(m => (m > 0 ? m - 1 : 11))} className="rounded-xl">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <span className="font-black text-lg min-w-32 text-center uppercase tracking-widest">{MONTHS[currentMonth].name}</span>
                        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(m => (m < 11 ? m + 1 : 0))} className="rounded-xl">
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto mt-8 flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                    {daysInMonth.map((d, i) => {
                        const dateStr = d.toISOString().split('T')[0];
                        const active = selectedDate === dateStr;
                        const read = readDates.has(dateStr);
                        return (
                            <button
                                key={dateStr}
                                onClick={() => setSelectedDate(dateStr)}
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[60px] h-[80px] rounded-2xl border-2 transition-all relative",
                                    active ? "bg-primary border-primary text-primary-foreground shadow-2xl scale-110" : "bg-card border-foreground/5 text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <span className="text-[10px] font-black uppercase opacity-60">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)}</span>
                                <span className="text-xl font-black leading-none mt-1">{i + 1}</span>
                                {read && <div className={cn("absolute top-2 right-2 w-1.5 h-1.5 rounded-full", active ? "bg-white" : "bg-primary")} />}
                            </button>
                        );
                    })}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            {new Date(selectedDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter leading-tight">{currentDevotional.title}</h2>
                        <div className="flex items-center justify-center gap-2 text-primary">
                            <Bookmark className="h-4 w-4 fill-current" />
                            <span className="font-black text-sm uppercase tracking-widest">{currentDevotional.reference}</span>
                        </div>
                    </div>

                    <div className="bg-primary p-12 rounded-[48px] text-primary-foreground shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
                        <div className="relative z-10 space-y-6 text-center">
                            <p className="text-2xl md:text-3xl font-serif italic font-medium leading-relaxed">
                                "{currentDevotional.verse}"
                            </p>
                            <div className="w-12 h-1 bg-white/30 mx-auto rounded-full" />
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="prose prose-xl dark:prose-invert max-w-none">
                            <p className="text-xl leading-relaxed font-serif text-foreground/90 first-letter:text-6xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:mt-1">
                                {currentDevotional.content}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-card border-2 border-primary/10 p-8 rounded-[32px] space-y-4 hover:shadow-xl transition-all">
                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Flame className="h-4 w-4" /> Reflexão
                                </h4>
                                <p className="text-lg font-bold italic leading-relaxed text-foreground/80">
                                    {currentDevotional.reflection}
                                </p>
                            </div>
                            <div className="bg-muted p-8 rounded-[32px] space-y-4">
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" /> Oração
                                </h4>
                                <p className="text-lg font-medium leading-relaxed text-muted-foreground/90">
                                    {currentDevotional.prayer}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pb-20">
                        <Button
                            onClick={toggleRead}
                            className={cn(
                                "flex-1 h-20 rounded-3xl text-xl font-black gap-3 shadow-2xl transition-all",
                                isRead ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"
                            )}
                        >
                            {isRead ? <><CheckCircle2 className="h-6 w-6" /> CONCLUÍDO</> : "MARCAR COMO LIDO"}
                        </Button>
                        <div className="flex gap-4">
                            <Button variant="outline" onClick={() => setIsFavorite(!isFavorite)} className="h-20 w-20 rounded-3xl border-2">
                                <Heart className={cn("h-6 w-6", isFavorite && "fill-red-500 text-red-500")} />
                            </Button>
                            <Button variant="outline" className="h-20 w-20 rounded-3xl border-2">
                                <Share2 className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
