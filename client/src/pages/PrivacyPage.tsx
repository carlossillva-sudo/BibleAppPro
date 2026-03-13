import React from 'react';
import {
  Shield,
  Check,
  ChevronRight,
  Crown,
  Download,
  Trash2,
  Lock,
  Server,
  Calendar,
  AlertCircle,
  User,
  Heart,
  PenLine,
  BarChart3,
  History,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface LGPDSection {
  title: string;
  content: string;
}

export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  const lgpdSections: LGPDSection[] = [
    {
      title: '1. Coleta de Dados',
      content:
        'O BibleAppPro coleta apenas dados essenciais para o funcionamento do app: nome, email e preferências de leitura. Todos os dados são armazenados localmente no seu dispositivo.',
    },
    {
      title: '2. Uso dos Dados',
      content:
        'Seus dados são utilizados exclusivamente para: personalize sua experiência, sincronizar favoritos e anotações, rastrear seu progresso de leitura, e enviar notificações de lembrete (se permitido).',
    },
    {
      title: '3. Armazenamento',
      content:
        'Seus dados são armazenados no navegador (LocalStorage/IndexedDB) e nunca são enviados para nossos servidores. Você tem controle total sobre seus dados.',
    },
    {
      title: '4. Compartilhamento',
      content:
        'O BibleAppPro NÃO compartilha seus dados pessoais com terceiros. Não vendemos ou aluguelamos suas informações.',
    },
    {
      title: '5. Cookies',
      content:
        'O app utiliza apenas cookies técnicos necessários para autenticação e preferências. Não usamos cookies de rastreamento ou propaganda.',
    },
    {
      title: '6. Seus Direitos (LGPD)',
      content:
        'Você tem direito a: confirmação da existência de dados, acesso aos dados, correção de dados incompletos, anonimização, eliminação, portabilidade, e revogação do consentimento.',
    },
    {
      title: '7. Contato',
      content:
        'Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato pelo email: privacidade@bibleapppro.com',
    },
  ];

  const dataTypes = [
    { icon: User, label: 'Dados Pessoais', desc: 'Nome, email (se cadastrado)', status: 'Local' },
    { icon: Heart, label: 'Favoritos', desc: 'Versículos salvos', status: 'Local' },
    { icon: PenLine, label: 'Anotações', desc: 'Suas reflexões e notas', status: 'Local' },
    { icon: History, label: 'Histórico', desc: 'Livros e capítulos lidos', status: 'Local' },
    { icon: Calendar, label: 'Planos', desc: 'Progresso de leitura', status: 'Local' },
    { icon: BarChart3, label: 'Estatísticas', desc: 'XP, nível, conquistas', status: 'Local' },
  ];

  const handleExportData = () => {
    alert('Exportação de dados será implementada em breve!');
  };

  const handleDeleteData = () => {
    if (
      confirm(
        'Tem certeza que deseja excluir todos os seus dados? Esta ação não pode ser desfeita.'
      )
    ) {
      localStorage.clear();
      alert('Todos os dados foram excluídos.');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-zinc-900 pb-20">
      <div className="container max-w-4xl mx-auto px-6 py-6">
        <PageHeader
          title="Privacidade & LGPD"
          subtitle="Seus dados são seus - Transparência total"
          icon={<Shield className="h-6 w-6 text-blue-600" />}
          showBack={true}
        />
      </div>

      <div className="container max-w-4xl mx-auto px-6 space-y-6">
        {/* LGPD Banner */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Lock className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-black">Lei Geral de Proteção de Dados (LGPD)</h2>
                <p className="text-green-100 text-sm">Seus direitos são garantidos</p>
              </div>
            </div>
            <Check className="h-8 w-8 text-green-200" />
          </div>
        </section>

        {/* Assinatura Premium */}
        <section className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-black">BibleAppPro Premium</h2>
                <p className="text-amber-100 text-sm">Desbloqueie todos os recursos</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/premium')}
              className="bg-white text-amber-600 hover:bg-amber-50 font-bold px-6 py-2 rounded-xl"
            >
              Assinar Agora
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="font-bold">R$ 8,90</p>
              <p className="text-amber-100 text-xs">/mês</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="font-bold">Offline</p>
              <p className="text-amber-100 text-xs">Sem internet</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="font-bold">Sem Ads</p>
              <p className="text-amber-100 text-xs">Experiência pura</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="font-bold">Prioridade</p>
              <p className="text-amber-100 text-xs">Suporte</p>
            </div>
          </div>
        </section>

        {/* Seus Dados */}
        <section className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6">
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-600" />
            Dados Armazenados
          </h2>
          <p className="text-muted-foreground mb-4">
            Todos os seus dados são armazenados localmente no seu dispositivo. Não enviamos dados
            para servidores externos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dataTypes.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl"
              >
                <item.icon className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Seus Direitos */}
        <section className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6">
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Seus Direitos (LGPD)
          </h2>
          <div className="space-y-3">
            {[
              'Direito à confirmação e acesso',
              'Direito à correção de dados',
              'Direito à eliminação',
              'Direito à portabilidade',
              'Direito à revogação do consentimento',
            ].map((right, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">{right}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Políticas LGPD */}
        <section className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6">
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-purple-600" />
            Políticas de Privacidade
          </h2>
          <div className="space-y-4">
            {lgpdSections.map((section, idx) => (
              <details key={idx} className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors">
                  <span className="font-bold text-sm">{section.title}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground p-3">{section.content}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Ações de Dados */}
        <section className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6">
          <h2 className="text-xl font-black mb-4 flex items-center gap-2">
            <Download className="h-5 w-5 text-orange-600" />
            Gerenciar Seus Dados
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={handleExportData} className="flex-1 rounded-xl">
              <Download className="h-4 w-4 mr-2" />
              Exportar Meus Dados
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteData}
              className="flex-1 rounded-xl text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Meus Dados
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Estas ações afetam apenas os dados armazenados localmente no seu navegador.
          </p>
        </section>
      </div>

      <div className="text-center py-8 mt-8">
        <p className="text-sm text-muted-foreground">
          © 2026 BibleAppPro. Todos os direitos reservados.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
