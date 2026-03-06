import type { ReactNode } from 'react';
import { navigation } from '../data/navigation';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  path: string;
}

export const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <nav>
        {navigation.map((item: NavItem) => (
          <a key={item.path} href={item.path}>
            {item.name}
          </a>
        ))}
      </nav>
      <main>{children}</main>
    </div>
  );
};
