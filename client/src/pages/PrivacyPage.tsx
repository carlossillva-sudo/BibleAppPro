import React from 'react';
import { Shield } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { useTranslation } from 'react-i18next';

export const PrivacyPage: React.FC = () => {
  const { t } = useTranslation();
  const title = t('privacy.title', 'Política de Privacidade');
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 pb-20">
      <div className="container max-w-4xl mx-auto px-6 py-6">
        <PageHeader
          title={title}
          icon={<Shield className="h-6 w-6 text-blue-600" />}
          showBack={true}
        />
      </div>
      <div className="container max-w-4xl mx-auto px-6 space-y-12 mt-4">
        <section className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-3xl">
          <p className="text-sm text-muted-foreground">
            Conteúdo da Política de Privacidade em PT-BR (versão de demonstração).
          </p>
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

export default PrivacyPage;
