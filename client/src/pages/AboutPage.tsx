import React from 'react';
import {
    BookOpen, Sparkles, Heart, Shield,
    Zap, Globe, Mail, Github,
    Star, Info, ChevronRight, MessageCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 pt-16 pb-24 md:pt-24 md:pb-32">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full" />

                <div className="container max-w-5xl mx-auto px-6 relative z-10 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800/30">
                        <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
                        <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Versão 1.0.0 PRO</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic">
                        Bible<span className="text-blue-600">AppPro.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        Uma experiência transformadora de conexão com as Escrituras, redesenhada para a era digital com excelência e profundidade.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Button className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 group">
                            Nossa Missão <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button variant="outline" className="h-14 px-10 rounded-2xl border-2 font-black text-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95">
                            Suporte <Mail className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="container max-w-5xl mx-auto px-6 -mt-12 space-y-24">

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: Zap, title: 'Performance', desc: 'Motor de leitura ultra-rápido com navegação instantânea entre capítulos.', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
                        { icon: Globe, title: 'Multi-idioma', desc: 'Acesse diferentes versões e traduções com um único toque.', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
                        { icon: Shield, title: 'Privacidade', desc: 'Seus dados de leitura e anotações são protegidos e sincronizados de forma segura.', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
                    ].map((f, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-[32px] shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group">
                            <div className={`${f.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <f.icon className={`h-7 w-7 ${f.color}`} />
                            </div>
                            <h3 className="text-xl font-black mb-3">{f.title}</h3>
                            <p className="text-muted-foreground font-medium text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Values / Story Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                                Desenvolvido para <br /> <span className="text-blue-600 underline decoration-blue-200 underline-offset-8 text-shadow-sm">estudiosos e buscadores.</span>
                            </h2>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                O BibleAppPro nasceu com um propósito claro: remover as distrações do mundo moderno e criar um santuário digital para a Palavra de Deus.
                                Acreditamos que a beleza do design deve honrar a grandiosidade da mensagem.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: Heart, text: 'Centrado em Cristo e nas Escrituras.' },
                                { icon: Star, text: 'Interface Premium sem anúncios ou distrações.' },
                                { icon: MessageCircle, text: 'Comunidade global de leitura e oração.' },
                            ].map((v, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                        <v.icon className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span className="font-bold text-slate-700 dark:text-zinc-300">{v.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[60px] flex items-center justify-center shadow-2xl relative overflow-hidden group">
                            <BookOpen className="h-40 w-40 text-white/20 absolute -right-10 -bottom-10 rotate-12 group-hover:scale-110 transition-transform" />
                            <div className="text-white text-center p-12 space-y-6 relative z-10">
                                <Info className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <p className="text-2xl font-black italic">"Lâmpada para os meus pés é a tua palavra e luz para o meu caminho."</p>
                                <p className="font-bold uppercase tracking-widest text-sm opacity-80">— Salmo 119:105</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-zinc-700 max-w-[200px]">
                            <p className="text-xs font-black text-blue-600 uppercase mb-2">Impacto</p>
                            <p className="text-sm font-bold">+10k usuários diários em todo o mundo.</p>
                        </div>
                    </div>
                </div>

                {/* Footer/Contact */}
                <div className="bg-zinc-900 rounded-[48px] p-12 text-center space-y-8 border shadow-inner">
                    <h2 className="text-3xl font-black text-white tracking-tight">Faça parte desta jornada.</h2>
                    <p className="text-zinc-400 font-medium max-w-xl mx-auto">
                        O BibleAppPro é um projeto em constante evolução. Siga nosso desenvolvimento e contribua com feedback.
                    </p>
                    <div className="flex justify-center gap-6">
                        <a href="#" className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-all text-white hover:scale-110">
                            <Github className="h-6 w-6" />
                        </a>
                        <a href="#" className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-all text-white hover:scale-110">
                            <Globe className="h-6 w-6" />
                        </a>
                        <a href="#" className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-all text-white hover:scale-110">
                            <Mail className="h-6 w-6" />
                        </a>
                    </div>
                    <div className="pt-8 border-t border-zinc-800 space-y-2">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Desenvolvido com ❤️ por Antigravity</p>
                        <p className="text-zinc-600 text-[10px] font-medium">© 2026 BibleAppPro. Todos os direitos reservados.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
