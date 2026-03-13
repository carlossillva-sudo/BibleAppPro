import React, { useState, useEffect } from 'react';
import { BookOpen, BookMarked, ChevronRight, Layers, RefreshCw, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { bibleClient, BIBLE_VERSIONS, type BibleVersion } from '../services/bibleClient.service';
import { cn } from '../utils/cn';

interface BookInfo {
  number: string;
  name: string;
  chaptersCount: number;
}

export const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedVersion, setSelectedVersion] = useState('ARA');
  const [versions] = useState<BibleVersion[]>(BIBLE_VERSIONS);
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const loadBooks = async (version: string) => {
    setIsLoading(true);
    setIsError(false);
    try {
      console.log('Loading books for version:', version);
      const data = await bibleClient.getBooks(version, true); // force reload
      console.log('Loaded books:', data.length);
      setBooks(data);
    } catch (error) {
      console.error('Error loading books:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks(selectedVersion);
  }, [selectedVersion]);

  const livrosAntigo = books.filter((b) => parseInt(b.number) <= 39);
  const livrosNovo = books.filter((b) => parseInt(b.number) > 39);

  const handleLivroClick = (book: BookInfo) => {
    navigate(`/reader/${book.number}/1?v=${selectedVersion}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-zinc-950 dark:to-zinc-900 pb-20">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <PageHeader
          title="Biblia"
          subtitle="Explore todos os livros da Sagrada Escritura"
          icon={<BookOpen className="h-6 w-6 text-blue-600" />}
          showBack={true}
        />

        {/* Version Selector */}
        <div className="mt-4 mb-6">
          <label className="text-sm font-bold text-muted-foreground mb-2 block">Versão:</label>
          <div className="flex flex-wrap gap-2">
            {versions.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVersion(v.id)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-bold transition-all',
                  selectedVersion === v.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white dark:bg-zinc-800 border hover:bg-muted'
                )}
              >
                {v.name} ({v.id})
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-slate-200 dark:bg-zinc-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Erro ao carregar livros</h3>
            <p className="text-muted-foreground mb-4">
              Verifique se o arquivo XML está disponível.
            </p>
            <Button onClick={() => loadBooks(selectedVersion)} className="gap-2">
              <RefreshCw className="h-4 w-4" /> Tentar novamente
            </Button>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Nenhum livro encontrado</h3>
            <p className="text-muted-foreground mb-4">Tente selecionar outra versão da Biblia.</p>
            <Button onClick={() => loadBooks(selectedVersion)} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" /> Recarregar
            </Button>
          </div>
        ) : (
          <div className="space-y-8 mt-6">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                  <BookMarked className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Antigo Testamento</h2>
                  <p className="text-sm text-muted-foreground">
                    {livrosAntigo.length} livros - De Gênesis a Malaquias
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {livrosAntigo.map((livro, idx) => (
                  <button
                    key={livro.number}
                    onClick={() => handleLivroClick(livro)}
                    className={cn(
                      'group relative p-4 rounded-2xl text-left transition-all hover:scale-[1.02] hover:shadow-lg',
                      'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800',
                      'hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                    )}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-bold text-sm mt-1 line-clamp-2">{livro.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {livro.chaptersCount} caps.
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <Layers className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Novo Testamento</h2>
                  <p className="text-sm text-muted-foreground">
                    {livrosNovo.length} livros - De Mateus a Apocalipse
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {livrosNovo.map((livro, idx) => (
                  <button
                    key={livro.number}
                    onClick={() => handleLivroClick(livro)}
                    className={cn(
                      'group relative p-4 rounded-2xl text-left transition-all hover:scale-[1.02] hover:shadow-lg',
                      'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800',
                      'hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30'
                    )}
                  >
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-bold text-sm mt-1 line-clamp-2">{livro.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {livro.chaptersCount} caps.
                    </p>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        <div className="text-center mt-12 pt-6 border-t border-slate-200 dark:border-zinc-800">
          <p className="text-sm text-muted-foreground">
            - 2026 BibleAppPro - {books.length} livros biblicos
          </p>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
