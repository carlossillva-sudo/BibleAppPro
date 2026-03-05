import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../store/authStore';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-foreground/5 bg-card/50 backdrop-blur-md flex items-center justify-end px-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium hidden md:block">{user?.name || 'Usuário'}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
