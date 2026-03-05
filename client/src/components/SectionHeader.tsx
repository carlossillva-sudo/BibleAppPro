import React from 'react';

interface Props {
  title: string;
  description?: string;
}

export const SectionHeader: React.FC<Props> = ({ title, description }) => (
  <div className="w-full py-4 px-4">
    <h2 className="text-lg font-bold">{title}</h2>
    {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
  </div>
);
