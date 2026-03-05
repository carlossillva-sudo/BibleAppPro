import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
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
} from 'lucide-react';

interface GoogleStatus {
  connected: boolean;
  email?: string;
  name?: string;
  picture?: string;
}

interface BackupFile {
  id: string;
  name: string;
  modifiedTime: string;
}

interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  htmlLink: string;
}

export const GoogleIntegrationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const authSuccess = searchParams.get('success');
  const authError = searchParams.get('error');

  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  const { data: googleStatus, isLoading: statusLoading } = useQuery<GoogleStatus>({
    queryKey: ['google-status'],
    queryFn: async () => (await api.get('/google/status')).data,
    retry: false,
  });

  const { data: backupFiles } = useQuery<{ files: BackupFile[] }>({
    queryKey: ['google-backups'],
    queryFn: async () => (await api.get('/google/backup/list')).data,
    enabled: !!googleStatus?.connected,
  });

  const { data: calendarEvents } = useQuery<{ events: CalendarEvent[] }>({
    queryKey: ['google-events'],
    queryFn: async () => (await api.get('/google/calendar/events?maxResults=5')).data,
    enabled: !!googleStatus?.connected,
  });

  const connectMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.get('/google/auth-url');
      window.location.href = data.authUrl;
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => api.post('/google/disconnect'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['google-status'] }),
  });

  const backupMutation = useMutation({
    mutationFn: async () => {
      const userData = {
        user: { id: user?.id, name: user?.name, email: user?.email },
        preferences: localStorage.getItem('preferences-storage'),
        highlights: localStorage.getItem('highlights-storage'),
        favorites: localStorage.getItem('favorites-storage'),
        notes: localStorage.getItem('notes-storage'),
        readingPlan: localStorage.getItem('reading-plan-storage'),
        prayers: localStorage.getItem('prayers-storage'),
      };
      return (await api.post('/google/backup/drive', { data: userData })).data;
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const { data } = await api.post('/google/backup/restore', { fileId });
      return data;
    },
    onSuccess: (data) => {
      if (data.data.preferences) {
        localStorage.setItem('preferences-storage', data.data.preferences);
      }
      if (data.data.highlights) {
        localStorage.setItem('highlights-storage', data.data.highlights);
      }
      if (data.data.favorites) {
        localStorage.setItem('favorites-storage', data.data.favorites);
      }
      if (data.data.notes) {
        localStorage.setItem('notes-storage', data.data.notes);
      }
      if (data.data.readingPlan) {
        localStorage.setItem('reading-plan-storage', data.data.readingPlan);
      }
      if (data.data.prayers) {
        localStorage.setItem('prayers-storage', data.data.prayers);
      }
      alert('Backup restaurado com sucesso! Recarregue a página para aplicar as alterações.');
    },
  });

  const deleteBackupMutation = useMutation({
    mutationFn: async (fileId: string) => {
      await api.delete(`/google/backup/${fileId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['google-backups'] }),
  });

  const createEventMutation = useMutation({
    mutationFn: async () => {
      return (await api.post('/google/calendar/event', newEvent)).data;
    },
    onSuccess: () => {
      setShowEventModal(false);
      setNewEvent({ title: '', description: '', startTime: '', endTime: '', location: '' });
      queryClient.invalidateQueries({ queryKey: ['google-events'] });
    },
  });

  useEffect(() => {
    if (authSuccess) {
      queryClient.invalidateQueries({ queryKey: ['google-status'] });
    }
  }, [authSuccess]);

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
          Conecte sua conta Google para backup e lembretes.
        </p>
      </header>

      {authError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          Erro ao conectar com Google. Tente novamente.
        </div>
      )}

      {authSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          Conta Google conectada com sucesso!
        </div>
      )}

      {/* Google Account Status */}
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
                  <p className="text-sm text-green-600">Conectada como {googleStatus.email}</p>
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
            <Button onClick={() => connectMutation.mutate()}>Conectar Google</Button>
          )}
        </div>
      </section>

      {googleStatus?.connected && (
        <>
          {/* Backup Section */}
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

            <div className="flex gap-3">
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
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteBackupMutation.mutate(file.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Calendar Section */}
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
                          {new Date(event.start).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <a
                      href={event.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-muted rounded-md transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Google Keep Info */}
      <section className="bg-muted/50 border rounded-2xl p-6">
        <h3 className="font-semibold mb-2">Nota sobre Google Keep</h3>
        <p className="text-sm text-muted-foreground">
          O Google Keep API está disponível apenas para contas Google Workspace (corporativas). Não
          é possível integrar com contas pessoais do Google Keep nesta versão.
        </p>
      </section>

      {/* Event Modal */}
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
