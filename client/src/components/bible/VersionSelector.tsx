import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { usePreferencesStore } from '../../store/preferencesStore';
import { cn } from '../../utils/cn';
import {
  Check as CheckIcon,
  ChevronDown as ChevronDownIcon,
  BookCopy as BookCopyIcon,
  Info as InfoIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BibleVersion {
  id: string;
  name: string;
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

export const VersionSelector: React.FC<{ className?: string }> = ({ className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { bibleVersion, setBibleVersion } = usePreferencesStore();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { data: versions, isLoading } = useQuery<BibleVersion[]>({
    queryKey: ['bible-versions'],
    queryFn: async () => (await api.get('/bible/versoes')).data,
  });

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all hover:bg-primary/10 group',
          isOpen && 'bg-primary/5'
        )}
      >
        <div className="bg-primary/20 p-1 rounded-lg group-hover:bg-primary/30 transition-colors">
          <BookCopyIcon className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            Versão
          </span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-black tracking-tight">
              {getVersionDisplayId(bibleVersion)}
            </span>
            <ChevronDownIcon
              className={cn(
                'h-3 w-3 text-muted-foreground transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-64 bg-card border-2 border-slate-100 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
                <InfoIcon className="h-3 w-3" /> Traduções Disponíveis
              </p>
            </div>

            <div className="p-1.5 max-h-[300px] overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="p-3 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-muted/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                versions?.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setBibleVersion(v.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left',
                      bibleVersion === v.id
                        ? 'bg-primary/10 text-primary font-bold shadow-sm'
                        : 'hover:bg-slate-50 dark:hover:bg-zinc-800'
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-black">{getVersionDisplayId(v.id)}</span>
                      <span className="text-[10px] font-medium opacity-60 truncate max-w-[180px]">
                        {v.name}
                      </span>
                    </div>
                    {bibleVersion === v.id && (
                      <div className="bg-primary text-white p-1 rounded-full shadow-lg scale-90">
                        <CheckIcon className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-2 bg-slate-50 dark:bg-zinc-900/50 border-t border-slate-100 dark:border-zinc-800">
              <p className="text-[9px] text-center font-bold text-muted-foreground italic">
                "{getVersionDisplayId(bibleVersion)}" selecionada
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
