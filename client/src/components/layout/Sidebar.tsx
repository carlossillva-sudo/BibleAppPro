import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home, BookOpen, Search, CalendarDays, Headphones,
    Sun, MessageSquare, Heart, BarChart3, Trophy,
    Share2, Download, Crown, Bell, Palette,
    Settings, Shield, Info, LogOut,
    Menu, X, Handshake as HandsPraying, Cloud
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavItem {
    icon: any;
    label: string;
    path: string;
    badge?: string;
}

const PRINCIPAL: NavItem[] = [
    { icon: Home, label: 'Início', path: '/dashboard' },
    { icon: BookOpen, label: 'Biblioteca', path: '/library' },
    { icon: Search, label: 'Busca', path: '/search' },
    { icon: CalendarDays, label: 'Planos', path: '/plans' },
    { icon: Headphones, label: 'Áudio', path: '/audio', badge: 'Em breve' },
];

const DEVOTION: NavItem[] = [
    { icon: Sun, label: 'Devocionais', path: '/devotionals', badge: 'Novo' },
    { icon: HandsPraying, label: 'Orações', path: '/journal' },
    { icon: MessageSquare, label: 'Reflexões', path: '/reflections', badge: 'Em breve' },
    { icon: Heart, label: 'Favoritos', path: '/favorites' },
];

const TOOLS: NavItem[] = [
    { icon: BarChart3, label: 'Estatísticas', path: '/stats' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: Trophy, label: 'Desafios Bíblicos', path: '/challenges', badge: 'Em breve' },
    { icon: Share2, label: 'Compartilhar App', path: '/share' },
    { icon: Download, label: 'Downloads Offline', path: '/downloads', badge: 'Em breve' },
];

const SYSTEM: NavItem[] = [
    { icon: Crown, label: 'Premium', path: '/premium' },
    { icon: Bell, label: 'Notificações', path: '/notificacoes' },
    { icon: Palette, label: 'Personalização', path: '/personalization' },
    { icon: Cloud, label: 'Backup e Sincronização', path: '/settings/backup' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
    { icon: Shield, label: 'Privacidade', path: '/privacy', badge: 'Em breve' },
    { icon: Info, label: 'Sobre o App', path: '/about' },
];

export const Sidebar: React.FC = () => {
    const logout = useAuthStore((s) => s.logout);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path: string) => {
        if (path === '/reader') return location.pathname.startsWith('/reader');
        return location.pathname === path;
    };

    const handleNav = (path: string) => {
        const item = [...PRINCIPAL, ...DEVOTION, ...TOOLS, ...SYSTEM].find(i => i.path === path);
        if (item?.badge === 'Em breve') return;

        if (path === '/reader' || path === '/library') {
            navigate('/library');
        } else {
            navigate(path);
        }
        setMobileOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavSection = ({ title, items }: { title: string, items: NavItem[] }) => (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.25em] px-4 pt-6 pb-2">
                {title}
            </p>
            {items.map(item => {
                const active = isActive(item.path);
                return (
                    <button
                        key={item.path}
                        onClick={() => handleNav(item.path)}
                        className={cn(
                            'w-full flex items-center justify-between px-4 py-3 transition-all duration-300 text-[13px] font-bold group relative rounded-2xl mx-1',
                            active
                                ? 'active-nav-item'
                                : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground',
                            item.badge === 'Em breve' && 'opacity-40 cursor-not-allowed'
                        )}
                    >
                        <div className="flex items-center gap-3.5" translate="no">
                            <div className={cn(
                                "p-1.5 rounded-lg transition-all duration-300",
                                active ? "bg-white/20 shadow-inner" : "bg-transparent group-hover:bg-foreground/5"
                            )}>
                                <item.icon className={cn(
                                    "h-4 w-4 shrink-0 transition-colors",
                                    active ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                                )} />
                            </div>
                            <span className="tracking-tight">{item.label}</span>
                        </div>
                        {item.badge && (
                            <span className={cn(
                                "text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider",
                                item.badge === 'Em breve'
                                    ? "bg-muted/50 text-muted-foreground border border-foreground/5"
                                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            )}>
                                {item.badge}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );

    const content = (
        <div className="flex flex-col h-full glass-panel border-r-0">
            {/* Header */}
            <div className="p-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3.5">
                    <div className="bg-gradient-to-br from-primary to-primary/70 p-2.5 rounded-2xl shadow-lg shadow-primary/20 animate-float">
                        <BookOpen className="text-white h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl tracking-tighter leading-none italic">Bible<span className="text-primary not-italic">AppPro</span></span>
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Premium Edition</span>
                    </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="md:hidden p-2 hover:bg-foreground/5 rounded-xl transition-colors">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Navigation Scroll Area */}
            <nav className="flex-1 px-2 overflow-y-auto custom-scrollbar pb-10">
                <NavSection title="Principal" items={PRINCIPAL} />
                <NavSection title="Devoção" items={DEVOTION} />
                <NavSection title="Ferramentas" items={TOOLS} />
                <NavSection title="Sistema" items={SYSTEM} />
            </nav>

            {/* Footer */}
            <div className="p-3 border-t shrink-0">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 w-full rounded-[10px] text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all text-[13px] font-bold group"
                >
                    <LogOut className="h-4.5 w-4.5 shrink-0 group-hover:rotate-12 transition-transform" />
                    <span>Sair da Conta</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Trigger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-40 p-3 bg-white border rounded-2xl shadow-xl hover:bg-gray-50 transition-all scale-95 active:scale-90"
            >
                <Menu className="h-5 w-5 text-[#2563eb]" />
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-300" onClick={() => setMobileOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 w-[280px] z-[60] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:hidden shadow-2xl',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {content}
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-[260px] border-r border-foreground/5 bg-background flex-col h-screen shrink-0 sticky top-0">
                {content}
            </aside>
        </>
    );
};
