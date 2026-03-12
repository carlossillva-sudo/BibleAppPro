import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Calendar,
  Trash2,
  BookOpen,
  Heart,
  X,
  Check,
  Sparkles,
  Clock,
  Save,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { useMeditationStore, type Meditation } from '../store/meditationStore';

const CATEGORIES = [
  { id: 'all', label: 'Tudo', color: 'bg-slate-500' },
  { id: 'fé', label: 'Fé', color: 'bg-blue-500' },
  { id: 'esperança', label: 'Esperança', color: 'bg-green-500' },
  { id: 'amor', label: 'Amor', color: 'bg-pink-500' },
  { id: 'sabedoria', label: 'Sabedoria', color: 'bg-purple-500' },
  { id: 'força', label: 'Força', color: 'bg-orange-500' },
  { id: 'paz', label: 'Paz', color: 'bg-cyan-500' },
  { id: 'gratidão', label: 'Gratidão', color: 'bg-yellow-500' },
];

type ViewMode = 'meditation' | 'reflections' | 'create' | 'edit';

export const ReflectionsPage: React.FC = () => {
  const {
    meditations,
    todayMeditation,
    initializeTodayMeditation,
    markAsRead,
    toggleFavorite,
    addReflection,
    deleteReflection,
    updateReflection,
  } = useMeditationStore();

  const [viewMode, setViewMode] = useState<ViewMode>('meditation');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReflection, setSelectedReflection] = useState<Meditation | null>(null);

  const [newReflection, setNewReflection] = useState({
    title: '',
    content: '',
    category: 'fé' as Meditation['category'],
    verseRef: '',
    verseText: '',
  });

  useEffect(() => {
    initializeTodayMeditation();
  }, []);

  const reflections = meditations.filter((m) => m.id.startsWith('reflection-'));
  const dailyMeditation = todayMeditation;

  const filteredReflections = reflections.filter((r) => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleMarkAsRead = () => {
    if (dailyMeditation) {
      markAsRead(dailyMeditation.id);
    }
  };

  const handleSaveReflection = () => {
    if (newReflection.title && newReflection.content) {
      addReflection({
        ...newReflection,
        date: new Date().toISOString().split('T')[0],
      });
      setNewReflection({ title: '', content: '', category: 'fé', verseRef: '', verseText: '' });
      setViewMode('reflections');
    }
  };

  const handleDeleteReflection = (id: string) => {
    deleteReflection(id);
    setSelectedReflection(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Navigation Tabs */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <div className="flex gap-2 pb-4">
            <button
              onClick={() => setViewMode('meditation')}
              className={cn(
                'px-6 py-3 rounded-xl font-bold text-sm transition-all',
                viewMode === 'meditation'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-slate-100 dark:bg-zinc-800 text-muted-foreground hover:bg-slate-200 dark:hover:bg-zinc-700'
              )}
            >
              <Sparkles className="h-4 w-4 inline mr-2" />
              Meditação Diária
            </button>
            <button
              onClick={() => setViewMode('reflections')}
              className={cn(
                'px-6 py-3 rounded-xl font-bold text-sm transition-all',
                viewMode === 'reflections'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-slate-100 dark:bg-zinc-800 text-muted-foreground hover:bg-slate-200 dark:hover:bg-zinc-700'
              )}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Minhas Reflexões
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-32">
        {/* MEDITATION VIEW */}
        {viewMode === 'meditation' && dailyMeditation && (
          <div className="py-8 space-y-8">
            <header className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  Meditação de Hoje
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                {dailyMeditation.title}
              </h1>
              <div className="flex items-center justify-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(dailyMeditation.date).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {Math.ceil(dailyMeditation.content.length / 200)} min de leitura
                </span>
              </div>
            </header>

            <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/20 rounded-3xl p-8 md:p-12 border border-amber-200/50 dark:border-amber-800/30 shadow-xl">
              <div className="max-w-3xl mx-auto space-y-8">
                <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed text-amber-900 dark:text-amber-100 text-center">
                  "{dailyMeditation.verseText}"
                </blockquote>
                <div className="text-center">
                  <span className="inline-block px-6 py-2 bg-white dark:bg-zinc-800 rounded-full text-sm font-bold text-amber-700 dark:text-amber-300 shadow-sm">
                    — {dailyMeditation.verseRef}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-foreground/10 rounded-3xl p-8 md:p-10 space-y-6">
              <h2 className="text-xl font-black flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Reflexão
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                  {dailyMeditation.content}
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-bold text-white',
                      CATEGORIES.find((c) => c.id === dailyMeditation.category)?.color ||
                        'bg-slate-500'
                    )}
                  >
                    {CATEGORIES.find((c) => c.id === dailyMeditation.category)?.label}
                  </span>
                  {dailyMeditation.read && (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                      <Check className="h-3 w-3" /> Lido
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => toggleFavorite(dailyMeditation.id)}
                    className="rounded-xl"
                  >
                    <Heart
                      className={cn(
                        'h-4 w-4 mr-2',
                        dailyMeditation.favorited && 'fill-red-500 text-red-500'
                      )}
                    />
                    {dailyMeditation.favorited ? 'Favoritado' : 'Favoritar'}
                  </Button>
                  {!dailyMeditation.read && (
                    <Button onClick={handleMarkAsRead} className="rounded-xl">
                      <Check className="h-4 w-4 mr-2" />
                      Marcar como lido
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {meditations
                .filter((m) => m.favorited && !m.id.startsWith('reflection-'))
                .slice(0, 3)
                .map((med) => (
                  <button
                    key={med.id}
                    onClick={() => {
                      const store = useMeditationStore.getState();
                      store.toggleFavorite(med.id);
                    }}
                    className="p-4 bg-card border rounded-2xl text-left hover:border-primary/30 transition-all"
                  >
                    <p className="font-bold text-sm line-clamp-2">{med.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{med.verseRef}</p>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* REFLECTIONS LIST VIEW */}
        {viewMode === 'reflections' && (
          <>
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight">Minhas Reflexões.</h1>
                <p className="text-lg text-muted-foreground font-medium">
                  {reflections.length} reflexão{reflections.length !== 1 ? 'ões' : ''} gravada
                  {reflections.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                onClick={() => setViewMode('create')}
                className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black gap-2 shadow-xl shadow-primary/20"
              >
                <Plus className="h-5 w-5" /> Nova Reflexão
              </Button>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Pesquisar em suas reflexões..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 h-14 bg-card border border-foreground/5 rounded-2xl font-medium focus:ring-2 ring-primary transition-all shadow-sm"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      'px-6 h-14 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border',
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10'
                        : 'bg-card text-muted-foreground border-foreground/5 hover:bg-muted'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReflections.map((r) => (
                <div
                  key={r.id}
                  className="bg-card border border-foreground/5 rounded-[32px] p-8 space-y-6 hover:shadow-2xl transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={cn(
                        'px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm',
                        CATEGORIES.find((c) => c.id === r.category)?.color || 'bg-slate-500'
                      )}
                    >
                      {CATEGORIES.find((c) => c.id === r.category)?.label}
                    </span>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />{' '}
                        {new Date(r.date).toLocaleDateString('pt-BR')}
                      </span>
                      <button
                        onClick={() => toggleFavorite(r.id)}
                        className="p-2 hover:bg-muted rounded-xl transition-colors"
                      >
                        <Heart
                          className={cn('h-4 w-4', r.favorited && 'fill-red-500 text-red-500')}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
                      {r.title}
                    </h3>
                    {r.verseRef && (
                      <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-tighter">
                        <BookOpen className="h-3.5 w-3.5" /> {r.verseRef}
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground leading-relaxed line-clamp-4 font-medium">
                    {r.content}
                  </p>

                  <div className="pt-6 border-t border-foreground/5 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className="text-xs font-black p-0 h-auto hover:bg-transparent text-primary tracking-widest uppercase"
                      onClick={() => {
                        setNewReflection({
                          title: r.title,
                          content: r.content,
                          category: r.category,
                          verseRef: r.verseRef,
                          verseText: r.verseText,
                        });
                        setSelectedReflection(r);
                        setViewMode('edit');
                      }}
                    >
                      Editar →
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-10 w-10 p-0 rounded-xl text-destructive hover:bg-destructive/5"
                      onClick={() => handleDeleteReflection(r.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredReflections.length === 0 && (
              <div className="text-center py-20 bg-card border-2 border-dashed border-foreground/5 rounded-[40px]">
                <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black">Nenhuma reflexão ainda.</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  Comece a registrar suas descobertas bíblicas.
                </p>
                <Button
                  onClick={() => setViewMode('create')}
                  className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black"
                >
                  Criar Primeira Reflexão
                </Button>
              </div>
            )}
          </>
        )}

        {/* CREATE/EDIT VIEW */}
        {(viewMode === 'create' || viewMode === 'edit') && (
          <div className="py-8 space-y-8">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  {viewMode === 'create' ? 'Nova Reflexão' : 'Editar Reflexão'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {viewMode === 'create'
                    ? 'Escreva suas reflexões bíblicas'
                    : 'Atualize sua reflexão'}
                </p>
              </div>
              <Button variant="ghost" onClick={() => setViewMode('reflections')}>
                <X className="h-5 w-5" />
              </Button>
            </header>

            <div className="bg-card border rounded-3xl p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Título</label>
                  <input
                    type="text"
                    value={newReflection.title}
                    onChange={(e) =>
                      setNewReflection((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Título da sua reflexão..."
                    className="w-full h-12 px-4 bg-background border rounded-xl font-medium focus:ring-2 ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Categoria</label>
                  <select
                    value={newReflection.category}
                    onChange={(e) =>
                      setNewReflection((prev) => ({
                        ...prev,
                        category: e.target.value as Meditation['category'],
                      }))
                    }
                    className="w-full h-12 px-4 bg-background border rounded-xl font-medium focus:ring-2 ring-primary"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Referência Bíblica</label>
                  <input
                    type="text"
                    value={newReflection.verseRef}
                    onChange={(e) =>
                      setNewReflection((prev) => ({ ...prev, verseRef: e.target.value }))
                    }
                    placeholder="Ex: João 3:16"
                    className="w-full h-12 px-4 bg-background border rounded-xl font-medium focus:ring-2 ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Versículo</label>
                  <input
                    type="text"
                    value={newReflection.verseText}
                    onChange={(e) =>
                      setNewReflection((prev) => ({ ...prev, verseText: e.target.value }))
                    }
                    placeholder="Texto do versículo..."
                    className="w-full h-12 px-4 bg-background border rounded-xl font-medium focus:ring-2 ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Sua Reflexão</label>
                <textarea
                  value={newReflection.content}
                  onChange={(e) =>
                    setNewReflection((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Escreva suas pensamentos e reflexões..."
                  rows={8}
                  className="w-full p-4 bg-background border rounded-xl font-medium focus:ring-2 ring-primary resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (viewMode === 'edit' && selectedReflection) {
                      updateReflection(selectedReflection.id, newReflection);
                    } else {
                      handleSaveReflection();
                    }
                  }}
                  className="flex-1 h-14 rounded-2xl font-bold"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {viewMode === 'create' ? 'Salvar Reflexão' : 'Atualizar'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setViewMode('reflections')}
                  className="h-14 px-8 rounded-2xl font-bold"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionsPage;
