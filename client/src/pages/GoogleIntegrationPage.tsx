import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Cloud,
  Calendar,
  Loader2,
  Check,
  X,
  Upload,
  Download,
  Trash2,
  Plus,
  ExternalLink,
  Clock,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { googleOAuth } from '../services/googleOAuth.service';
import type { GoogleDriveFile, CalendarEvent } from '../services/googleOAuth.service';

interface GoogleStatus {
  connected: boolean;
  email?: string;
  name?: string;
  picture?: string;
}

export const GoogleIntegrationPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showEventModal, setShowEventModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  const { data: googleStatus, isLoading: statusLoading } = useQuery<GoogleStatus>({
    queryKey: ['google-status'],
    queryFn: async () => {
      const isConnected = googleOAuth.isConnected();
      if (!isConnected) {
        return { connected: false };
      }
      try {
        const userInfo = await googleOAuth.getUserInfo();
        return {
          connected: true,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
        };
      } catch {
        googleOAuth.disconnect();
        return { connected: false };
      }
    },
    retry: false,
  });

  const { data: backupFiles, refetch: refetchBackups } = useQuery<{ files: GoogleDriveFile[] }>({
    queryKey: ['google-backups'],
    queryFn: async () => {
      const files = await googleOAuth.listBackupFiles();
      return { files };
    },
    enabled: !!googleStatus?.connected,
  });

  const { data: calendarEvents, refetch: refetchEvents } = useQuery<{ events: CalendarEvent[] }>({
    queryKey: ['google-events'],
    queryFn: async () => {
      const events = await googleOAuth.listCalendarEvents(5);
      return { events };
    },
    enabled: !!googleStatus?.connected,
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      setError(null);
      await googleOAuth.connect();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-status'] });
      setSuccess('Conta Google conectada com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (err: Error) => {
      setError(err.message || 'Erro ao conectar com Google');
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      googleOAuth.disconnect();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-status'] });
      queryClient.invalidateQueries({ queryKey: ['google-backups'] });
      queryClient.invalidateQueries({ queryKey: ['google-events'] });
    },
  });

  const backupMutation = useMutation({
    mutationFn: async () => {
      const userData = {
        preferences: localStorage.getItem('preferences-storage'),
        highlights: localStorage.getItem('highlights-storage'),
        favorites: localStorage.getItem('favorites-storage'),
        notes: localStorage.getItem('notes-storage'),
        readingPlan: localStorage.getItem('reading-plan-storage'),
        prayers: localStorage.getItem('prayers-storage'),
        exportedAt: new Date().toISOString(),
      };
      const fileName = `bibleapppro-backup-${new Date().toISOString().split('T')[0]}.json`;
      return googleOAuth.uploadToDrive(userData, fileName);
    },
    onSuccess: () => {
      refetchBackups();
      setSuccess('Backup enviado para Google Drive com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (err: Error) => {
      setError(err.message || 'Erro ao fazer backup');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const data = await googleOAuth.downloadFromDrive(fileId);
      return data;
    },
    onSuccess: (data: any) => {
      if (data.preferences) {
        localStorage.setItem('preferences-storage', data.preferences);
      }
      if (data.highlights) {
        localStorage.setItem('highlights-storage', data.highlights);
      }
      if (data.favorites) {
        localStorage.setItem('favorites-storage', data.favorites);
      }
      if (data.notes) {
        localStorage.setItem('notes-storage', data.notes);
      }
      if (data.readingPlan) {
        localStorage.setItem('reading-plan-storage', data.readingPlan);
      }
      if (data.prayers) {
        localStorage.setItem('prayers-storage', data.prayers);
      }
      setSuccess('Backup restaurado com sucesso! Recarregue a página.');
      setTimeout(() => setSuccess(null), 5000);
    },
    onError: (err: Error) => {
      setError(err.message || 'Erro ao restaurar backup');
    },
  });

  const deleteBackupMutation = useMutation({
    mutationFn: async (fileId: string) => {
      await googleOAuth.deleteFromDrive(fileId);
    },
    onSuccess: () => {
      refetchBackups();
      setSuccess('Backup excluído com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (err: Error) => {
      setError(err.message || 'Erro ao excluir backup');
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async () => {
      return googleOAuth.createCalendarEvent({
        title: newEvent.title,
        description: newEvent.description,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        location: newEvent.location,
      });
    },
    onSuccess: () => {
      setShowEventModal(false);
      setNewEvent({ title: '', description: '', startTime: '', endTime: '', location: '' });
      refetchEvents();
      setSuccess('Lembrete criado com sucesso na Google Agenda!');
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (err: Error) => {
      setError(err.message || 'Erro ao criar lembrete');
    },
  });

  const handleExportData = () => {
    const data = {
      preferences: localStorage.getItem('preferences-storage'),
      highlights: localStorage.getItem('highlights-storage'),
      favorites: localStorage.getItem('favorites-storage'),
      notes: localStorage.getItem('notes-storage'),
      readingPlan: localStorage.getItem('reading-plan-storage'),
      prayers: localStorage.getItem('prayers-storage'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bibleapppro-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">Integração Google</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Conecte sua conta Google para backup, agenda e muito mais.
        </p>
      </header>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
          <Check className="h-5 w-5" />
          {success}
        </div>
      )}

      {!googleOAuth.isInitialized() && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Settings className="h-6 w-6 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-amber-800">Configuração Necessária</h2>
              <p className="text-sm text-amber-700 mt-1">
                Para usar a integração com Google, você precisa configurar o Client ID do Google
                Cloud.
              </p>
              <ol className="text-sm text-amber-700 mt-3 list-decimal list-inside space-y-1">
                <li>
                  Acesse o{' '}
                  <a
                    href="https://console.cloud.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold"
                  >
                    Google Cloud Console
                  </a>
                </li>
                <li>Crie um novo projeto ou selecione um existente</li>
                <li>Va em "APIs e Serviços" → "Credenciais"</li>
                <li>Crie um "ID do cliente OAuth" para aplicação web</li>
                <li>Adicione o domínio do app em "Origens JavaScript autorizadas"</li>
                <li>Copie o Client ID e configure no arquivo .env</li>
              </ol>
              <div className="mt-4 p-3 bg-amber-100 rounded-lg">
                <p className="text-sm font-mono text-amber-800">
                  VITE_GOOGLE_CLIENT_ID=seu-client-id-aqui
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="bg-card border rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-red-100 h-14 w-14 rounded-2xl flex items-center justify-center">
              <Cloud className="h-7 w-7 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Conta Google</h2>
              {googleStatus?.connected ? (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-600">
                    Conectada como {googleStatus.email}
                    {googleStatus.picture && (
                      <img
                        src={googleStatus.picture}
                        alt=""
                        className="inline h-5 w-5 rounded-full ml-2"
                      />
                    )}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Não conectada</p>
              )}
            </div>
          </div>
          {googleStatus?.connected ? (
            <Button
              variant="outline"
              onClick={() => disconnectMutation.mutate()}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Desconectar
            </Button>
          ) : (
            <Button
              onClick={() => connectMutation.mutate()}
              disabled={connectMutation.isPending || !googleOAuth.isInitialized()}
            >
              {connectMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Conectar Google
            </Button>
          )}
        </div>
      </section>

      {googleStatus?.connected && (
        <>
          <section className="bg-card border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 h-12 w-12 rounded-xl flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Backup no Google Drive</h2>
                <p className="text-sm text-muted-foreground">
                  Salve seus dados (anotações, favoritos, planos de leitura) na nuvem.
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => backupMutation.mutate()}
                disabled={backupMutation.isPending}
                className="gap-2"
              >
                {backupMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Enviar para Drive
              </Button>
              <Button variant="outline" onClick={handleExportData} className="gap-2">
                <Download className="h-4 w-4" />
                Exportar JSON
              </Button>
            </div>

            {backupFiles?.files && backupFiles.files.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Backups existentes:</h3>
                {backupFiles.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Cloud className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(file.modifiedTime).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => restoreMutation.mutate(file.id)}
                        disabled={restoreMutation.isPending}
                        title="Restaurar"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja excluir este backup?')) {
                            deleteBackupMutation.mutate(file.id);
                          }
                        }}
                        className="text-red-500"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-card border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 h-12 w-12 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Google Agenda</h2>
                  <p className="text-sm text-muted-foreground">
                    Crie lembretes para seus planos de leitura.
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowEventModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Lembrete
              </Button>
            </div>

            {calendarEvents?.events && calendarEvents.events.length > 0 && (
              <div className="space-y-2 mt-4">
                <h3 className="text-sm font-semibold text-muted-foreground">Próximos eventos:</h3>
                {calendarEvents.events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">{event.summary}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.start.dateTime
                            ? new Date(event.start.dateTime).toLocaleString('pt-BR')
                            : event.start.date}
                        </p>
                      </div>
                    </div>
                    <a
                      href={event.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-muted rounded-md transition-colors"
                      title="Abrir na Agenda"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-card border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 h-12 w-12 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Google Docs & Planilhas</h2>
                <p className="text-sm text-muted-foreground">
                  Integre com documentos, planilhas e apresentações.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a
                href="https://docs.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-start px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"
                    fill="#4285F4"
                  />
                </svg>
                Google Docs
              </a>
              <a
                href="https://sheets.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-start px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h6v14H5z"
                    fill="#34A853"
                  />
                  <path d="M11 5h6v14h-6z" fill="#FBBC05" />
                </svg>
                Planilhas
              </a>
              <a
                href="https://slides.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-start px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5z"
                    fill="#4285F4"
                  />
                  <path d="M7 7h10v2H7zM7 11h10v2H7zM7 15h7v2H7z" fill="#FBBC05" />
                </svg>
                Apresentações
              </a>
            </div>
          </section>

          <section className="bg-muted/50 border rounded-2xl p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="#FBBC05" />
              </svg>
              Google Keep
            </h3>
            <p className="text-sm text-muted-foreground">
              O Google Keep API está disponível apenas para contas Google Workspace (corporativas).
              Não é possível integrar com contas pessoais do Google Keep nesta versão.
            </p>
          </section>
        </>
      )}

      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Novo Lembrete</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Ex: Ler Salmos 23"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Input
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Descrição opcional"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Início</label>
                <Input
                  type="datetime-local"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fim</label>
                <Input
                  type="datetime-local"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Local (opcional)</label>
              <Input
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Ex: Meu tempo devocional"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowEventModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={() => createEventMutation.mutate()}
                disabled={
                  createEventMutation.isPending ||
                  !newEvent.title ||
                  !newEvent.startTime ||
                  !newEvent.endTime
                }
                className="flex-1 gap-2"
              >
                {createEventMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Criar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleIntegrationPage;
