import React, { useState, useEffect } from 'react';
import { Palette, Type, Columns, RotateCcw, Check, X, Eye, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { usePreferencesStore, type ThemeMode, type FilterMode } from '../store/preferencesStore';

interface DraftState {
    theme: ThemeMode;
    fontSize: number;
    lineHeight: number;
    readingWidth: 'narrow' | 'medium' | 'wide';
    serifFont: boolean;
    showVerseNumbers: boolean;
    filter: FilterMode;
}

const THEMES: { value: ThemeMode; label: string; color: string; desc: string }[] = [
    { value: 'light', label: 'Claro', color: 'bg-white', desc: 'Leitura diurna' },
    { value: 'dark', label: 'Escuro', color: 'bg-gray-900', desc: 'Confortável à noite' },
    { value: 'sepia', label: 'Sépia', color: 'bg-amber-100', desc: 'Tom acolhedor' },
    { value: 'midnight', label: 'Midnight Blue', color: 'bg-indigo-950', desc: 'Azul profundo' },
    { value: 'paper', label: 'Warm Paper', color: 'bg-orange-50', desc: 'Papel clássico' },
];

const FILTERS: { value: FilterMode; label: string; desc: string }[] = [
    { value: 'none', label: 'Nenhum', desc: 'Sem filtro' },
    { value: 'warm', label: 'Quente', desc: 'Tom sépia leve' },
    { value: 'low-contrast', label: 'Baixo Contraste', desc: 'Menos fadiga visual' },
    { value: 'high-contrast', label: 'Alto Contraste', desc: 'Texto mais nítido' },
];

const WIDTHS: { value: 'narrow' | 'medium' | 'wide'; label: string }[] = [
    { value: 'narrow', label: 'Estreito' },
    { value: 'medium', label: 'Médio' },
    { value: 'wide', label: 'Largo' },
];

export const PersonalizationAdvancedPage: React.FC = () => {
    const store = usePreferencesStore();

    // Draft state for cancel/apply workflow
    const [draft, setDraft] = useState<DraftState>({
        theme: store.theme,
        fontSize: store.fontSize,
        lineHeight: store.lineHeight,
        readingWidth: store.readingWidth,
        serifFont: store.serifFont,
        showVerseNumbers: store.showVerseNumbers,
        filter: store.filter,
    });
    const [hasChanges, setHasChanges] = useState(false);
    const [saved, setSaved] = useState(false);

    // Live preview — apply draft to store immediately so user sees changes
    useEffect(() => {
        store.setTheme(draft.theme);
        store.setFilter(draft.filter);
        store.setFontSize(draft.fontSize);
        store.setLineHeight(draft.lineHeight);
        store.setReadingWidth(draft.readingWidth);
        store.setSerifFont(draft.serifFont);
        store.setShowVerseNumbers(draft.showVerseNumbers);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draft]);

    // Track changes
    const [original] = useState<DraftState>({
        theme: store.theme,
        fontSize: store.fontSize,
        lineHeight: store.lineHeight,
        readingWidth: store.readingWidth,
        serifFont: store.serifFont,
        showVerseNumbers: store.showVerseNumbers,
        filter: store.filter,
    });

    useEffect(() => {
        setHasChanges(JSON.stringify(draft) !== JSON.stringify(original));
    }, [draft, original]);

    const update = <K extends keyof DraftState>(key: K, value: DraftState[K]) => {
        setDraft(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleCancel = () => {
        setDraft(original);
    };

    const handleReset = () => {
        const defaults: DraftState = {
            theme: 'light', fontSize: 18, lineHeight: 2.2,
            readingWidth: 'medium', serifFont: false, showVerseNumbers: true, filter: 'none',
        };
        setDraft(defaults);
    };

    const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
        <button onClick={() => onChange(!checked)}
            className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-primary' : 'bg-muted'}`}>
            <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow transition-all ${checked ? 'right-1' : 'left-1'}`} />
        </button>
    );

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 pb-32">
            <header>
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                    <SlidersHorizontal className="h-8 w-8 text-primary" /> Personalização Premium
                </h1>
                <p className="text-lg text-muted-foreground mt-2">Ajuste sua experiência de leitura com controles avançados.</p>
            </header>

            {/* Themes */}
            <section className="bg-card border rounded-2xl p-6 space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Temas</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {THEMES.map(t => (
                        <button key={t.value} onClick={() => update('theme', t.value)}
                            className={`p-4 rounded-xl flex flex-col items-center gap-2.5 transition-all ${draft.theme === t.value ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : 'hover:shadow-md border border-transparent hover:border-border'}`}>
                            <div className={`h-12 w-12 rounded-full border-2 ${t.color} ${draft.theme === t.value ? 'border-primary' : 'border-border'}`} />
                            <span className="text-xs font-bold">{t.label}</span>
                            <span className="text-[10px] text-muted-foreground">{t.desc}</span>
                            {draft.theme === t.value && <Check className="h-4 w-4 text-primary" />}
                        </button>
                    ))}
                </div>
            </section>

            {/* Typography */}
            <section className="bg-card border rounded-2xl p-6 space-y-5">
                <h2 className="font-bold text-lg flex items-center gap-2"><Type className="h-5 w-5 text-primary" /> Controles de Leitura</h2>

                {/* Font size */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Tamanho da fonte</span>
                        <span className="font-bold text-primary">{draft.fontSize}px</span>
                    </div>
                    <input type="range" min="14" max="32" value={draft.fontSize} onChange={e => update('fontSize', Number(e.target.value))}
                        className="w-full accent-primary h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>A</span><span className="text-lg">A</span></div>
                </div>

                {/* Line height */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Espaçamento entre linhas</span>
                        <span className="font-bold text-primary">{draft.lineHeight.toFixed(1)}</span>
                    </div>
                    <input type="range" min="1.4" max="3.0" step="0.1" value={draft.lineHeight}
                        onChange={e => update('lineHeight', Number(e.target.value))}
                        className="w-full accent-primary h-2 rounded-full" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>Compacto</span><span>Espaçoso</span></div>
                </div>

                {/* Toggles */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-accent/30 rounded-xl">
                        <span className="text-sm font-medium">Fonte serifada (estilo clássico)</span>
                        <Toggle checked={draft.serifFont} onChange={v => update('serifFont', v)} />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-accent/30 rounded-xl">
                        <span className="text-sm font-medium flex items-center gap-2"><Eye className="h-4 w-4" /> Números dos versículos</span>
                        <Toggle checked={draft.showVerseNumbers} onChange={v => update('showVerseNumbers', v)} />
                    </div>
                </div>
            </section>

            {/* Reading width */}
            <section className="bg-card border rounded-2xl p-6 space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2"><Columns className="h-5 w-5 text-primary" /> Largura de Leitura</h2>
                <div className="grid grid-cols-3 gap-4">
                    {WIDTHS.map(w => (
                        <button key={w.value} onClick={() => update('readingWidth', w.value)}
                            className={`p-4 rounded-xl text-center transition-all ${draft.readingWidth === w.value ? 'ring-2 ring-primary bg-primary/5' : 'bg-accent/30 hover:bg-accent/50'}`}>
                            <div className="flex justify-center mb-2">
                                <div className={`h-8 border-l-2 border-r-2 border-muted-foreground/30 ${w.value === 'narrow' ? 'w-8' : w.value === 'wide' ? 'w-20' : 'w-14'}`} />
                            </div>
                            <p className="text-sm font-bold">{w.label}</p>
                        </button>
                    ))}
                </div>
            </section>

            {/* Filters */}
            <section className="bg-card border rounded-2xl p-6 space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Filtros Visuais</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {FILTERS.map(f => (
                        <button key={f.value} onClick={() => update('filter', f.value)}
                            className={`p-4 rounded-xl transition-all text-center ${draft.filter === f.value ? 'ring-2 ring-primary bg-primary/5' : 'bg-accent/30 hover:bg-accent/50'}`}>
                            <p className="text-sm font-bold">{f.label}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{f.desc}</p>
                            {draft.filter === f.value && <Check className="h-4 w-4 text-primary mx-auto mt-2" />}
                        </button>
                    ))}
                </div>
            </section>

            {/* Live preview */}
            <section className="bg-card border rounded-2xl p-6 space-y-3">
                <h2 className="font-bold text-lg flex items-center gap-2"><Eye className="h-5 w-5 text-primary" /> Pré-visualização ao Vivo</h2>
                <div className="p-6 bg-background rounded-xl border">
                    <p className={`${draft.serifFont ? 'font-serif' : ''}`}
                        style={{ fontSize: `${draft.fontSize}px`, lineHeight: draft.lineHeight }}>
                        {draft.showVerseNumbers && <sup className="text-primary font-bold text-[0.65em] mr-1">1</sup>}
                        O Senhor é meu pastor; nada me faltará.
                        {draft.showVerseNumbers && <sup className="text-primary font-bold text-[0.65em] mr-1 ml-1">2</sup>}
                        Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas.
                        {draft.showVerseNumbers && <sup className="text-primary font-bold text-[0.65em] mr-1 ml-1">3</sup>}
                        Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.
                    </p>
                </div>
            </section>

            {/* Sticky action bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t p-4 flex items-center justify-between z-30">
                <Button variant="ghost" onClick={handleReset} className="gap-2 text-muted-foreground">
                    <RotateCcw className="h-4 w-4" /> Restaurar Padrão
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel} disabled={!hasChanges} className="gap-2 rounded-xl">
                        <X className="h-4 w-4" /> Cancelar
                    </Button>
                    <Button onClick={handleApply} className="gap-2 rounded-xl px-8 shadow-lg shadow-primary/20">
                        {saved ? <><Check className="h-4 w-4" /> Aplicado!</> : <><Check className="h-4 w-4" /> Aplicar Mudanças</>}
                    </Button>
                </div>
            </div>
        </div>
    );
};
