import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    backupStatus: {
        lastSync: string | null;
        status: 'idle' | 'syncing' | 'error' | 'success';
        error?: string;
    };
    setAuth: (user: User, token: string) => void;
    setBackupStatus: (status: Partial<AuthState['backupStatus']>) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            backupStatus: {
                lastSync: null,
                status: 'idle',
            },
            setAuth: (user, token) => {
                localStorage.setItem('token', token);
                set({ user, token, isAuthenticated: true });
            },
            setBackupStatus: (status) => {
                set((state) => ({
                    backupStatus: { ...state.backupStatus, ...status }
                }));
            },
            logout: () => {
                localStorage.removeItem('token');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    backupStatus: { lastSync: null, status: 'idle' }
                });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
