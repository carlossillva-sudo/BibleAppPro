import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  showBack?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, showBack }) => {
  const navigate = useNavigate();
  return (
    <header className="space-y-3">
      {showBack && (
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-5 w-5" /> Voltar
        </button>
      )}
      <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.25em]">
        {icon}
        {title && <span>{title}</span>}
      </div>
      <h1 className="text-4xl font-black tracking-tighter">{title}</h1>
      {subtitle && <p className="text-base text-muted-foreground font-medium">{subtitle}</p>}
    </header>
  );
};
