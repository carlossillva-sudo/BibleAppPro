import React from 'react';
import { BookOpen, Heart, Globe, MessageCircle } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';

export const AboutPage: React.FC = () => {
  // Simple About page refactored to use a consistent PageHeader with back
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="container max-w-4xl mx-auto px-6 py-6">
        <PageHeader
          title="Sobre o App"
          subtitle="Informações e detalhes do aplicativo"
          icon={<BookOpen className="h-6 w-6 text-blue-600" />}
          showBack={true}
        />
      </div>

      <div className="container max-w-4xl mx-auto px-6 space-y-12 mt-4">
        <section className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 mb-6">
          <p className="text-muted-foreground leading-relaxed mb-6">
            BibleAppPro é uma plataforma completa de leitura e estudo bíblico em português
            brasileiro, desenvolvida com foco em experiência do usuário, performance e
            funcionalidades avançadas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                icon: BookOpen,
                title: 'Leitor Bíblico',
                desc: 'Navegação por Testamento, Livro, Capítulo e Versículo',
              },
              { icon: Globe, title: 'Traduções', desc: 'Várias traduções e versões' },
              { icon: Heart, title: 'Favoritos', desc: 'Salve versículos' },
              { icon: MessageCircle, title: 'Anotações', desc: 'Editor e tags' },
            ].map((f, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl"
              >
                <f.icon className="h-5 w-5 text-blue-600 mb-1" />
                <strong className="text-sm">{f.title}</strong>
                <span className="text-xs text-muted-foreground">{f.desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-3xl">
          <h3 className="font-bold">Desenvolvedor</h3>
          <p className="text-sm text-muted-foreground">Carlos Eduard</p>
        </section>

        <section className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-3xl">
          <h3 className="font-bold">Contato</h3>
          <p className="text-sm text-muted-foreground">contato@bibleapppro.com</p>
        </section>
      </div>

      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">
          © 2026 BibleAppPro. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
