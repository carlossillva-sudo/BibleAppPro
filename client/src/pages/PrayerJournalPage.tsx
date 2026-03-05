import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  Heart,
  Briefcase,
  Users,
  Activity,
  CheckCircle2,
  X,
  Save,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { cn } from '../utils/cn';

interface Prayer {
  id: string;
  title: string;
  text: string;
  category: string;
  date: string;
  answered: boolean;
  answeredDate?: string;
  answerNote?: string;
  daysCount: number;
}

const CATEGORIES = [
  {
    id: 'espiritual',
    label: 'Espiritual',
    icon: Sparkles,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    id: 'profissional',
    label: 'Profissional',
    icon: Briefcase,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  { id: 'familia', label: 'Família', icon: Users, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  {
    id: 'saude',
    label: 'Saúde',
    icon: Activity,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 'intercessao',
    label: 'Intercessão',
    icon: Heart,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
];

const PRAYER_TEMPLATES = [
  { title: 'Sabedoria', text: 'Senhor, peço sabedoria para...' },
  { title: 'Proteção', text: 'Senhor, proteja-me e minha família de...' },
  { title: 'Saúde', text: 'Pai, abençoe minha saúde e a dos meus...' },
  { title: 'Prosperidade', text: 'Senhor, abençoe meu trabalho e minhas finanças...' },
  { title: 'Família', text: 'Pai, fortalece minha família...' },
  { title: 'Paz', text: 'Senhor, derrama Tua paz sobre...' },
];

export const PrayerJournalPage: React.FC = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([
    {
      id: '1',
      title: 'Sabedoria no Trabalho',
      text: 'Senhor, me dê clareza para tomar as melhores decisões no novo projeto. Que eu possa ser luz na minha equipe e usar os talentos que me deste para glorificar-Te.',
      category: 'profissional',
      date: '2026-02-25',
      answered: false,
      daysCount: 5,
    },
    {
      id: '2',
      title: 'Saúde da minha mãe',
      text: 'Pai, restaura as forças da minha mãe. Que os exames tragam boas notícias e que ela sinta o Teu amor e cuidado neste momento.',
      category: 'saude',
      date: '2026-02-20',
      answered: true,
      answeredDate: '2026-02-27',
      answerNote: 'Os exames vieram bons! Obrigado, SENHOR!',
      daysCount: 7,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState<string | null>(null);
  const [answerNote, setAnswerNote] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState('espiritual');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAnswered] = useState(true);

  const [confirm, setConfirm] = useState<{ open: boolean; id: string | null; title: string }>({
    open: false,
    id: null,
    title: '',
  });

  const addPrayer = () => {
    if (!newTitle.trim() || !newText.trim()) return;
    const prayer: Prayer = {
      id: Date.now().toString(),
      title: newTitle,
      text: newText,
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      answered: false,
      daysCount: 0,
    };
    setPrayers([prayer, ...prayers]);
    resetForm();
  };

  const resetForm = () => {
    setNewTitle('');
    setNewText('');
    setNewCategory('espiritual');
    setShowForm(false);
  };

  const selectTemplate = (template: (typeof PRAYER_TEMPLATES)[0]) => {
    setNewTitle(template.title);
    setNewText(template.text);
  };

  const toggleAnswered = (id: string) => {
    const prayer = prayers.find((p) => p.id === id);
    if (prayer && !prayer.answered) {
      setShowAnswerForm(id);
    } else {
      setPrayers((ps) =>
        ps.map((p) =>
          p.id === id
            ? { ...p, answered: false, answerNote: undefined, answeredDate: undefined }
            : p
        )
      );
    }
  };

  const markAsAnswered = () => {
    if (showAnswerForm) {
      setPrayers((ps) =>
        ps.map((p) =>
          p.id === showAnswerForm
            ? {
                ...p,
                answered: true,
                answeredDate: new Date().toISOString().split('T')[0],
                answerNote: answerNote || 'Oração respondida!',
              }
            : p
        )
      );
      setShowAnswerForm(null);
      setAnswerNote('');
    }
  };

  const handleDelete = () => {
    if (confirm.id) {
      setPrayers((ps) => ps.filter((p) => p.id !== confirm.id));
      setConfirm({ open: false, id: null, title: '' });
    }
  };

  const filtered = prayers.filter((p) => {
    const categoryMatch = activeFilter === 'all' || p.category === activeFilter;
    const answeredMatch = showAnswered || !p.answered;
    return categoryMatch && answeredMatch;
  });

  const totalPrayers = prayers.length;
  const answeredPrayers = prayers.filter((p) => p.answered).length;
  const pendingPrayers = prayers.filter((p) => !p.answered).length;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden pb-20">
      <div className="p-4 border-b bg-card/30 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black">Caderno de Orações</h1>
            <p className="text-xs text-muted-foreground">{pendingPrayers} orações em andamento</p>
          </div>
          <Button onClick={() => setShowForm(true)} size="sm" className="rounded-xl h-9">
            <Plus className="h-4 w-4 mr-1" /> Nova
          </Button>
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={cn(
              'px-3 h-8 rounded-lg text-xs font-bold whitespace-nowrap',
              activeFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={cn(
                'px-3 h-8 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1',
                activeFilter === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}
            >
              <cat.icon className="h-3 w-3" /> {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/50 p-2 rounded-lg text-center">
            <p className="text-lg font-black">{totalPrayers}</p>
            <p className="text-[10px] text-muted-foreground font-bold">Total</p>
          </div>
          <div className="bg-emerald-500/10 p-2 rounded-lg text-center">
            <p className="text-lg font-black text-emerald-600">{answeredPrayers}</p>
            <p className="text-[10px] text-emerald-600 font-bold">Respondidas</p>
          </div>
          <div className="bg-amber-500/10 p-2 rounded-lg text-center">
            <p className="text-lg font-black text-amber-600">{pendingPrayers}</p>
            <p className="text-[10px] text-amber-600 font-bold">Esperando</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma oração encontrada</p>
          </div>
        ) : (
          filtered.map((p) => {
            const cat = CATEGORIES.find((c) => c.id === p.category) || CATEGORIES[0];
            return (
              <div
                key={p.id}
                className={cn(
                  'bg-card border rounded-2xl p-3',
                  p.answered && 'border-emerald-200 dark:border-emerald-800'
                )}
              >
                <div className="flex items-start gap-2 mb-2">
                  <div
                    className={cn(
                      'px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold',
                      cat.bg,
                      cat.color
                    )}
                  >
                    <cat.icon className="h-2.5 w-2.5" />
                  </div>
                  <span className="text-[10px] text-muted-foreground flex-1">{p.date}</span>
                  {p.answered && (
                    <span className="text-[10px] font-bold text-emerald-600">✓ Respondida</span>
                  )}
                </div>

                <h3 className="font-bold text-sm mb-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{p.text}</p>

                {p.answered && p.answerNote && (
                  <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                    <p className="text-[10px] font-bold text-emerald-600 mb-0.5">Resposta:</p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 italic">
                      {p.answerNote}
                    </p>
                  </div>
                )}

                <div className="flex gap-1 mt-2">
                  <Button
                    onClick={() => toggleAnswered(p.id)}
                    size="sm"
                    variant={p.answered ? 'outline' : 'primary'}
                    className={cn(
                      'h-8 flex-1 rounded-lg text-xs',
                      p.answered && 'border-emerald-500 text-emerald-600'
                    )}
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />{' '}
                    {p.answered ? 'Desfazer' : 'Marcar Respondida'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setConfirm({ open: true, id: p.id, title: p.title })}
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
          onClick={resetForm}
        >
          <div
            className="bg-background w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-black text-lg">Nova Oração</h2>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  快速模板
                </label>
                <div className="flex gap-1 mt-1 overflow-x-auto pb-1">
                  {PRAYER_TEMPLATES.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => selectTemplate(t)}
                      className="px-2 py-1 bg-muted rounded-lg text-[10px] font-medium whitespace-nowrap"
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Título da oração"
                className="h-10 rounded-xl"
              />

              <div className="flex gap-1 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setNewCategory(cat.id)}
                    className={cn(
                      'px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1',
                      newCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    <cat.icon className="h-3 w-3" /> {cat.label}
                  </button>
                ))}
              </div>

              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Escreva sua oração..."
                className="w-full h-24 p-3 rounded-xl bg-muted border-0 resize-none text-sm"
              />

              <div className="flex gap-2">
                <Button onClick={resetForm} variant="outline" className="flex-1 h-10 rounded-xl">
                  Cancelar
                </Button>
                <Button onClick={addPrayer} className="flex-1 h-10 rounded-xl">
                  <Save className="h-4 w-4 mr-1" /> Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAnswerForm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
          onClick={() => {
            setShowAnswerForm(null);
            setAnswerNote('');
          }}
        >
          <div
            className="bg-background w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-black text-lg">Marcar como respondida</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowAnswerForm(null);
                  setAnswerNote('');
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Como Deus respondeu sua oração?</p>
            <textarea
              value={answerNote}
              onChange={(e) => setAnswerNote(e.target.value)}
              placeholder="Registre como o SENHOR respondeu..."
              className="w-full h-20 p-3 rounded-xl bg-muted border-0 resize-none text-sm mb-3"
            />
            <Button
              onClick={markAsAnswered}
              className="w-full h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" /> Confirmar Resposta
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm.open}
        title="Remover Oração?"
        description="Este registro será removido permanentemente."
        itemName={confirm.title}
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null, title: '' })}
      />
    </div>
  );
};

export default PrayerJournalPage;
