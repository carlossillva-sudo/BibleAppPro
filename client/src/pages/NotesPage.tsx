import React, { useState } from 'react';
import {
  Plus,
  Search,
  BookOpen,
  Trash2,
  Edit2,
  X,
  Save,
  StickyNote,
  Pin,
  Star,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../utils/cn';

interface Note {
  id: string;
  title: string;
  content: string;
  verse?: string;
  tags: string[];
  color: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  favorite: boolean;
}

const COLORS = [
  'bg-yellow-100 border-yellow-200',
  'bg-blue-100 border-blue-200',
  'bg-green-100 border-green-200',
  'bg-pink-100 border-pink-200',
  'bg-purple-100 border-purple-200',
  'bg-orange-100 border-orange-200',
];

const TAGS_PREDEFINED = [
  { id: 'estudo', label: 'Estudo', color: 'bg-blue-500' },
  { id: 'sermao', label: 'Sermão', color: 'bg-purple-500' },
  { id: 'devocional', label: 'Devocional', color: 'bg-green-500' },
  { id: 'pregacao', label: 'Pregação', color: 'bg-orange-500' },
  { id: 'personal', label: 'Pessoal', color: 'bg-pink-500' },
];

const NOTES: Note[] = [
  {
    id: '1',
    title: 'Notas do Sermão de Domingo',
    content: 'Pontos importantes sobre amor e fé...',
    verse: '1 Coríntios 13',
    tags: ['sermao', 'estudo'],
    color: 'bg-blue-100 border-blue-200',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',
    pinned: true,
    favorite: true,
  },
  {
    id: '2',
    title: 'Reflexão Salmo 23',
    content: 'O SENHOR é meu pastor...',
    verse: 'Salmos 23:1-6',
    tags: ['devocional'],
    color: 'bg-green-100 border-green-200',
    createdAt: '2026-02-28',
    updatedAt: '2026-02-28',
    pinned: false,
    favorite: false,
  },
];

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(NOTES);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formVerse, setFormVerse] = useState('');

  const filteredNotes = notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase()) ||
        n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const saveNote = () => {
    if (!formTitle.trim()) return;

    const newNote: Note = {
      id: editingNote?.id || Date.now().toString(),
      title: formTitle,
      content: formContent,
      verse: formVerse || undefined,
      tags: selectedTags,
      color: selectedColor,
      createdAt: editingNote?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      pinned: editingNote?.pinned || false,
      favorite: editingNote?.favorite || false,
    };

    if (editingNote) {
      setNotes(notes.map((n) => (n.id === editingNote.id ? newNote : n)));
    } else {
      setNotes([newNote, ...notes]);
    }

    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingNote(null);
    setFormTitle('');
    setFormContent('');
    setFormVerse('');
    setSelectedTags([]);
    setSelectedColor(COLORS[0]);
  };

  const editNote = (note: Note) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormVerse(note.verse || '');
    setSelectedTags(note.tags);
    setSelectedColor(note.color);
    setShowForm(true);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  const toggleFavorite = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, favorite: !n.favorite } : n)));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden pb-20">
      <div className="p-4 border-b bg-card/30 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-black">Minhas Anotações</h1>
            <p className="text-xs text-muted-foreground">{notes.length} notas</p>
          </div>
          <Button onClick={() => setShowForm(true)} size="sm" className="rounded-xl">
            <Plus className="h-4 w-4 mr-1" /> Nova
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar notas..."
            className="pl-9 h-10 rounded-xl bg-muted/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8">
            <StickyNote className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma nota encontrada</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className={cn('border rounded-2xl p-4', note.color)}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {note.pinned && <Pin className="h-3 w-3 text-amber-500" />}
                  {note.favorite && <Star className="h-3 w-3 text-amber-400 fill-amber-400" />}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => togglePin(note.id)}
                    className="p-1 hover:bg-black/5 rounded"
                  >
                    <Pin className={cn('h-3 w-3', note.pinned && 'text-amber-500')} />
                  </button>
                  <button
                    onClick={() => toggleFavorite(note.id)}
                    className="p-1 hover:bg-black/5 rounded"
                  >
                    <Star
                      className={cn('h-3 w-3', note.favorite && 'text-amber-400 fill-amber-400')}
                    />
                  </button>
                  <button onClick={() => editNote(note)} className="p-1 hover:bg-black/5 rounded">
                    <Edit2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1 hover:bg-black/5 rounded text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-sm mb-1">{note.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{note.content}</p>

              {note.verse && (
                <div className="flex items-center gap-1 text-[10px] text-primary mb-2">
                  <BookOpen className="h-3 w-3" />
                  <span>{note.verse}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {note.tags.map((tagId) => {
                  const tag = TAGS_PREDEFINED.find((t) => t.id === tagId);
                  return tag ? (
                    <span
                      key={tagId}
                      className={cn(
                        'px-2 py-0.5 rounded-full text-[10px] font-bold text-white',
                        tag.color
                      )}
                    >
                      {tag.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
          onClick={resetForm}
        >
          <div
            className="bg-background w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-black text-lg">{editingNote ? 'Editar Nota' : 'Nova Nota'}</h2>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-3">
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Título"
                className="h-10 rounded-xl"
              />

              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Escreva sua anotação..."
                className="w-full h-32 p-3 rounded-xl bg-muted border-0 resize-none text-sm"
              />

              <Input
                value={formVerse}
                onChange={(e) => setFormVerse(e.target.value)}
                placeholder="Referência bíblica (ex: Salmos 23:1)"
                className="h-10 rounded-xl"
              />

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">
                  Cor
                </label>
                <div className="flex gap-2">
                  {COLORS.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'w-8 h-8 rounded-full border-2',
                        color,
                        selectedColor === color && 'border-foreground'
                      )}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAGS_PREDEFINED.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-bold text-white transition-all',
                        selectedTags.includes(tag.id) ? tag.color : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={resetForm} variant="outline" className="flex-1 h-10 rounded-xl">
                  Cancelar
                </Button>
                <Button onClick={saveNote} className="flex-1 h-10 rounded-xl">
                  <Save className="h-4 w-4 mr-1" /> Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
