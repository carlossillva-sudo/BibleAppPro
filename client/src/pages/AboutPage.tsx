import React from 'react';
import {
  BookOpen,
  Heart,
  Globe,
  MessageCircle,
  Star,
  Zap,
  Cloud,
  BarChart3,
  Trophy,
  Sparkles,
  PenLine,
  Crown,
  Download,
  Calendar,
  Check,
  Github,
  Code,
  Search,
  Share2,
  Settings,
  Bell,
  Moon,
  Handshake,
  Sun,
  BookMarked,
  History,
  Target,
  User,
  Shield,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Leitor Bíblico',
    desc: 'Navegação por testamento, livro, capítulo e versículo',
  },
  { icon: Globe, title: '18 Traduções', desc: 'ARA, NVI, NVT, NTLH, A21, NAA, NBV e mais' },
  { icon: Globe, title: '9 Versões Antigas', desc: 'ARA1628, ARA1753, 1969, TB, VFL, OLB' },
  { icon: Heart, title: 'Favoritos', desc: 'Salve versículos com cores e anotações' },
  { icon: MessageCircle, title: 'Anotações', desc: 'Editor de texto completo com tags coloridas' },
  { icon: Sparkles, title: 'Meditação Diária', desc: '12 reflexões com versículos bíblicos' },
  { icon: PenLine, title: 'Reflexões', desc: 'Diário pessoal de descobertas bíblicas' },
  { icon: Calendar, title: 'Planos de Leitura', desc: 'Bíblia 1 ano, NT 90 dias, personalizado' },
  { icon: Trophy, title: 'Gamificação', desc: 'XP, níveis (1-10), 12 conquistas' },
  {
    icon: BarChart3,
    title: 'Estatísticas',
    desc: 'Sequência, capítulos, progresso por testamento',
  },
  { icon: Download, title: 'Modo Offline', desc: 'Dados salvos localmente com IndexedDB' },
  { icon: Cloud, title: 'Backup', desc: 'Exportar e importar dados em JSON' },
  { icon: Crown, title: 'Premium', desc: 'Recursos exclusivos e planos' },
  { icon: Search, title: 'Busca Avançada', desc: 'Fulltext com filtros por livro' },
  { icon: Share2, title: 'Compartilhar', desc: 'WhatsApp, Telegram, Twitter, Facebook' },
  { icon: Settings, title: 'Personalização', desc: 'Temas, fontes, tamanho do texto' },
  { icon: Bell, title: 'Notificações', desc: 'Lembretes diários e personalizados' },
  { icon: Moon, title: 'Modo Escuro', desc: 'Tema dark automático ou manual' },
  { icon: Handshake, title: 'Orações', desc: 'Caderno de orações com categorias' },
  { icon: Sun, title: 'Devocionais', desc: 'Mensagens diárias edificantes' },
  { icon: BookMarked, title: 'Marcadores', desc: 'Salve posições específicas' },
  { icon: History, title: 'Histórico', desc: 'Rastreie sua jornada de leitura' },
  { icon: Target, title: 'Desafios', desc: 'Desafios bíblicos semanais' },
  { icon: User, title: 'Perfil', desc: 'Dados, estatísticas e configurações' },
  { icon: Shield, title: 'Privacidade', desc: 'Controle seus dados e configurações' },
];

const UPDATES = [
  {
    version: '2.2.0',
    date: 'Março 2026',
    changes: [
      'Sistema completo de meditação diária com 12 reflexões',
      'Gamificação com XP, níveis (1-10) e conquistas',
      'Analytics para rastrear hábitos de leitura',
      'Dados offline com IndexedDB',
      'Compartilhamento social (WhatsApp, Telegram, Twitter)',
      'Página de Reflexões pessoais com CRUD',
      'Barra de progresso de gamificação no Dashboard',
    ],
  },
  {
    version: '2.1.0',
    date: 'Março 2026',
    changes: [
      'Novo layout da tela Biblia com seleção de versão',
      'Carregamento direto do XML (sem API)',
      'Todas as 18 traduções disponíveis',
      'Nomes dos livros em português',
      'Selector de versão no Reader',
      'Comparador de versões',
    ],
  },
  {
    version: '2.0.0',
    date: '2026',
    changes: [
      'Nova interface com Tailwind CSS',
      'Sistema de autenticação (JWT)',
      'Busca fulltext avançada',
      'Caderno de orações com categorias',
      'Devocionais diários',
      'Anotações com editor de texto',
      'Planos de leitura (Bíblia em 1 ano, NT 90 dias)',
    ],
  },
  {
    version: '1.5.0',
    date: '2025',
    changes: [
      'Modo offline para Bíblias',
      'Backup e restauração de dados',
      'Estatísticas de leitura',
      'Sequência de dias (streak)',
      'Personalização (temas, fontes)',
    ],
  },
  {
    version: '1.0.0',
    date: '2024',
    changes: [
      'Primeira versão do app',
      'Leitor bíblico básico',
      'Navegação por livros e capítulos',
      'Favoritos',
      'Histórico de leitura',
    ],
  },
];

export const AboutPage: React.FC = () => {
  const currentVersion = '2.2.0';
  const buildDate = new Date().toLocaleDateString('pt-BR');
  const buildTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-zinc-900 pb-20">
      <div className="container max-w-4xl mx-auto px-6 py-6">
        <PageHeader
          title="Sobre o App"
          subtitle="BibleAppPro - Sua plataforma bíblica"
          icon={<BookOpen className="h-6 w-6 text-blue-600" />}
          showBack={true}
        />
      </div>

      <div className="container max-w-4xl mx-auto px-6 space-y-8">
        {/* Versão e Build */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Versão Atual</p>
              <p className="text-3xl font-black">v{currentVersion}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Build</p>
              <p className="font-bold">{buildDate}</p>
              <p className="text-blue-100 text-sm">{buildTime}</p>
            </div>
          </div>
        </section>

        {/* Recursos */}
        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Recursos do App
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FEATURES.map((f, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start p-4 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl hover:shadow-lg transition-all"
              >
                <f.icon className="h-5 w-5 text-blue-600 mb-2" />
                <strong className="text-sm font-bold">{f.title}</strong>
                <span className="text-xs text-muted-foreground">{f.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Atualizações */}
        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-500" />
            Histórico de Atualizações
          </h2>
          <div className="space-y-4">
            {UPDATES.map((update, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-bold">
                      v{update.version}
                    </span>
                    <span className="text-sm text-muted-foreground">{update.date}</span>
                  </div>
                  {idx === 0 && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full text-xs font-bold">
                      Latest
                    </span>
                  )}
                </div>
                <ul className="space-y-2">
                  {update.changes.map((change, cidx) => (
                    <li key={cidx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Informações do Sistema */}
        <section>
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Code className="h-5 w-5 text-green-500" />
            Informações Técnicas
          </h2>
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frontend</span>
              <span className="font-bold">React 18 + TypeScript + Vite</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estilização</span>
              <span className="font-bold">Tailwind CSS + shadcn/ui</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estado</span>
              <span className="font-bold">Zustand + TanStack Query</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Dados</span>
              <span className="font-bold">XML Local (sem API)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Armazenamento</span>
              <span className="font-bold">IndexedDB + LocalStorage</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Hospedagem</span>
              <span className="font-bold">Cloudflare Pages</span>
            </div>
          </div>
        </section>

        {/* Desenvolvedor */}
        <section className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-2xl">
          <h3 className="font-bold mb-2">Desenvolvedor</h3>
          <p className="text-muted-foreground">Carlos Eduardo - Brasília, DF, Brasil</p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://github.com/carlossillva-sudo/BibleAppPro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </section>
      </div>

      <div className="text-center py-8 mt-8">
        <p className="text-sm text-muted-foreground">
          © 2026 BibleAppPro. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
