import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Button } from '../ui/Button';
import { X, ChevronDown, Check, Columns } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Verse {
  number: string;
  text?: string;
  content?: string;
}

interface ComparePanelProps {
  bookId: string;
  chapterId: string;
  currentVersion: string;
  onClose: () => void;
}

const VERSION_ABBREVIATIONS: Record<string, string> = {
  '1969': 'ARC',
  A21: 'A21',
  AL1628: 'ALMEIDA 1628',
  AL1753: 'ALMEIDA 1753',
  ARA: 'ARA',
  BLT: 'BLT',
  BPT09: 'BPT',
  CAP: 'CAP',
  MZNVI: 'NVI',
  NAA: 'NAA',
  NBV: 'NBV',
  NTLH: 'NTLH',
  NVI23: 'NVI',
  NVI: 'NVI',
  NVT: 'NVT',
  OL: 'OL',
  TB: 'TB',
  VFL: 'VFL',
};

const getVersionDisplayId = (id: string): string => {
  return VERSION_ABBREVIATIONS[id] || id;
};

const MAX_COMPARE = 3;

export const ComparePanel: React.FC<ComparePanelProps> = ({
  bookId,
  chapterId,
  currentVersion,
  onClose,
}) => {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'inline'>('side-by-side');

  const { data: versions } = useQuery<string[]>({
    queryKey: ['bible-versions-compare'],
    queryFn: async () => (await api.get('/bible/versoes')).data,
  });

  useEffect(() => {
    if (versions && versions.length > 0 && selectedVersions.length === 0) {
      const otherVersions = versions.filter((v) => v !== currentVersion);
      setSelectedVersions([currentVersion, otherVersions[0] || currentVersion].slice(0, 2));
    }
  }, [versions, currentVersion]);

  const availableVersions = versions?.filter((v) => v !== currentVersion) || [];

  const toggleVersion = (version: string) => {
    if (selectedVersions.includes(version)) {
      if (selectedVersions.length > 1) {
        setSelectedVersions((prev) => prev.filter((v) => v !== version));
      }
    } else {
      if (selectedVersions.length < MAX_COMPARE) {
        setSelectedVersions((prev) => [...prev, version]);
      }
    }
  };

  const { data: versesData, isLoading } = useQuery<Record<string, Verse[]>>({
    queryKey: ['verses-compare', bookId, chapterId, selectedVersions],
    queryFn: async () => {
      const results: Record<string, Verse[]> = {};
      for (const version of selectedVersions) {
        try {
          const res = await api.get(`/bible/livros/${bookId}/capitulos/${chapterId}/versiculos`, {
            params: { v: version },
          });
          results[version] = res.data;
        } catch (err) {
          console.error(`Error loading version ${version}:`, err);
          results[version] = [];
        }
      }
      return results;
    },
    enabled: selectedVersions.length > 0 && !!bookId && !!chapterId,
  });

  const versionColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 md:p-8 overflow-y-auto">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-6xl bg-card border border-foreground/10 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-foreground/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Columns className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Comparar Versões</h3>
              <p className="text-xs font-medium text-muted-foreground">
                {selectedVersions.length} versão(s) selecionada(s)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted p-1 rounded-xl">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  viewMode === 'side-by-side' ? 'bg-card shadow-sm' : 'text-muted-foreground'
                )}
              >
                Lado a Lado
              </button>
              <button
                onClick={() => setViewMode('inline')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  viewMode === 'inline' ? 'bg-card shadow-sm' : 'text-muted-foreground'
                )}
              >
                Em Linha
              </button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 border-b border-foreground/5 shrink-0 bg-muted/30">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase mr-2">
              Selecionar:
            </span>

            <div className="flex flex-wrap gap-2">
              {availableVersions.slice(0, 10).map((version, idx) => (
                <button
                  key={version}
                  onClick={() => toggleVersion(version)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all',
                    selectedVersions.includes(version)
                      ? `${versionColors[idx % versionColors.length]} text-white border-transparent shadow-lg`
                      : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300'
                  )}
                >
                  {selectedVersions.includes(version) && <Check className="inline h-3 w-3 mr-1" />}
                  {getVersionDisplayId(version)}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="ml-auto rounded-xl text-xs"
            >
              Mais <ChevronDown className={cn('h-3 w-3 ml-1 inline', isOpen && 'rotate-180')} />
            </Button>
          </div>

          {isOpen && (
            <div className="mt-3 p-3 bg-card border border-foreground/10 rounded-xl">
              <div className="flex flex-wrap gap-2">
                {availableVersions.slice(10).map((version, idx) => (
                  <button
                    key={version}
                    onClick={() => toggleVersion(version)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all',
                      selectedVersions.includes(version)
                        ? `${versionColors[(idx + 10) % versionColors.length]} text-white border-transparent`
                        : 'border-slate-200 dark:border-zinc-700 hover:border-slate-300'
                    )}
                  >
                    {selectedVersions.includes(version) && (
                      <Check className="inline h-3 w-3 mr-1" />
                    )}
                    {getVersionDisplayId(version)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-muted-foreground">Carregando...</span>
              </div>
            </div>
          ) : versesData ? (
            viewMode === 'side-by-side' ? (
              <div className="space-y-6">
                {Object.entries(versesData[currentVersion] || []).map(([, v1], idx) => (
                  <div key={v1.number} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        {v1.number}
                      </span>
                      <div className="h-px flex-1 bg-foreground/5" />
                    </div>

                    <div
                      className={cn(
                        'grid gap-2',
                        selectedVersions.length === 2
                          ? 'grid-cols-2'
                          : selectedVersions.length >= 3
                            ? 'grid-cols-3'
                            : 'grid-cols-1'
                      )}
                    >
                      {selectedVersions.map((version, vIdx) => {
                        const verse = versesData[version]?.[idx];
                        return (
                          <div
                            key={version}
                            className={cn(
                              'p-3 rounded-xl border',
                              vIdx === 0
                                ? 'bg-foreground/[0.02] border-foreground/5'
                                : 'bg-muted/30 border-foreground/5'
                            )}
                          >
                            <span
                              className={cn(
                                'text-[9px] font-black uppercase block mb-1',
                                versionColors[vIdx % versionColors.length]
                                  .replace('bg-', 'text-')
                                  .replace('-500', '-600')
                              )}
                            >
                              {getVersionDisplayId(version)}
                            </span>
                            <p className="text-sm font-medium leading-relaxed">
                              {verse?.text || verse?.content || '—'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(versesData[currentVersion] || []).map(([, v1], idx) => (
                  <div
                    key={v1.number}
                    className="p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-black w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
                        {v1.number}
                      </span>
                      <div className="flex gap-1">
                        {selectedVersions.map((version, vIdx) => (
                          <span
                            key={version}
                            className={cn(
                              'text-[10px] font-bold px-2 py-0.5 rounded-full',
                              versionColors[vIdx % versionColors.length],
                              'text-white'
                            )}
                          >
                            {getVersionDisplayId(version)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {selectedVersions.map((version, vIdx) => {
                        const verse = versesData[version]?.[idx];
                        return (
                          <div key={version} className="flex gap-2">
                            <span
                              className={cn(
                                'text-[10px] font-bold w-10 shrink-0 pt-0.5',
                                versionColors[vIdx % versionColors.length]
                                  .replace('bg-', 'text-')
                                  .replace('-500', '-600')
                              )}
                            >
                              {getVersionDisplayId(version)}
                            </span>
                            <p className="text-sm font-medium leading-relaxed text-foreground/90">
                              {verse?.text || verse?.content || '—'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};
