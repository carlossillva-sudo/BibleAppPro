import React from 'react';
import { Palette, Type, Columns, Save, Check, Eye } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { usePreferencesStore, type ThemeMode } from '../store/preferencesStore';

export const PersonalizationPage: React.FC = () => {
    const { theme, fontSize, readingWidth, serifFont, showVerseNumbers, setTheme, setFontSize, setReadingWidth, setSerifFont, setShowVerseNumbers } = usePreferencesStore();
    const [saved, setSaved] = React.useState(false);

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    const themes: { value: ThemeMode; label: string; preview: string }[] = [
        { value: 'light', label: 'Claro', preview: 'bg-white border-2' },
        { value: 'dark', label: 'Escuro', preview: 'bg-gray-900 border-2' },
        { value: 'sepia', label: 'Sépia', preview: 'bg-amber-100 border-2' },
    ];

    const widths: { value: 'narrow' | 'medium' | 'wide'; label: string; icon: string }[] = [
        { value: 'narrow', label: 'Estreito', icon: '▐▌' },
        { value: 'medium', label: 'Médio', icon: '▐ ▌' },
        { value: 'wide', label: 'Largo', icon: '▐   ▌' },
    ];

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-10">
            <header>
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                    <Palette className="h-8 w-8 text-primary" /> Personalização
                </h1>
                <p className="text-lg text-muted-foreground mt-2">Ajuste a aparência para uma leitura confortável.</p>
            </header>

            {/* Theme */}
            <section className="bg-card border rounded-2xl p-6 space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Tema</h2>
                <div className="grid grid-cols-3 gap-4">
                    {themes.map(t => (
                        <button key={t.value} onClick={() => setTheme(t.value)}
                            className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all ${theme === t.value ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}>
                            <div className={`h-12 w-12 rounded-full ${t.preview} ${theme === t.value ? 'border-primary' : 'border-border'}`} />
                            <span className="text-sm font-bold">{t.label}</span>
                            {theme === t.value && <Check className="h-4 w-4 text-primary" />}
                        </button>
                    ))}
                </div>
            </section>

            {/* Font */}
            <section className="bg-card border rounded-2xl p-6 space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2"><Type className="h-5 w-5 text-primary" /> Tipografia</h2>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Tamanho da fonte</span>
                            <span className="font-bold text-primary">{fontSize}px</span>
                        </div>
                        <input type="range" min="14" max="28" value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                            className="w-full accent-primary h-2 rounded-full" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>A</span><span className="text-lg">A</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-accent/30 rounded-xl">
                        <span className="text-sm font-medium">Fonte Serifada (estilo clássico)</span>
                        <button onClick={() => setSerifFont(!serifFont)}
                            className={`w-11 h-6 rounded-full transition-colors relative ${serifFont ? 'bg-primary' : 'bg-muted'}`}>
                            <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow transition-all ${serifFont ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-accent/30 rounded-xl">
                        <span className="text-sm font-medium flex items-center gap-2"><Eye className="h-4 w-4" /> Mostrar números dos versículos</span>
                        <button onClick={() => setShowVerseNumbers(!showVerseNumbers)}
                            className={`w-11 h-6 rounded-full transition-colors relative ${showVerseNumbers ? 'bg-primary' : 'bg-muted'}`}>
                            <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow transition-all ${showVerseNumbers ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-amber-50/50 dark:bg-muted rounded-xl border border-amber-200/30 dark:border-border">
                    <p className="text-xs font-bold text-muted-foreground mb-2">Pré-visualização</p>
                    <p className={`leading-[2] ${serifFont ? 'font-serif' : ''}`} style={{ fontSize: `${fontSize}px` }}>
                        {showVerseNumbers && <sup className="text-primary font-bold text-[0.65em] mr-1">1</sup>}
                        O Senhor é meu pastor; nada me faltará.
                    </p>
                </div>
            </section>

            {/* Reading width */}
            <section className="bg-card border rounded-2xl p-6 space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2"><Columns className="h-5 w-5 text-primary" /> Largura de Leitura</h2>
                <div className="grid grid-cols-3 gap-4">
                    {widths.map(w => (
                        <button key={w.value} onClick={() => setReadingWidth(w.value)}
                            className={`p-4 rounded-xl text-center transition-all ${readingWidth === w.value ? 'ring-2 ring-primary bg-primary/5' : 'bg-accent/30 hover:bg-accent/50'}`}>
                            <p className="font-mono text-lg mb-1">{w.icon}</p>
                            <p className="text-sm font-bold">{w.label}</p>
                        </button>
                    ))}
                </div>
            </section>

            <Button onClick={handleSave} className="w-full h-12 rounded-xl gap-2 text-base font-bold">
                {saved ? <><Check className="h-5 w-5" /> Salvo!</> : <><Save className="h-5 w-5" /> Salvar Preferências</>}
            </Button>
        </div>
    );
};
