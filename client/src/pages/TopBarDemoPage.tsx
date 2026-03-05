import React from 'react';
import TopBar from '../components/ui/TopBar';

const TopBarDemoPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <TopBar title="Top Bar Demo" />
      <p className="text-sm text-muted-foreground">
        Este é um exemplo de Top Bar sem back, reutilizável em telas de leitura/texto.
      </p>
    </div>
  );
};

export default TopBarDemoPage;
