import React, { useState, useEffect, useRef } from 'react';
import {
  Search as SearchIcon,
  BookOpen,
  ArrowRight,
  X,
  Clock,
  Filter,
  TrendingUp,
  Heart,
  Highlighter,
  History,
  Bookmark,
  ChevronDown,
  Sparkles,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { bibleClient } from '../services/bibleClient.service';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { usePreferencesStore } from '../store/preferencesStore';
import { cn } from '../utils/cn';

interface BibleBook {
  number: string;
  name: string;
  chaptersCount: number;
}
interface SearchResult {
  bookNumber: string;
  bookName: string;
  chapterNumber: string;
  verseNumber: string;
  text?: string;
  content?: string;
}

interface ThemeTopic {
  id: string;
  label: string;
  icon?: string | React.ComponentType<any>;
  color?: string;
  keywords: string[];
}

const renderIcon = (icon: string | React.ComponentType<any> | undefined) => {
  if (!icon) return null;
  if (typeof icon === 'string') return <span>{icon}</span>;
  const IconComponent = icon;
  return <IconComponent className="h-5 w-5" />;
};

const BIBLICAL_TOPICS: ThemeTopic[] = [
  {
    id: 'amor',
    label: 'Amor',
    icon: '❤️',
    color: 'bg-pink-200',
    keywords: ['amor', 'amar', 'caridade', 'amor de deus'],
  },
  {
    id: 'fe',
    label: 'Fé',
    icon: '✝️',
    color: 'bg-blue-200',
    keywords: ['fé', 'crer', 'confiança', 'acreditar'],
  },
  {
    id: 'esperanca',
    label: 'Esperança',
    icon: '🌅',
    color: 'bg-yellow-200',
    keywords: ['esperança', 'esperar', 'confiança', 'futuro'],
  },
  {
    id: 'paz',
    label: 'Paz',
    icon: '🕊️',
    color: 'bg-green-200',
    keywords: ['paz', 'tranquilo', 'sereno', 'calma'],
  },
  {
    id: 'salvacao',
    label: 'Salvação',
    icon: '✝️',
    color: 'bg-red-200',
    keywords: ['salvação', 'salvo', 'redenção', 'resgate'],
  },
  {
    id: 'oracao',
    label: 'Oração',
    icon: '🙏',
    color: 'bg-purple-200',
    keywords: ['oração', 'orar', 'rogar', 'petição', 'pedir'],
  },
  {
    id: 'sabedoria',
    label: 'Sabedoria',
    icon: '📖',
    color: 'bg-indigo-200',
    keywords: ['sabedoria', 'sábio', 'entendimento', 'conhecimento'],
  },
  {
    id: 'misericordia',
    label: 'Misericórdia',
    icon: '💝',
    color: 'bg-rose-200',
    keywords: ['misericórdia', 'misericordioso', 'compaixão', 'clemência'],
  },
  {
    id: 'graça',
    label: 'Graça',
    icon: '✨',
    color: 'bg-amber-200',
    keywords: ['graça', 'misericórd', 'favor', 'bondade'],
  },
  {
    id: 'fidelidade',
    label: 'Fidelidade',
    icon: '🤝',
    color: 'bg-teal-200',
    keywords: ['fiel', 'fidelidade', 'leal', 'confiável'],
  },
  {
    id: 'justiça',
    label: 'Justiça',
    icon: '⚖️',
    color: 'bg-slate-200',
    keywords: ['justo', 'justiça', 'direito', 'reto'],
  },
  {
    id: 'humildade',
    label: 'Humildade',
    icon: '🙇',
    color: 'bg-orange-200',
    keywords: ['humilde', 'humildade', 'manso', 'mild'],
  },
  {
    id: 'coragem',
    label: 'Coragem',
    icon: '🦁',
    color: 'bg-red-300',
    keywords: ['corajoso', 'coragem', 'forte', 'valente'],
  },
  { id: 'esperanto', label: 'Esperanto', icon: '🌐', keywords: ['língua', 'idioma'] },
  {
    id: 'cura',
    label: 'Cura',
    icon: '💊',
    color: 'bg-green-300',
    keywords: ['cura', 'curar', 'sarar', 'saúde'],
  },
  {
    id: 'protecao',
    label: 'Proteção',
    icon: '🛡️',
    color: 'bg-blue-300',
    keywords: ['proteger', 'protecção', 'guardar', 'defender'],
  },
  {
    id: 'prosperidade',
    label: 'Prosperidade',
    icon: '💰',
    color: 'bg-yellow-300',
    keywords: ['prosperidade', 'riqueza', 'abundância', 'bendição'],
  },
  {
    id: 'perdao',
    label: 'Perdão',
    icon: '🔄',
    color: 'bg-cyan-200',
    keywords: ['perdoar', 'perdão', 'remissão', 'libertação'],
  },
  {
    id: 'unidade',
    label: 'Unidade',
    icon: '🤝',
    color: 'bg-violet-200',
    keywords: ['unidade', 'unir', 'juntos', 'harmonia'],
  },
  {
    id: 'familia',
    label: 'Família',
    icon: '👨‍👩‍👧',
    color: 'bg-amber-300',
    keywords: ['família', 'filho', 'pai', 'mãe', 'casa'],
  },
  {
    id: 'lideranca',
    label: 'Liderança',
    icon: '👑',
    color: 'bg-purple-300',
    keywords: ['lider', 'liderança', 'governar', 'autoridade'],
  },
  {
    id: 'vinganca',
    label: 'Vingança',
    icon: '⚔️',
    color: 'bg-red-400',
    keywords: ['vingar', 'vingança', 'revanche'],
  },
  {
    id: 'medo',
    label: 'Medo',
    icon: '😨',
    color: 'bg-gray-300',
    keywords: ['medo', 'temer', 'receio', 'pavor'],
  },
  {
    id: 'duvida',
    label: 'Dúvida',
    icon: '❓',
    color: 'bg-slate-300',
    keywords: ['dúvida', 'duvidar', 'incerteza'],
  },
  {
    id: 'angustia',
    label: 'Angústia',
    icon: '😔',
    color: 'bg-blue-200',
    keywords: ['angústia', 'tristeza', 'aflição', 'dor'],
  },
  {
    id: 'alegria',
    label: 'Alegria',
    icon: '😊',
    color: 'bg-yellow-200',
    keywords: ['alegria', 'alegre', 'regozijar', 'feliz'],
  },
  {
    id: 'louvor',
    label: 'Louvor',
    icon: '🎵',
    color: 'bg-orange-200',
    keywords: ['louvor', 'louvar', 'adorar', 'cantar'],
  },
  {
    id: 'fome',
    label: 'Fome',
    icon: '🍞',
    color: 'bg-amber-300',
    keywords: ['fome', 'faminto', 'comer', 'pão'],
  },
  {
    id: 'sed',
    label: 'Sede',
    icon: '💧',
    color: 'bg-blue-100',
    keywords: ['sede', 'sitiado', 'água', 'beber'],
  },
  {
    id: 'luz',
    label: 'Luz',
    icon: '💡',
    color: 'bg-yellow-100',
    keywords: ['luz', 'esclarecer', 'iluminar'],
  },
  {
    id: 'trevas',
    label: 'Trevas',
    icon: '🌑',
    color: 'bg-gray-400',
    keywords: ['treva', 'escuridão', 'sombra'],
  },
  {
    id: 'vida',
    label: 'Vida',
    icon: '🌱',
    color: 'bg-green-200',
    keywords: ['vida', 'viver', 'alma', 'espírito'],
  },
  {
    id: 'morte',
    label: 'Morte',
    icon: '💀',
    color: 'bg-gray-400',
    keywords: ['morte', 'morrer', 'falecer'],
  },
  {
    id: 'diabo',
    label: 'Espírito do Mal',
    icon: '😈',
    color: 'bg-red-500',
    keywords: ['diabo', 'satã', 'mal', 'inimigo'],
  },
  {
    id: 'milagre',
    label: 'Milagre',
    icon: '⭐',
    color: 'bg-yellow-200',
    keywords: ['língua', 'idioma'],
  },
  {
    id: 'cura',
    label: 'Cura',
    icon: '💊',
    color: 'bg-green-300',
    keywords: ['cura', 'curar', 'sarar', 'saúde'],
  },
  {
    id: 'protecao',
    label: 'Proteção',
    icon: '🛡️',
    color: 'bg-blue-300',
    keywords: ['proteger', 'protecção', 'guardar', 'defender'],
  },
  {
    id: 'prosperidade',
    label: 'Prosperidade',
    icon: '💰',
    color: 'bg-yellow-300',
    keywords: ['prosperidade', 'riqueza', 'abundância', 'bendição'],
  },
  {
    id: 'perdao',
    label: 'Perdão',
    icon: '🔄',
    color: 'bg-cyan-200',
    keywords: ['perdoar', 'perdão', 'remissão', 'libertação'],
  },
  {
    id: 'unidade',
    label: 'Unidade',
    icon: '🤝',
    color: 'bg-violet-200',
    keywords: ['unidade', 'unir', 'juntos', 'harmonia'],
  },
  {
    id: 'familia',
    label: 'Família',
    icon: '👨‍👩‍👧',
    color: 'bg-amber-300',
    keywords: ['família', 'filho', 'pai', 'mãe', 'casa'],
  },
  {
    id: 'lideranca',
    label: 'Liderança',
    icon: '👑',
    color: 'bg-purple-300',
    keywords: ['lider', 'liderança', 'governar', 'autoridade'],
  },
  {
    id: 'vinganca',
    label: 'Vingança',
    icon: '⚔️',
    color: 'bg-red-400',
    keywords: ['vingar', 'vingança', 'revanche'],
  },
  {
    id: 'medo',
    label: 'Medo',
    icon: '😨',
    color: 'bg-gray-300',
    keywords: ['medo', 'temer', 'receio', 'pavor'],
  },
  {
    id: 'duvida',
    label: 'Dúvida',
    icon: '❓',
    color: 'bg-slate-300',
    keywords: ['dúvida', 'duvidar', 'incerteza'],
  },
  {
    id: 'angustia',
    label: 'Angústia',
    icon: '😔',
    color: 'bg-blue-200',
    keywords: ['angústia', 'tristeza', 'aflição', 'dor'],
  },
  {
    id: 'alegria',
    label: 'Alegria',
    icon: '😊',
    color: 'bg-yellow-200',
    keywords: ['alegria', 'alegre', 'regozijar', 'feliz'],
  },
  {
    id: 'louvor',
    label: 'Louvor',
    icon: '🎵',
    color: 'bg-orange-200',
    keywords: ['louvor', 'louvar', 'adorar', 'cantar'],
  },
  {
    id: 'fome',
    label: 'Fome',
    icon: '🍞',
    color: 'bg-amber-300',
    keywords: ['fome', 'faminto', 'comer', 'pão'],
  },
  {
    id: 'sed',
    label: 'Sede',
    icon: '💧',
    color: 'bg-blue-100',
    keywords: ['sede', 'sitiado', 'água', 'beber'],
  },
  {
    id: 'luz',
    label: 'Luz',
    icon: '💡',
    color: 'bg-yellow-100',
    keywords: ['luz', 'esclarecer', 'iluminar'],
  },
  {
    id: 'trevas',
    label: 'Trevas',
    icon: '🌑',
    color: 'bg-gray-400',
    keywords: ['treva', 'escuridão', 'sombra'],
  },
  {
    id: 'vida',
    label: 'Vida',
    icon: '🌱',
    color: 'bg-green-200',
    keywords: ['vida', 'viver', 'alma', 'espírito'],
  },
  {
    id: 'morte',
    label: 'Morte',
    icon: '💀',
    color: 'bg-gray-400',
    keywords: ['morte', 'morrer', 'falecer'],
  },
  {
    id: 'diabo',
    label: 'Espírito do Mal',
    icon: '😈',
    color: 'bg-red-500',
    keywords: ['diabo', 'satã', 'mal', 'inimigo'],
  },
  {
    id: 'milagre',
    label: 'Milagre',
    icon: '⭐',
    color: 'bg-yellow-200',
    keywords: ['milagre', 'maravilha', 'sinal'],
  },
];

const RECENT_SEARCHES_KEY = 'recent-searches';
const MAX_RECENT = 8;

const OLD_TESTAMENT = [
  'Gênesis',
  'Êxodo',
  'Levítico',
  'Números',
  'Deuteronômio',
  'Josué',
  'Juízes',
  'Rute',
  '1 Samuel',
  '2 Samuel',
  '1 Reis',
  '2 Reis',
  '1 Crônicas',
  '2 Crônicas',
  'Esdras',
  'Neemias',
  'Ester',
  'Jó',
  'Salmos',
  'Provérbios',
  'Eclesiastes',
  'Cantares',
  'Isaías',
  'Jeremias',
  'Lamentações',
  'Ezequiel',
  'Daniel',
  'Oséias',
  'Joel',
  'Amós',
  'Obadias',
  'Jonas',
  'Miquéias',
  'Naum',
  'Habacuque',
  'Sofonias',
  'Ageu',
  'Zacarias',
  'Malaquias',
];

const NEW_TESTAMENT = [
  'Mateus',
  'Marcos',
  'Lucas',
  'João',
  'Atos',
  'Romanos',
  '1 Coríntios',
  '2 Coríntios',
  'Gálatas',
  'Efésios',
  'Filipenses',
  'Colossenses',
  '1 Tessalonicenses',
  '2 Tessalonicenses',
  '1 Timóteo',
  '2 Timóteo',
  'Tito',
  'Filemom',
  'Hebreus',
  'Tiago',
  '1 Pedro',
  '2 Pedro',
  '1 João',
  '2 João',
  '3 João',
  'Judas',
  'Apocalipse',
];

export const SearchPage: React.FC = () => {
  const { bibleVersion } = usePreferencesStore();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'old' | 'new'>('all');
  const [bookFilter, setBookFilter] = useState<string | null>(null);
  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const [resultsPage, setResultsPage] = useState(1);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const RESULTS_PER_PAGE = 20;
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: books } = useQuery<BibleBook[]>({
    queryKey: ['search-books'],
    queryFn: async () => await bibleClient.getBooks(bibleVersion),
  });

  const autocompleteSuggestions = React.useMemo(() => {
    if (!query || query.length < 2) return { topics: [], books: [] };

    const q = query.toLowerCase();

    const matchedTopics = BIBLICAL_TOPICS.filter(
      (topic) =>
        topic.label.toLowerCase().includes(q) || topic.keywords.some((kw) => kw.includes(q))
    ).slice(0, 6);

    const matchedBooks = books?.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 4) || [];

    return { topics: matchedTopics, books: matchedBooks };
  }, [query, books]);

  useEffect(() => {
    const hasSuggestions =
      autocompleteSuggestions.topics.length > 0 || autocompleteSuggestions.books.length > 0;
    setShowAutocomplete(hasSuggestions && query.length >= 2);
  }, [autocompleteSuggestions, query]);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setResultsPage(1);
  }, [debouncedQuery, testamentFilter, bookFilter]);

  const addToRecent = (search: string) => {
    if (!search.trim()) return;
    const updated = [search, ...recentSearches.filter((s) => s !== search)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const { data: verseResults, isLoading: isSearching } = useQuery({
    queryKey: ['search-verses', debouncedQuery, testamentFilter, bookFilter, bibleVersion],
    queryFn: async () => {
      return await bibleClient.searchContent(debouncedQuery, bibleVersion);
    },
    enabled: debouncedQuery.length >= 2,
  });

  const filteredBooks =
    query.length >= 1 && books
      ? books.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))
      : [];

  const paginatedResults = verseResults?.slice(0, resultsPage * RESULTS_PER_PAGE) || [];
  const hasMoreResults = verseResults && verseResults.length > resultsPage * RESULTS_PER_PAGE;

  const highlightTerm = (text: string, term: string) => {
    if (!term || !text) return text;
    const idx = text.toLowerCase().indexOf(term.toLowerCase());
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + term.length);
    const after = text.slice(idx + term.length);
    return (
      <>
        {before}
        <mark className="bg-yellow-400/30 text-foreground font-semibold rounded px-0.5">
          {match}
        </mark>
        {after}
      </>
    );
  };

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    if (searchTerm.trim()) addToRecent(searchTerm.trim());
  };

  const handleVerseClick = (result: SearchResult) => {
    addToRecent(debouncedQuery);
    navigate(`/reader/${result.bookNumber}/${result.chapterNumber}`);
  };

  const [favoritedSet, setFavoritedSet] = useState<Set<string>>(new Set());
  const [highlightedSet, setHighlightedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      setFavoritedSet(new Set(JSON.parse(localStorage.getItem('favorited-verses') || '[]')));
      setHighlightedSet(new Set(JSON.parse(localStorage.getItem('highlighted-verses') || '[]')));
    } catch {}
  }, []);

  const isFavorite = (result: SearchResult) => {
    const key = `${result.bookNumber}:${result.chapterNumber}:${result.verseNumber}`;
    return favoritedSet.has(key);
  };

  const isHighlighted = (result: SearchResult) => {
    const key = `${result.bookNumber}:${result.chapterNumber}:${result.verseNumber}`;
    return highlightedSet.has(key);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Busca</h1>
        <p className="text-muted-foreground">Encontre passagens, livros e conceitos bíblicos.</p>
      </header>

      <div className="space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              const hasSuggestions =
                autocompleteSuggestions.topics.length > 0 ||
                autocompleteSuggestions.books.length > 0;
              setShowAutocomplete(hasSuggestions && query.length >= 2);
            }}
            onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && debouncedQuery.trim()) {
                addToRecent(debouncedQuery.trim());
              }
            }}
            className="pl-14 pr-24 h-14 md:h-16 text-lg rounded-2xl bg-card border-2 focus-visible:border-primary shadow-sm"
            placeholder="Busque por palavra, livro ou tema..."
            autoFocus
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isSearching && (
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <AnimatePresence>
            {showAutocomplete && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 p-3 bg-card border rounded-2xl shadow-2xl z-50 space-y-3"
              >
                {autocompleteSuggestions.topics.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase px-1">
                      <Lightbulb className="h-3 w-3" />
                      Temas e Assuntos
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {autocompleteSuggestions.topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => handleSearch(topic.label)}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105',
                            topic.color || 'bg-muted',
                            topic.color ? 'text-gray-800' : 'hover:bg-muted/80'
                          )}
                        >
                          {renderIcon(topic.icon)}
                          <span>{topic.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {autocompleteSuggestions.books.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase px-1">
                      <BookOpen className="h-3 w-3" />
                      Livros
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {autocompleteSuggestions.books.map((book) => (
                        <button
                          key={book.number}
                          onClick={() => {
                            addToRecent(book.name);
                            navigate(`/reader/${book.number}/1`);
                          }}
                          className="flex items-center gap-2 p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
                        >
                          <Bookmark className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm font-medium truncate">{book.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn('rounded-xl gap-2')}
          >
            <Filter className="h-4 w-4" />
            Filtros
            {(testamentFilter !== 'all' || bookFilter) && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px]">
                {(testamentFilter !== 'all' ? 1 : 0) + (bookFilter ? 1 : 0)}
              </span>
            )}
          </Button>

          <div className="flex-1" />

          {!query && recentSearches.length > 0 && (
            <button
              onClick={clearRecent}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Limpar histórico
            </button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-visible"
            >
              <div className="p-4 bg-card border rounded-2xl space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Testamento
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all', label: 'Todos' },
                      { value: 'old', label: 'Velho', count: OLD_TESTAMENT.length },
                      { value: 'new', label: 'Novo', count: NEW_TESTAMENT.length },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setTestamentFilter(opt.value as any);
                          setBookFilter(null);
                        }}
                        className={cn(
                          'px-4 py-2 rounded-xl text-sm font-bold transition-all',
                          testamentFilter === opt.value
                            ? 'bg-primary text-white'
                            : 'bg-muted hover:bg-muted/70'
                        )}
                      >
                        {opt.label}
                        {opt.count && <span className="ml-1.5 opacity-60">({opt.count})</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Livro Específico
                  </span>
                  <button
                    onClick={() => setShowBookDropdown(!showBookDropdown)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-muted rounded-xl text-sm font-medium hover:bg-muted/70 transition-colors"
                  >
                    <span>{bookFilter || 'Selecionar livro (opcional)'}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        showBookDropdown && 'rotate-180'
                      )}
                    />
                  </button>
                  {showBookDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-card border rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                      <button
                        onClick={() => {
                          setBookFilter(null);
                          setShowBookDropdown(false);
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          !bookFilter ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                        )}
                      >
                        Todos os livros
                      </button>
                      {(testamentFilter === 'all'
                        ? [...OLD_TESTAMENT, ...NEW_TESTAMENT]
                        : testamentFilter === 'old'
                          ? OLD_TESTAMENT
                          : NEW_TESTAMENT
                      ).map((bookName) => (
                        <button
                          key={bookName}
                          onClick={() => {
                            setBookFilter(bookName);
                            setShowBookDropdown(false);
                          }}
                          className={cn(
                            'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                            bookFilter === bookName
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted'
                          )}
                        >
                          {bookName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        {!query && recentSearches.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
              <History className="h-4 w-4" />
              Buscas Recentes
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(search)}
                  className="px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-full text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {!query && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
              <Zap className="h-4 w-4" />
              Temas Bíblicos
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {BIBLICAL_TOPICS.slice(0, 18).map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleSearch(topic.keywords[0])}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-2xl transition-all hover:scale-105 hover:shadow-lg',
                    topic.color || 'bg-muted',
                    !topic.color && 'hover:bg-muted/80'
                  )}
                >
                  <span className="text-xl">{renderIcon(topic.icon)}</span>
                  <span
                    className={cn(
                      'text-[10px] font-bold',
                      topic.color ? 'text-gray-800' : 'text-foreground'
                    )}
                  >
                    {topic.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase mb-3">
                <TrendingUp className="h-4 w-4" />
                Buscas Populares
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'Amor',
                  'Fé',
                  'Esperança',
                  'Paz',
                  'Salvação',
                  'Oração',
                  'Sabedoria',
                  'Misericórdia',
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20 rounded-xl text-sm font-bold transition-all hover:shadow-md"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {filteredBooks && filteredBooks.length > 0 && query.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
              <BookOpen className="h-4 w-4" />
              Livros
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filteredBooks.slice(0, 8).map((b) => (
                <button
                  key={b.number}
                  onClick={() => {
                    addToRecent(b.name);
                    navigate(`/reader/${b.number}/1`);
                  }}
                  className="p-4 bg-card border rounded-2xl hover:border-primary/40 hover:shadow-md transition-all text-left group"
                >
                  <Bookmark className="h-5 w-5 text-primary mb-2" />
                  <p className="font-bold text-sm line-clamp-1">{highlightTerm(b.name, query)}</p>
                  <p className="text-xs text-muted-foreground">{b.chaptersCount} capítulos</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {debouncedQuery.length >= 2 && verseResults && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                <Sparkles className="h-4 w-4" />
                Resultados da Busca
              </div>
              <span className="text-xs bg-muted px-2 py-1 rounded-full font-medium">
                {verseResults.length} encontrado{verseResults.length !== 1 ? 's' : ''}
              </span>
            </div>

            {verseResults.length === 0 ? (
              <div className="p-10 bg-card border rounded-2xl text-center space-y-2">
                <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground/30" />
                <p className="font-bold text-lg">Nenhum resultado encontrado</p>
                <p className="text-sm text-muted-foreground">
                  Tente palavras mais comuns, ou ajuste os filtros.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedResults.map((v, i) => (
                    <motion.div
                      key={`${v.bookNumber}-${v.chapterNumber}-${v.verseNumber}-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <button
                        onClick={() => handleVerseClick(v)}
                        className="w-full p-4 bg-card border rounded-2xl hover:border-primary/30 hover:shadow-lg transition-all text-left group"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-primary uppercase tracking-wider bg-primary/5 px-2 py-1 rounded-lg">
                              {v.bookName} {v.chapterNumber}:{v.verseNumber}
                            </span>
                            {isFavorite(v) && (
                              <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
                            )}
                            {isHighlighted(v) && (
                              <Highlighter className="h-3.5 w-3.5 text-yellow-500" />
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                        </div>
                        <p className="text-sm leading-relaxed text-foreground/90 line-clamp-3">
                          {highlightTerm(v.content, debouncedQuery)}
                        </p>
                      </button>
                    </motion.div>
                  ))}
                </div>

                {hasMoreResults && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setResultsPage((p) => p + 1)}
                      className="rounded-xl"
                    >
                      Carregar mais ({verseResults.length - paginatedResults.length} restantes)
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {debouncedQuery.length > 0 && debouncedQuery.length < 2 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="font-medium">Digite pelo menos 2 caracteres para buscar...</p>
          </div>
        )}
      </div>
    </div>
  );
};
