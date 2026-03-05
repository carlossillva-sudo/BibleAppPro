import React, { useState } from 'react';
import {
  Trophy,
  Target,
  BookOpen,
  Flame,
  CheckCircle2,
  Lock,
  Star,
  Users,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'reading' | 'memorization' | 'study' | 'community';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  progress: number;
  completed?: boolean;
  locked: boolean;
  daysToComplete?: number;
}

const CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Leitor da Bíblia',
    description: 'Leia todos os 66 livros da Bíblia pelo menos uma vez',
    category: 'reading',
    difficulty: 'hard',
    points: 1000,
    progress: 45,
    completed: false,
    locked: false,
    daysToComplete: 365,
  },
  {
    id: '2',
    title: 'Evangelho em 30 Dias',
    description: 'Leia os 4 evangelhos (Mateus, Marcos, Lucas, João) em 30 dias',
    category: 'reading',
    difficulty: 'medium',
    points: 200,
    progress: 100,
    completed: true,
    locked: false,
  },
  {
    id: '3',
    title: 'Salmos e Provérbios',
    description: 'Leia todos os Salmos e Provérbios',
    category: 'reading',
    difficulty: 'medium',
    points: 300,
    progress: 0,
    completed: false,
    locked: false,
  },
  {
    id: '4',
    title: 'Memorizador de Versículos',
    description: 'Memorize 10 versículos importantes',
    category: 'memorization',
    difficulty: 'medium',
    points: 250,
    progress: 3,
    completed: false,
    locked: false,
  },
  {
    id: '5',
    title: 'Cartão Vermelho',
    description: 'Memorize João 3:16 em português e inglês',
    category: 'memorization',
    difficulty: 'easy',
    points: 50,
    progress: 0,
    locked: true,
  },
  {
    id: '6',
    title: 'Estudo de Guerra Espiritual',
    description: 'Estude Efésios 6 completo e faça anotações',
    category: 'study',
    difficulty: 'medium',
    points: 150,
    progress: 0,
    locked: false,
  },
  {
    id: '7',
    title: 'Evangelizador',
    description: 'Compartilhe a mensagem de Cristo com 3 pessoas',
    category: 'community',
    difficulty: 'hard',
    points: 300,
    progress: 1,
    completed: false,
    locked: false,
  },
  {
    id: '8',
    title: 'Discipulador',
    description: 'Estabeleça um discipleship com alguém',
    category: 'community',
    difficulty: 'hard',
    points: 500,
    progress: 0,
    locked: true,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Trophy },
  { id: 'reading', label: 'Leitura', icon: BookOpen },
  { id: 'memorization', label: 'Memorização', icon: Target },
  { id: 'study', label: 'Estudo', icon: Star },
  { id: 'community', label: 'Comunidade', icon: Users },
];

const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-500/10 text-emerald-600',
  medium: 'bg-amber-500/10 text-amber-600',
  hard: 'bg-red-500/10 text-red-600',
};

export const ChallengesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [challenges] = useState(CHALLENGES);

  const filtered =
    activeCategory === 'all' ? challenges : challenges.filter((c) => c.category === activeCategory);

  const completedCount = challenges.filter((c) => c.completed).length;
  const totalPoints = challenges.reduce((acc, c) => (c.completed ? acc + c.points : acc), 0);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden pb-20">
      <div className="p-4 border-b bg-card/30 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-black">Desafios Bíblicos</h1>
            <p className="text-xs text-muted-foreground">
              {completedCount}/{challenges.length} concluídos
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-primary">{totalPoints}</p>
            <p className="text-[10px] text-muted-foreground font-bold">pontos</p>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'px-3 h-8 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-1',
                activeCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}
            >
              <cat.icon className="h-3 w-3" /> {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.map((challenge) => (
          <div
            key={challenge.id}
            className={cn('bg-card border rounded-2xl p-4', challenge.locked && 'opacity-60')}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-bold',
                    DIFFICULTY_COLORS[challenge.difficulty]
                  )}
                >
                  {challenge.difficulty === 'easy'
                    ? 'Fácil'
                    : challenge.difficulty === 'medium'
                      ? 'Médio'
                      : 'Difícil'}
                </div>
                {challenge.locked && <Lock className="h-3 w-3 text-muted-foreground" />}
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Flame className="h-4 w-4" />
                <span className="font-bold text-sm">{challenge.points}</span>
              </div>
            </div>

            <h3 className="font-bold text-sm mb-1">{challenge.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{challenge.description}</p>

            {!challenge.locked && (
              <>
                <div className="mb-2">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-bold">{challenge.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {challenge.completed ? (
                    <Button size="sm" className="flex-1 h-9 bg-emerald-500" disabled>
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Concluído
                    </Button>
                  ) : challenge.progress > 0 ? (
                    <Button size="sm" className="flex-1 h-9">
                      Continuar <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button size="sm" className="flex-1 h-9" variant="outline">
                      Iniciar <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </>
            )}

            {challenge.locked && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Complete desafios anteriores para desbloquear
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengesPage;
