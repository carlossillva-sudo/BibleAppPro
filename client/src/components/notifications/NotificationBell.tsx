import React, { useState } from 'react';
import { Bell, BookOpen, Heart, Calendar, X } from 'lucide-react';

const mockNotifications = [
    { id: 1, icon: BookOpen, title: 'Versículo do Dia', desc: '"O Senhor é meu pastor; nada me faltará." — Salmo 23:1', time: 'Agora', unread: true },
    { id: 2, icon: Heart, title: 'Novo Favorito Salvo', desc: 'João 3:16 foi adicionado aos seus favoritos.', time: '2h atrás', unread: true },
    { id: 3, icon: Calendar, title: 'Plano de Leitura', desc: 'Você está 80% do plano "Bíblia em 1 Ano"!', time: 'Ontem', unread: false },
];

export const NotificationBell: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, unread: false })));
    const dismiss = (id: number) => setNotifications(ns => ns.filter(n => n.id !== id));

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-xl hover:bg-accent transition-colors"
            >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute right-0 top-12 w-80 bg-card border rounded-2xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-sm">Notificações</h3>
                            <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">
                                Marcar todas como lidas
                            </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-sm">Nenhuma notificação.</div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-4 flex gap-3 hover:bg-accent/50 transition-colors border-b last:border-b-0 ${n.unread ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className={`p-2 rounded-xl ${n.unread ? 'bg-primary/10' : 'bg-muted'}`}>
                                            <n.icon className={`h-4 w-4 ${n.unread ? 'text-primary' : 'text-muted-foreground'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{n.title}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{n.desc}</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                                        </div>
                                        <button onClick={() => dismiss(n.id)} className="p-1 hover:bg-muted rounded-lg self-start">
                                            <X className="h-3 w-3 text-muted-foreground" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
