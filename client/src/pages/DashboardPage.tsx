import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  Flame,
  Heart,
  Target,
  Handshake as HandsPraying,
  ChevronRight,
  Share2,
  Copy,
  Check,
  Bell,
  X,
  Sparkles,
  Calendar,
  Play,
  Library,
  User,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { usePreferencesStore } from '../store/preferencesStore';
import { useGamificationStore } from '../store/gamificationStore';

interface Notification {
  id: number;
  type: 'verse' | 'favorite' | 'plan' | 'streak';
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'verse',
    title: 'Versículo do Dia',
    desc: '"O Senhor é meu pastor; nada me faltará." — Salmo 23:1',
    time: 'Agora',
    unread: true,
  },
  {
    id: 2,
    type: 'favorite',
    title: 'Novo Favorito Salvo',
    desc: 'João 3:16 foi adicionado aos favoritos.',
    time: '2h atrás',
    unread: true,
  },
  {
    id: 3,
    type: 'plan',
    title: 'Plano de Leitura',
    desc: 'Você está no dia 164 do plano "Bíblia em 1 Ano"!',
    time: 'Ontem',
    unread: false,
  },
  {
    id: 4,
    type: 'streak',
    title: 'Sequência em Alta!',
    desc: 'Você está há 7 dias consecutivos lendo a Bíblia!',
    time: '3 dias atrás',
    unread: false,
  },
];

const DAILY_VERSES = [
  {
    ref: 'Salmo 119:105',
    text: 'Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.',
  },
  {
    ref: 'Jeremias 29:11',
    text: 'Porque eu sei os planos que tenho para vocês, planos de fazê-los prosperar e não de lhes causar dano, planos de dar-lhes esperança e um futuro.',
  },
  { ref: 'Filipenses 4:13', text: 'Tudo posso naquele que me fortalece.' },
  {
    ref: 'Isaías 40:31',
    text: 'Os que esperam no SENHOR renovarão as suas forças; subirão com asas como águias; correrão, e não se cansarão; e andarão, e não se fatigarão.',
  },
  {
    ref: 'João 3:16',
    text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo o que nele crê não pereça, mas tenha a vida eterna.',
  },
  {
    ref: 'Romanos 8:28',
    text: 'E sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, dos que são chamados segundo o seu propósito.',
  },
  {
    ref: 'Provérbios 3:5',
    text: 'Confia no SENHOR de todo o teu coração, e não te apoyes no teu próprio entendimento.',
  },
];

function getDailyVerse() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const lastRead = usePreferencesStore((s) => s.lastRead);
  const {
    xp,
    getCurrentLevel,
    getNextLevel,
    getProgressToNextLevel,
    currentStreak,
    chaptersRead,
    unlockedAchievements,
  } = useGamificationStore();

  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [copiedVerse, setCopiedVerse] = useState(false);

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = getProgressToNextLevel();

  const dailyVerse = getDailyVerse();
  const unreadCount = notifications.filter((n) => n.unread).length;

  const continueBook = lastRead?.bookName || 'Gênesis';
  const continueChapter = lastRead?.chapterId || '1';
  const continueBookId = lastRead?.bookId || '1';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const handleCopyVerse = () => {
    navigator.clipboard.writeText(`"${dailyVerse.text}" — ${dailyVerse.ref}`);
    setCopiedVerse(true);
    setTimeout(() => setCopiedVerse(false), 2000);
  };

  const handleShareVerse = async () => {
    const shareData = {
      title: 'Versículo do Dia - BibleAppPro',
      text: `"${dailyVerse.text}" — ${dailyVerse.ref}\n\nCompartilhado via BibleAppPro`,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyVerse();
        }
      }
    } else {
      handleCopyVerse();
    }
  };

  const markAllRead = () => {
    setNotifications((ns) => ns.map((n) => ({ ...n, unread: false })));
  };

  const dismissNotification = (id: number) => {
    setNotifications((ns) => ns.filter((n) => n.id !== id));
  };

  const openNotification = (notification: Notification) => {
    if (notification.type === 'verse') {
      navigate('/reader/19/23');
    } else if (notification.type === 'favorite') {
      navigate('/favorites');
    } else if (notification.type === 'plan') {
      navigate('/plans');
    }
    setShowNotifications(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'verse':
        return Sparkles;
      case 'favorite':
        return Heart;
      case 'plan':
        return Calendar;
      case 'streak':
        return Flame;
      default:
        return Bell;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 pb-32">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {greeting}
            </p>
            <h1 className="text-2xl md:text-3xl font-black mt-1">{user?.name || 'Leitor'} 👋</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/settings')}
              className="p-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border hover:shadow-md transition-all"
            >
              <User className="h-5 w-5 text-muted-foreground" />
            </button>

            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border hover:shadow-md transition-all"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-14 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border z-50 overflow-hidden">
                  <div className="p-4 border-b dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="font-bold">Notificações</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-blue-600 font-medium hover:underline"
                      >
                        Marcar todas como lidas
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground text-sm">
                        Nenhuma notificação
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const Icon = getNotificationIcon(n.type);
                        return (
                          <div
                            key={n.id}
                            onClick={() => openNotification(n)}
                            className={`p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors border-b dark:border-zinc-800 last:border-b-0 ${n.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                n.type === 'verse'
                                  ? 'bg-yellow-100 text-yellow-600'
                                  : n.type === 'favorite'
                                    ? 'bg-pink-100 text-pink-600'
                                    : n.type === 'plan'
                                      ? 'bg-green-100 text-green-600'
                                      : 'bg-orange-100 text-orange-600'
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate">{n.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                {n.desc}
                              </p>
                              <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                dismissNotification(n.id);
                              }}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg"
                            >
                              <X className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Gamification Progress Bar */}
        <div className="mb-6 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentLevel.icon}</span>
              <div>
                <p className="font-black text-sm">
                  {currentLevel.title}{' '}
                  <span className="text-muted-foreground">Nível {currentLevel.level}</span>
                </p>
                <p className="text-xs text-muted-foreground">{xp} XP</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground">Sequência</p>
                <p className="text-lg font-black text-orange-500">{currentStreak} dias 🔥</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground">Capítulos</p>
                <p className="text-lg font-black text-primary">{chaptersRead}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground">Conquistas</p>
                <p className="text-lg font-black text-yellow-500">
                  {unlockedAchievements.length} 🏆
                </p>
              </div>
            </div>
          </div>
          {nextLevel && (
            <div className="relative">
              <div className="h-3 bg-primary/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {nextLevel.xpRequired - xp} XP para {nextLevel.title} {nextLevel.icon}
              </p>
            </div>
          )}
        </div>

        {/* Daily Verse Card */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/20 rounded-3xl p-6 md:p-8 border border-amber-200/50 dark:border-amber-800/30">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                Versículo do Dia
              </span>
            </div>

            <blockquote className="text-xl md:text-2xl font-serif italic leading-relaxed mb-4 text-amber-900 dark:text-amber-100">
              "{dailyVerse.text}"
            </blockquote>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                — {dailyVerse.ref}
              </span>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyVerse}
                  className="h-9 rounded-xl bg-white/50 border-amber-200 hover:bg-white"
                >
                  {copiedVerse ? (
                    <Check className="h-4 w-4 mr-1.5 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 mr-1.5" />
                  )}
                  {copiedVerse ? 'Copiado!' : 'Copiar'}
                </Button>
                <Button
                  size="sm"
                  onClick={handleShareVerse}
                  className="h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Share2 className="h-4 w-4 mr-1.5" />
                  Compartilhar
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/reader/19/23')}
                  className="h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Play className="h-4 w-4 mr-1.5" />
                  Ler
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Continue Reading */}
        <section className="mb-8">
          <Button
            onClick={() => navigate(`/reader/${continueBookId}/${continueChapter}`)}
            className="w-full h-auto p-6 rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-7 w-7" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-blue-100 uppercase tracking-wider">
                    Continuar lendo
                  </p>
                  <p className="text-lg font-black mt-0.5">
                    {continueBook} {continueChapter}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </Button>
        </section>

        {/* Quick Access Grid */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Acesso Rápido
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: 'Biblioteca',
                icon: Library,
                path: '/library',
                color: 'bg-blue-100 text-blue-600',
                labelColor: 'text-blue-600',
              },
              {
                label: 'Orações',
                icon: HandsPraying,
                path: '/journal',
                color: 'bg-purple-100 text-purple-600',
                labelColor: 'text-purple-600',
              },
              {
                label: 'Favoritos',
                icon: Heart,
                path: '/favorites',
                color: 'bg-pink-100 text-pink-600',
                labelColor: 'text-pink-600',
              },
              {
                label: 'Planos',
                icon: Calendar,
                path: '/plans',
                color: 'bg-green-100 text-green-600',
                labelColor: 'text-green-600',
              },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border hover:shadow-lg hover:border-slate-200 dark:border-zinc-800 transition-all flex flex-col items-center gap-3 group"
              >
                <div
                  className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <span className={`text-sm font-bold ${item.labelColor}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Stats Cards */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Seu Progresso
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Flame, value: '7', label: 'Dias seguidos', color: 'orange' },
              { icon: BookOpen, value: '142', label: 'Capítulos', color: 'blue' },
              { icon: Heart, value: '23', label: 'Favoritos', color: 'pink' },
              { icon: Target, value: '45%', label: 'Plano', color: 'green' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border dark:border-zinc-800"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-${stat.color}-100 text-${stat.color}-600`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reading Plan */}
        <section>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-lg">Bíblia em 1 Ano</p>
                  <p className="text-sm text-muted-foreground">Dia 164 de 365</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => navigate('/plans')} className="rounded-xl">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: '45%' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-right">45% completo</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
