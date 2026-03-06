import type { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
}

export const PageShell = ({ children }: PageShellProps) => {
  return <>{children}</>;
};
