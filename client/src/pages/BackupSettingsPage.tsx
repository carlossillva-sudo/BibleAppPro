import React, { useEffect, useState } from 'react';
import { useToast } from '../contexts/ToastProvider';

type ExportResponse = {
  ok: boolean;
  data?: any;
  error?: string;
  backup?: { filename: string; timestamp: number; size?: number };
};

type BackupInfo = { filename: string; timestamp: number; size?: number };
export const BackupSettingsPage: React.FC = () => {
  const [exporting, setExporting] = useState(false);
  const [exportedData, setExportedData] = useState<any | null>(null);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [backupsLoading, setBackupsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const showToast = useToast();

  // Fetch backups history on mount
  useEffect(() => {
    const fetchBackups = async () => {
      if (!token) return;
      try {
        const res = await fetch('/api/user/backups', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json?.backups) setBackups(json.backups);
      } catch {
        // ignore history fetch errors in UI
      } finally {
        setBackupsLoading(false);
      }
    };
    fetchBackups();
    // eslint-disable-next-line
  }, []);

  const handleExport = async () => {
    if (!token) {
      alert('Usuário não autenticado. Faça login.');
      return;
    }
    setExporting(true);
    try {
      const res = await fetch('/api/user/export', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: ExportResponse = await res.json();
      if (data?.ok) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: 'application/json',
        });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'bibleapppro-backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setExportedData(data.data);
        if (data.backup) {
          const bk = data.backup as any;
          setBackups((list) => [bk, ...list]);
        } else {
          // try to refresh history if backup info not returned
          try {
            const res = await fetch('/api/user/backups', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const j = await res.json();
            if (j?.backups) setBackups(j.backups);
          } catch {
            // ignore
          }
        }
        showToast('Backup exportado com sucesso', 'success');
      } else {
        showToast('Falha ao exportar dados', 'error');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao exportar dados');
    } finally {
      setExporting(false);
    }
  };

  const handleRestore = async (filename: string) => {
    if (!token) {
      setRestoreStatus('Usuário não autenticado. Faça login.');
      return;
    }
    setRestoring(filename);
    setRestoreStatus(null);
    try {
      const res = await fetch('/api/user/backups/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ filename }),
      });
      const result = await res.json();
      if (result?.ok) {
        setRestoreStatus('Backup restaurado com sucesso. Dados mesclados com o estado atual.');
      } else {
        setRestoreStatus(result?.error || 'Erro ao restaurar backup');
      }
    } catch (err) {
      console.error(err);
      setRestoreStatus('Erro ao restaurar backup');
    } finally {
      setRestoring(null);
      // refresh local data view if possible by re-exporting current data (optional)
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setSelectedFile(f);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setImportStatus('Nenhum arquivo selecionado');
      return;
    }
    if (!token) {
      setImportStatus('Usuário não autenticado. Faça login.');
      return;
    }
    try {
      const text = await selectedFile.text();
      const payload = JSON.parse(text);
      setImportStatus(null);
      setImporting(true);
      const res = await fetch('/api/user/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result?.ok) {
        setImportStatus('Dados importados com sucesso');
        showToast('Dados importados com sucesso', 'success');
      } else {
        setImportStatus(result?.error || 'Erro na importação');
        showToast(result?.error || 'Erro na importação', 'error');
      }
    } catch (err) {
      console.error(err);
      setImportStatus('Erro na importação');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Backup e Restore de Dados do Usuário</h1>
        <section className="p-4 border rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Exportar dados</h2>
          <p className="text-sm text-gray-600 mb-4">
            Exporta seus favoritos, anotações e configurações para um arquivo JSON.
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Exportando...' : 'Exportar dados'}
          </button>
          {exportedData && (
            <p className="text-sm text-green-700 mt-2">
              Backup disponível para download. Salve em local seguro.
            </p>
          )}
        </section>

        <section className="p-4 border rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Importar dados</h2>
          <p className="text-sm text-gray-600 mb-4">Restaura dados a partir de um backup JSON.</p>
          <input type="file" accept="application/json" onChange={handleFileChange} />
          <div className="mt-3">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleImport}
              disabled={importing}
            >
              {importing ? 'Importando...' : 'Importar dados'}
            </button>
          </div>
          {importStatus && <p className="mt-2 text-sm">{importStatus}</p>}
          {restoreStatus && <p className="mt-2 text-sm text-blue-700">{restoreStatus}</p>}
        </section>
      </div>
      <div className="space-y-4">
        <section className="p-4 border rounded-md shadow-sm h-full">
          <h2 className="text-xl font-semibold mb-2">Backup History</h2>
          {restoreStatus && <p className="text-sm text-blue-700 mt-2">{restoreStatus}</p>}
          {backupsLoading ? (
            <p className="text-sm text-gray-600">Carregando histórico...</p>
          ) : backups.length === 0 ? (
            <p className="text-sm text-gray-600">Nenhum backup ainda.</p>
          ) : (
            <ul className="space-y-2">
              {backups.map((b) => (
                <li
                  key={b.filename}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="font-medium text-sm">
                      {new Date(b.timestamp).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      {b.filename}
                      {b.size ? ` • ${Math.round((b.size ?? 0) / 1024)} KB` : ''}
                    </div>
                  </div>
                  <a
                    href={`/api/user/backups/download/${encodeURIComponent(b.filename)}`}
                    className="text-blue-600 hover:underline"
                    download
                  >
                    Download
                  </a>
                  <button
                    className="ml-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                    onClick={() => handleRestore(b.filename)}
                    disabled={restoring !== null}
                    aria-label={`Restaurar ${b.filename}`}
                  >
                    Restaurar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default BackupSettingsPage;
