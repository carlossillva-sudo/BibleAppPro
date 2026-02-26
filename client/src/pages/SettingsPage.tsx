import React from 'react';
import { User, Crown, Palette, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePreferencesStore } from '../store/preferencesStore';

export const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore(s => s.user);
    const logout = useAuthStore(s => s.logout);
    const { theme, notifications, toggleNotification } = usePreferencesStore();

    const handleLogout = () => { logout(); navigate('/login'); };

    const menuItems = [
        { icon: Palette, label: 'Personalização', desc: `Tema: ${theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Sépia'}`, path: '/personalization' },
        { icon: Crown, label: 'Premium', desc: 'Desbloqueie recursos avançados', path: '/premium' },
    ];

    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
            <header>
                <h1 className="text-4xl font-extrabold tracking-tight">Configurações</h1>
                <p className="text-lg text-muted-foreground mt-2">Gerencie sua conta e preferências.</p>
            </header>

            {/* Profile */}
            <section className="bg-card border rounded-2xl p-6 flex items-center gap-4">
                <div className="bg-primary/20 h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black text-primary">
                    {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold">{user?.name || 'Usuário'}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email || 'email@exemplo.com'}</p>
                </div>
            </section>

            {/* Menu */}
            <section className="bg-card border rounded-2xl overflow-hidden divide-y">
                {menuItems.map(item => (
                    <button key={item.path} onClick={() => navigate(item.path)}
                        className="w-full flex items-center gap-4 p-5 hover:bg-accent/50 transition-colors text-left">
                        <item.icon className="h-5 w-5 text-primary shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold text-sm">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                ))}
            </section>

            {/* Notifications */}
            <section className="bg-card border rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-lg">Notificações</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-xl">
                        <span className="text-sm font-medium">Lembrete de Leitura</span>
                        <button onClick={() => toggleNotification('lembrete')}
                            className={`w-11 h-6 rounded-full transition-colors relative ${notifications.lembrete ? 'bg-primary' : 'bg-muted'}`}>
                            <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow transition-all ${notifications.lembrete ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/30 rounded-xl">
                        <span className="text-sm font-medium">Versículo do Dia</span>
                        <button onClick={() => toggleNotification('versiculo')}
                            className={`w-11 h-6 rounded-full transition-colors relative ${notifications.versiculo ? 'bg-primary' : 'bg-muted'}`}>
                            <div className={`absolute top-1 h-4 w-4 bg-white rounded-full shadow transition-all ${notifications.versiculo ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Logout */}
            <Button variant="destructive" onClick={handleLogout} className="w-full h-12 rounded-xl gap-2">
                <LogOut className="h-5 w-5" /> Sair da Conta
            </Button>
        </div>
    );
};
