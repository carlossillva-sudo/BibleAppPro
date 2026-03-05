import React, { useState } from 'react';
import {
  Download,
  Trash2,
  CheckCircle2,
  Loader2,
  HardDrive,
  Book,
  Wifi,
  WifiOff,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';

interface BibleVersion {
  id: string;
  name: string;
  size: string;
  downloaded: boolean;
  downloading?: boolean;
  progress?: number;
}

const INITIAL_VERSIONS: BibleVersion[] = [
  { id: 'NVI', name: 'Nova Versão Internacional', size: '2.4 MB', downloaded: false },
  { id: 'ARA', name: 'Almeida Revista e Atualizada', size: '2.4 MB', downloaded: false },
  { id: 'NTLH', name: 'Nova Tradução na Linguagem de Hoje', size: '2.3 MB', downloaded: false },
  { id: 'A21', name: 'Almeida Século 21', size: '2.5 MB', downloaded: false },
  { id: 'NAA', name: 'Nova Almeida Atualizada', size: '2.4 MB', downloaded: false },
  { id: 'NBV', name: 'Nova Bíblia Viva', size: '2.4 MB', downloaded: false },
  { id: 'KJV', name: 'King James Version (English)', size: '2.1 MB', downloaded: false },
  { id: 'NVT', name: 'Nova Versão Transformadora', size: '2.5 MB', downloaded: false },
];

export const DownloadsPage: React.FC = () => {
  const [versions, setVersions] = useState<BibleVersion[]>(INITIAL_VERSIONS);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);

  const downloadedCount = versions.filter((v) => v.downloaded).length;
  const totalSize = versions.filter((v) => v.downloaded).length * 2.4;

  const handleDownload = async (id: string) => {
    setDownloadingId(id);

    setVersions((prev) =>
      prev.map((v) => (v.id === id ? { ...v, downloading: true, progress: 0 } : v))
    );

    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setVersions((prev) => prev.map((v) => (v.id === id ? { ...v, progress } : v)));
    }

    setVersions((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, downloaded: true, downloading: false, progress: undefined } : v
      )
    );
    setDownloadingId(null);
  };

  const handleDelete = (id: string) => {
    setVersions((prev) =>
      prev.map((v) => (v.id === id ? { ...v, downloaded: false, progress: undefined } : v))
    );
  };

  const handleDownloadAll = async () => {
    const undownloaded = versions.filter((v) => !v.downloaded);
    for (const version of undownloaded) {
      await handleDownload(version.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full" />

        <div className="container max-w-4xl mx-auto px-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center">
                  <HardDrive className="h-7 w-7 text-blue-600" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800/30">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-[0.15em]">
                    Downloads Offline
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                Sua bíblia <span className="text-blue-600">sem internet</span>
              </h1>

              <p className="text-muted-foreground font-medium max-w-xl">
                Baixe suas versões favoritas da bíblia e leia em qualquer lugar, mesmo sem conexão.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container max-w-4xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                <Book className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-sm font-bold text-muted-foreground">Baixadas</span>
            </div>
            <p className="text-3xl font-black">
              {downloadedCount}{' '}
              <span className="text-lg font-medium text-muted-foreground">
                de {versions.length}
              </span>
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <HardDrive className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-bold text-muted-foreground">Espaço</span>
            </div>
            <p className="text-3xl font-black">
              {totalSize.toFixed(1)}{' '}
              <span className="text-lg font-medium text-muted-foreground">MB</span>
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  offlineMode
                    ? 'bg-emerald-50 dark:bg-emerald-900/20'
                    : 'bg-amber-50 dark:bg-amber-900/20'
                )}
              >
                {offlineMode ? (
                  <WifiOff className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Wifi className="h-5 w-5 text-amber-600" />
                )}
              </div>
              <span className="text-sm font-bold text-muted-foreground">Status</span>
            </div>
            <p
              className={cn(
                'text-2xl font-black',
                offlineMode ? 'text-emerald-600' : 'text-amber-600'
              )}
            >
              {offlineMode ? 'Offline' : 'Online'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {downloadedCount < versions.length && (
          <div className="flex gap-3 mb-6">
            <Button
              onClick={handleDownloadAll}
              disabled={downloadingId !== null}
              className="h-12 px-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700"
            >
              {downloadingId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Baixando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Todas
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setOfflineMode(!offlineMode)}
              className="h-12 px-6 rounded-xl font-bold"
            >
              {offlineMode ? (
                <>
                  <Wifi className="mr-2 h-4 w-4" />
                  Modo Online
                </>
              ) : (
                <>
                  <WifiOff className="mr-2 h-4 w-4" />
                  Modo Offline
                </>
              )}
            </Button>
          </div>
        )}

        {/* Versions List */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-black">Versões Disponíveis</h2>
            <span className="text-sm text-muted-foreground">{downloadedCount} baixadas</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {versions.map((version) => (
              <div
                key={version.id}
                className={cn(
                  'p-4 md:p-5 flex items-center justify-between gap-4 transition-colors',
                  version.downloaded && 'bg-emerald-50/50 dark:bg-emerald-900/10'
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
                      version.downloaded
                        ? 'bg-emerald-100 dark:bg-emerald-900/30'
                        : version.downloading
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-slate-100 dark:bg-zinc-800'
                    )}
                  >
                    {version.downloading ? (
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    ) : version.downloaded ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Book className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm md:text-base">{version.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{version.id}</span>
                      <span>•</span>
                      <span>{version.size}</span>
                      {version.downloaded && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium">Baixado</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {version.downloading && version.progress !== undefined && (
                    <div className="hidden md:flex items-center gap-2 mr-2">
                      <div className="w-24 h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${version.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {version.progress}%
                      </span>
                    </div>
                  )}

                  {version.downloaded ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(version.id)}
                      className="h-10 w-10 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(version.id)}
                      disabled={downloadingId !== null}
                      className="h-10 px-4 rounded-xl font-semibold"
                    >
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Baixar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-800 dark:text-amber-200 text-sm mb-1">
                Dica de uso
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Após baixar as versões da bíblia, você pode ativar o modo offline para economizar
                dados e ler em locais sem conexão. As versões baixadas ficam disponíveis
                instantaneamente.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            © 2026 BibleAppPro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DownloadsPage;
