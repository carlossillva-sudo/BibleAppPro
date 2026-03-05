import React from 'react';
import { PageHeader } from './PageHeader';
import { Info } from 'lucide-react';

export const TopBar: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => {
  return (
    <div className="w-full">
      <PageHeader
        title={title}
        subtitle={subtitle}
        icon={<Info className="h-6 w-6 text-blue-600" />}
        showBack={false}
      />
    </div>
  );
};

export default TopBar;
