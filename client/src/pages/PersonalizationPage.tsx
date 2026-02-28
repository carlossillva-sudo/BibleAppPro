import React, { useState } from 'react';
import { Palette, Type, Save, Check, Eye, Sun, Moon, Monitor, LayoutTemplate, Settings2, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { usePreferencesStore, THEMES_DATA } from '../store/preferencesStore';
import type { AppearanceMode, FontFamily, ReadingWidth, VerseSpacing, ReadingMode } from '../store/preferencesStore';
import { cn } from '../utils/cn';

export const PersonalizationPage: React.FC = () => {
    const {
        appearanceMode, theme,
        fontSize, lineHeight, readingWidth, fontFamily,
        verseSpacing, readingMode, smoothTransitions, boldVerses, showVerseNumbers,
        setAppearanceMode, setTheme,
        setFontSize, setLineHeight, setReadingWidth, setFontFamily,
        setVerseSpacing, setReadingMode, setSmoothTransitions, setBoldVerses, setShowVerseNumbers
    } = usePreferencesStore();

    const [saved, setSaved] = useState(false);
    const [themeFilter, setThemeFilter] = useState<'all' | 'light' | 'dark' | 'favorites'>('all');

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const appearanceOptions: { value: AppearanceMode; label: string; icon: any }[] = [
        { value: 'light', label: 'Claro', icon: Sun },
        { value: 'dark', label: 'Escuro', icon: Moon },
        { value: 'system', label: 'Sistema', icon: Monitor },
    ];

    const allThemes = Object.entries(THEMES_DATA).map(([id, data]) => ({ id, ...data }));
    const filteredThemes = allThemes.filter(t => {
        if (themeFilter === 'light') return t.mode === 'light' && t.id !== 'parchment';
        if (themeFilter === 'dark') return t.mode === 'dark' && t.id !== 'amoled';
        return true; // 'all' and 'favorites' (favorites to be implemented later if needed in UI, for now showing all)
    });

    const fonts: { value: FontFamily; label: string }[] = [
        { value: 'Inter', label: 'Inter' },
        { value: 'Lora', label: 'Lora' },
        { value: 'Georgia', label: 'Georgia' },
        { value: 'Merriweather', label: 'Merriweather' },
        { value: 'Open Sans', label: 'Open Sans' },
        { value: 'System', label: 'Fonte do Dispositivo' },
    ];

    const widthOptions: { value: ReadingWidth; label: string; icon: string }[] = [
        { value: 'narrow', label: 'Estreito', icon: '▐▌' },
        { value: 'medium', label: 'Médio', icon: '▐ ▌' },
        { value: 'wide', label: 'Largo', icon: '▐   ▌' },
    ];


    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-12 pb-32 animate-in fade-in duration-500">
            <header className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.25em]">
                    <Settings2 className="h-4 w-4" /> Configurações Globais
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Personalização.</h1>
                <p className="text-base text-muted-foreground font-medium">Sua experiência de leitura, perfeitamente adaptada a você.</p>
            </header>

            <div className="grid gap-8">
                {/* 1. MODO DE APARÊNCIA */}
                <section className="bg-card border border-foreground/5 rounded-[32px] p-6 md:p-8 shadow-sm">
                    <div className="mb-6 space-y-1">
                        <h2 className="font-black text-xl flex items-center gap-3"><Monitor className="h-5 w-5 text-primary" /> Modo de Aparência</h2>
                        <p className="text-sm text-muted-foreground">O modo "Sistema" acompanha a preferência atual do seu dispositivo.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {appearanceOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setAppearanceMode(opt.value)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-3xl border-2 transition-all group",
                                    appearanceMode === opt.value
                                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                        : "border-transparent bg-muted/30 hover:bg-muted/50"
                                )}
                            >
                                <opt.icon className={cn(
                                    "h-8 w-8 transition-transform group-hover:scale-110",
                                    appearanceMode === opt.value ? "text-primary" : "text-muted-foreground"
                                )} />
                                <span className={cn(
                                    "text-sm font-bold",
                                    appearanceMode === opt.value ? "text-primary font-black" : "text-foreground/70"
                                )}>{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. TEMAS */}
                <section className="bg-card border border-foreground/5 rounded-[32px] p-6 md:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div className="space-y-1">
                            <h2 className="font-black text-xl flex items-center gap-3"><Palette className="h-5 w-5 text-primary" /> Temas Premium</h2>
                            <p className="text-sm text-muted-foreground">Selecione uma paleta de cores para customizar a interface.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            {['all', 'light', 'dark'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setThemeFilter(f as any)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize",
                                        themeFilter === f ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    )}
                                >
                                    {f === 'all' ? 'Todos' : f === 'light' ? 'Claros' : 'Escuros'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {filteredThemes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={cn(
                                    "flex flex-col items-center gap-3 transition-all relative group",
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-14 h-14 md:w-16 md:h-16 rounded-full shadow-inner border transition-all flex items-center justify-center",
                                        theme === t.id ? "ring-4 ring-primary ring-offset-2 ring-offset-card scale-110" : "border-foreground/10 group-hover:scale-105"
                                    )}
                                    style={{ backgroundColor: `hsl(${t.bg})` }}
                                >
                                    <div className="w-6 h-6 rounded-full opacity-80" style={{ backgroundColor: `hsl(${t.accent})` }} />
                                    {theme === t.id && (
                                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground p-0.5 rounded-full shadow-md z-10">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[10px] md:text-[11px] font-bold text-center leading-tight px-1",
                                    theme === t.id ? "text-primary" : "text-muted-foreground"
                                )}>{t.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. TIPOGRAFIA */}
                <section className="bg-card border border-foreground/5 rounded-[32px] p-6 md:p-8 shadow-sm space-y-10">
                    <div className="space-y-1">
                        <h2 className="font-black text-xl flex items-center gap-3"><Type className="h-5 w-5 text-primary" /> Tipografia & Layout</h2>
                        <p className="text-sm text-muted-foreground">Ajuste o texto para a leitura mais confortável possível.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Sliders Area */}
                        <div className="space-y-8">
                            {/* Font Size */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Tamanho ({fontSize}px)</span>
                                </div>
                                <input
                                    type="range" min="14" max="32" step="1"
                                    value={fontSize}
                                    onChange={e => setFontSize(Number(e.target.value))}
                                    className="w-full h-2 bg-muted rounded-full appearance-none accent-primary cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] font-black text-muted-foreground/50 uppercase">
                                    <span>Menor</span>
                                    <span>Maior</span>
                                </div>
                            </div>

                            {/* Line Height */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Espaçamento Entre Linhas ({lineHeight})</span>
                                </div>
                                <input
                                    type="range" min="1.4" max="2.4" step="0.1"
                                    value={lineHeight}
                                    onChange={e => setLineHeight(Number(e.target.value))}
                                    className="w-full h-2 bg-muted rounded-full appearance-none accent-primary cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] font-black text-muted-foreground/50 uppercase">
                                    <span>Comprimido</span>
                                    <span>Relaxado</span>
                                </div>
                            </div>
                        </div>

                        {/* Toggles & Options */}
                        <div className="space-y-6">
                            {/* Font Family List */}
                            <div className="space-y-3">
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest block mb-2">Família da Fonte</span>
                                <div className="grid grid-cols-2 gap-2">
                                    {fonts.map(font => (
                                        <button
                                            key={font.value}
                                            onClick={() => setFontFamily(font.value)}
                                            className={cn(
                                                "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left truncate border",
                                                fontFamily === font.value
                                                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                                                    : "bg-muted/30 hover:bg-muted border-foreground/5 text-foreground/80"
                                            )}
                                        >
                                            {font.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border/50">
                        <span className="text-xs font-black text-muted-foreground uppercase tracking-widest block mb-4">Largura de Leitura</span>
                        <div className="grid grid-cols-3 gap-4">
                            {widthOptions.map(w => (
                                <button
                                    key={w.value}
                                    onClick={() => setReadingWidth(w.value)}
                                    className={cn(
                                        "p-4 border rounded-2xl flex flex-col items-center gap-3 transition-all",
                                        readingWidth === w.value ? "bg-primary/5 border-primary text-primary shadow-sm" : "border-foreground/5 bg-muted/20 text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    <span className="font-mono text-xl opacity-60 tracking-widest">{w.icon}</span>
                                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">{w.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div className="p-6 md:p-8 rounded-[24px] bg-background border border-border shadow-inner relative mt-8">
                        <span className="absolute top-0 right-8 px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-b-lg shadow-sm">Preview</span>
                        <p
                            className="text-foreground transition-all duration-300"
                            style={{
                                fontSize: `${fontSize}px`,
                                lineHeight: lineHeight,
                                fontFamily: fontFamily === 'System' ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : fontFamily
                            }}
                        >
                            <span className={cn(
                                "text-[0.6em] font-black opacity-30 mr-2 align-top",
                                !showVerseNumbers && "hidden"
                            )}>1</span>
                            <span className={cn(boldVerses && "font-bold")}>
                                O Senhor é o meu pastor; de nada me terei falta. Em verdes pastagens me faz repousar.
                            </span>
                        </p>
                    </div>
                </section>

                {/* 4. COMPORTAMENTO DO LEITOR */}
                <section className="bg-card border border-foreground/5 rounded-[32px] p-6 md:p-8 shadow-sm space-y-6">
                    <div className="space-y-1">
                        <h2 className="font-black text-xl flex items-center gap-3"><LayoutTemplate className="h-5 w-5 text-primary" /> Comportamento do Leitor</h2>
                        <p className="text-sm text-muted-foreground">Personalize as ferramentas na interface de leitura.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            {
                                id: 'numbers', title: 'Números dos Versículos', desc: 'Exibir os numerais antes de cada verso',
                                icon: Eye, state: showVerseNumbers, setter: setShowVerseNumbers
                            },
                            {
                                id: 'bold', title: 'Versículos em Negrito', desc: 'Destacar fortemente os textos',
                                icon: Type, state: boldVerses, setter: setBoldVerses
                            },
                            {
                                id: 'smooth', title: 'Transições Suaves', desc: 'Animações fluidas entre páginas do leitor',
                                icon: BookOpen, state: smoothTransitions, setter: setSmoothTransitions
                            },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => item.setter(!item.state)}
                                className={cn(
                                    "flex items-center justify-between p-4 md:p-5 rounded-2xl border transition-all text-left",
                                    item.state ? "bg-primary/5 border-primary/30 shadow-sm" : "bg-muted/20 border-border hover:bg-muted"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-2 rounded-xl", item.state ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className={cn("text-sm font-bold", item.state ? "text-primary" : "")}>{item.title}</p>
                                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-10 h-5 rounded-full relative transition-colors",
                                    item.state ? "bg-primary" : "bg-muted-foreground/30"
                                )}>
                                    <div className={cn(
                                        "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                                        item.state ? "translate-x-[22px]" : "translate-x-0.5"
                                    )} />
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Verse Spacing selector */}
                        <div className="space-y-3 p-5 rounded-2xl bg-muted/10 border border-border">
                            <span className="text-xs font-black text-foreground uppercase tracking-widest block">Espaçamento entre Versículos</span>
                            <div className="flex bg-muted/50 p-1 rounded-xl">
                                {[
                                    { value: 'compact', label: 'Compacto' },
                                    { value: 'normal', label: 'Normal' },
                                    { value: 'relaxed', label: 'Relaxado' }
                                ].map(v => (
                                    <button
                                        key={v.value}
                                        onClick={() => setVerseSpacing(v.value as VerseSpacing)}
                                        className={cn(
                                            "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                                            verseSpacing === v.value ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {v.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reading Mode selector */}
                        <div className="space-y-3 p-5 rounded-2xl bg-muted/10 border border-border">
                            <span className="text-xs font-black text-foreground uppercase tracking-widest block">Modo de Rolagem / Navegação</span>
                            <div className="flex bg-muted/50 p-1 rounded-xl">
                                {[
                                    { value: 'continuous', label: 'Infinita Vertical' },
                                    { value: 'paginated', label: 'Por Capítulo' }
                                ].map(r => (
                                    <button
                                        key={r.value}
                                        onClick={() => setReadingMode(r.value as ReadingMode)}
                                        className={cn(
                                            "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                                            readingMode === r.value ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Save/Persist Notice */}
            <div className="flex flex-col md:flex-row items-center justify-between p-4 px-6 md:p-6 bg-primary/5 border border-primary/20 rounded-3xl mt-12 mb-8">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-sm font-bold text-foreground">As preferências são aplicadas instantaneamente.</p>
                    <p className="text-[11px] font-medium text-muted-foreground">Salvas localmente no seu dispositivo.</p>
                </div>
                <Button
                    onClick={handleSave}
                    size="lg"
                    className="w-full md:w-auto px-8 rounded-2xl gap-2 font-black shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                    {saved ? <><Check className="h-5 w-5" /> Sincronizado</> : <><Save className="h-5 w-5" /> Salvar & Concluir</>}
                </Button>
            </div>
        </div>
    );
};
