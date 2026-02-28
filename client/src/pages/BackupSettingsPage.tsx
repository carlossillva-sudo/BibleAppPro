import React, { useState } from 'react';
import {
    Cloud, RefreshCw, Download,
    Upload, ShieldCheck, Info,
    AlertCircle, CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { usePreferencesStore } from '../store/preferencesStore';
import { googleDriveService } from '../services/googleDrive.service';
import { cn } from '../utils/cn';

export const BackupSettingsPage: React.FC = () => {
    const { backupStatus, setBackupStatus } = useAuthStore();
    const preferences = usePreferencesStore();
    const [isInitializing, setIsInitializing] = useState(false);
    const [lastAction, setLastAction] = useState<'backup' | 'restore' | null>(null);

    const handleInit = async () => {
        setIsInitializing(true);
        try {
            await googleDriveService.init();
            setBackupStatus({ status: 'idle' });
        } catch (error) {
            setBackupStatus({ status: 'error', error: 'Falha ao inicializar SDK do Google' });
        } finally {
            setIsInitializing(false);
        }
    };

    const handleSync = async () => {
        setBackupStatus({ status: 'syncing' });
        setLastAction('backup');
        try {
            await googleDriveService.authenticate();
            const dataToBackup = {
                preferences: {
                    theme: preferences.theme,
                    fontSize: preferences.fontSize,
                    fontFamily: preferences.fontFamily,
                    lineHeight: preferences.lineHeight,
                    readingWidth: preferences.readingWidth,
                    showVerseNumbers: preferences.showVerseNumbers,
                    boldVerses: preferences.boldVerses,
                    favoritedThemes: preferences.favoritedThemes,
                },
                timestamp: new Date().toISOString()
            };
            await googleDriveService.saveBackup(dataToBackup);
            setBackupStatus({
                status: 'success',
                lastSync: new Date().toLocaleString()
            });
        } catch (error) {
            setBackupStatus({ status: 'error', error: 'Falha ao sincronizar com Google Drive' });
        }
    };

    const handleRestore = async () => {
        if (!confirm('Deseja restaurar os dados da nuvem? Isso substituirá suas configurações atuais.')) return;

        setBackupStatus({ status: 'syncing' });
        setLastAction('restore');
        try {
            await googleDriveService.authenticate();
            const cloudData = await googleDriveService.loadBackup();

            if (cloudData && cloudData.preferences) {
                const p = cloudData.preferences;
                if (p.theme) preferences.setTheme(p.theme);
                if (p.fontSize) preferences.setFontSize(p.fontSize);
                if (p.fontFamily) preferences.setFontFamily(p.fontFamily);
                if (p.lineHeight) preferences.setLineHeight(p.lineHeight);
                if (p.readingWidth) preferences.setReadingWidth(p.readingWidth);
                if (p.showVerseNumbers !== undefined) preferences.setShowVerseNumbers(p.showVerseNumbers);
                if (p.boldVerses !== undefined) preferences.setBoldVerses(p.boldVerses);

                setBackupStatus({
                    status: 'success',
                    lastSync: new Date().toLocaleString()
                });
                alert('Dados restaurados com sucesso!');
            } else {
                setBackupStatus({ status: 'error', error: 'Nenhum backup encontrado no Drive' });
            }
        } catch (error) {
            setBackupStatus({ status: 'error', error: 'Falha ao restaurar dados' });
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 pb-32">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <Cloud className="h-9 w-9 text-blue-600" />
                    <h1 className="text-4xl font-black tracking-tighter">
                        Backup e <span className="text-blue-600">Sincronização</span>
                    </h1>
                </div>
                <p className="text-lg text-muted-foreground font-medium">
                    Mantenha sua jornada bíblica segura em todos os seus dispositivos.
                </p>
            </header>

            <section className={cn(
                "rounded-[32px] p-8 border-2 transition-all duration-500 relative overflow-hidden",
                backupStatus.status === 'success' ? "bg-green-50/50 border-green-100" :
                    backupStatus.status === 'error' ? "bg-red-50/50 border-red-100" :
                        "bg-white border-slate-100 dark:bg-zinc-900 dark:border-zinc-800"
            )}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            {backupStatus.status === 'success' ? (
                                <div className="bg-green-500 text-white p-1 rounded-full"><CheckCircle2 className="h-5 w-5" /></div>
                            ) : backupStatus.status === 'error' ? (
                                <div className="bg-red-500 text-white p-1 rounded-full"><AlertCircle className="h-5 w-5" /></div>
                            ) : (
                                <div className="bg-blue-600 text-white p-1 rounded-full"><Cloud className="h-5 w-5" /></div>
                            )}
                            <h2 className="text-2xl font-black tracking-tight">Status do Backup</h2>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Última Sincronização</p>
                            <p className="text-xl font-black">{backupStatus.lastSync || 'Nunca sincronizado'}</p>
                        </div>

                        {backupStatus.error && (
                            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-bold border border-red-200">
                                Erro: {backupStatus.error}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={handleSync}
                            disabled={backupStatus.status === 'syncing' || isInitializing}
                            className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-2xl gap-3 shadow-xl shadow-blue-500/20"
                        >
                            {backupStatus.status === 'syncing' && lastAction === 'backup' ? (
                                <RefreshCw className="h-5 w-5 animate-spin" />
                            ) : (
                                <Upload className="h-5 w-5" />
                            )}
                            Sincronizar Agora
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleRestore}
                            disabled={backupStatus.status === 'syncing' || isInitializing}
                            className="h-14 px-8 rounded-2xl gap-3 border-2"
                        >
                            {backupStatus.status === 'syncing' && lastAction === 'restore' ? (
                                <RefreshCw className="h-5 w-5 animate-spin" />
                            ) : (
                                <Download className="h-5 w-5" />
                            )}
                            Restaurar da Nuvem
                        </Button>
                    </div>
                </div>

                <Cloud className="absolute -right-8 -bottom-8 h-48 w-48 text-slate-100 dark:text-zinc-800 -rotate-12 pointer-events-none" />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-white dark:bg-zinc-900 border-2 border-slate-100 dark:border-zinc-800 rounded-[32px] p-8 space-y-4 shadow-sm">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-black">Segurança e Privacidade</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        Seus dados são armazenados na pasta oculta do aplicativo (`appDataFolder`) no seu Google Drive. Isso significa que apenas o **BibleAppPro** pode acessar esses arquivos.
                    </p>
                </section>

                <section className="bg-white dark:bg-zinc-900 border-2 border-slate-100 dark:border-zinc-800 rounded-[32px] p-8 space-y-4 shadow-sm">
                    <div className="bg-amber-100 dark:bg-amber-900/30 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                        <RefreshCw className="h-6 w-6 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-black">Sincronização Ativa</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        Em breve, habilitaremos a sincronização automática em segundo plano. Por enquanto, utilize o botão acima para garantir que seus dados estejam seguros.
                    </p>
                </section>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-[24px] p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
                <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-slate-400" />
                    <p className="text-xs font-bold text-slate-500">Precisa inicializar o módulo manualmente?</p>
                </div>
                <Button onClick={handleInit} disabled={isInitializing} className="rounded-xl px-6 h-12 shadow-sm bg-blue-600 hover:bg-blue-700">
                    {isInitializing ? <RefreshCw className="h-5 w-5 animate-spin mr-2" /> : <Cloud className="h-5 w-5 mr-2" />} Inicializar SDK
                </Button>
            </div>
        </div>
    );
};
