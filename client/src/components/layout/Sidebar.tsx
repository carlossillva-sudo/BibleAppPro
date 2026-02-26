import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { Book, Search, Settings, LogOut, LayoutDashboard, Heart, Calendar, PenLine, BarChart3, Crown, Palette, Menu, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Book, label: 'Leitor', path: '/reader' },
        { icon: Calendar, label: 'Planos', path: '/plans' },
        { icon: Search, label: 'Busca', path: '/search' },
        { icon: Heart, label: 'Favoritos', path: '/favorites' },
        { icon: PenLine, label: 'Orações', path: '/journal' },
        { icon: BarChart3, label: 'Estatísticas', path: '/stats' },
    ];

    const systemItems = [
        { icon: Crown, label: 'Premium', path: '/premium' },
        { icon: Palette, label: 'Personalização', path: '/personalization' },
        { icon: SlidersHorizontal, label: 'Ajustes de Leitura', path: '/personalization-advanced' },
        { icon: Settings, label: 'Configurações', path: '/settings' },
    ];

    const handleLogout = () => { logout(); navigate('/login'); };

    const isActive = (path: string) => {
        if (path === '/reader') return location.pathname.startsWith('/reader');
        return location.pathname === path;
    };

    const handleNav = (path: string) => {
        navigate(path === '/reader' ? '/dashboard' : path);
        setMobileOpen(false);
    };

    const SidebarContent = () => (
        <>
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <Book className="text-primary-foreground h-4 w-4" />
                    </div>
                    <h1 className="font-black text-base tracking-tight">Bible<span className="text-primary">App</span></h1>
                </div>
                {/* Close button on mobile */}
                <button onClick={() => setMobileOpen(false)} className="md:hidden p-1 hover:bg-accent rounded-lg">
                    <X className="h-5 w-5" />
                </button>
            </div>

            <nav className="flex-1 px-2.5 overflow-y-auto space-y-0.5">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] px-3 pt-3 pb-1.5">Navegação</p>
                {navItems.map(item => (
                    <button key={item.path} onClick={() => handleNav(item.path)}
                        className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-[13px] font-medium",
                            isActive(item.path)
                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                    </button>
                ))}

                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] px-3 pt-5 pb-1.5">Sistema</p>
                {systemItems.map(item => (
                    <button key={item.path} onClick={() => handleNav(item.path)}
                        className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-[13px] font-medium",
                            isActive(item.path)
                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-2.5 border-t">
                <button onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2 w-full rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all text-[13px] font-medium">
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-3 left-3 z-50 p-2 bg-card border rounded-xl shadow-md hover:bg-accent transition-colors"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Mobile sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 w-[240px] bg-card border-r flex flex-col z-50 transition-transform duration-300 md:hidden",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-[220px] border-r bg-card flex-col h-screen shrink-0">
                <SidebarContent />
            </aside>
        </>
    );
};
