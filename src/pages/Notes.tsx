import { useState, useMemo } from "react";
import { defaultNotes } from "@/data/globalNotes";
import { regions } from "@/data/regions";
import type { GlobalNote } from "@/data/globalTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BookOpen, Plus, Search, Tag, Globe, Map, Calendar, Lightbulb, Target, Pencil, Trash2,
} from "lucide-react";

const CATEGORIES: GlobalNote['category'][] = ['Global', 'Regional', 'Country', 'Event', 'Strategy'];

const categoryIcon: Record<GlobalNote['category'], React.ReactNode> = {
  Global: <Globe className="h-3.5 w-3.5" />,
  Regional: <Map className="h-3.5 w-3.5" />,
  Country: <Target className="h-3.5 w-3.5" />,
  Event: <Calendar className="h-3.5 w-3.5" />,
  Strategy: <Lightbulb className="h-3.5 w-3.5" />,
};

const categoryColor: Record<GlobalNote['category'], string> = {
  Global: 'bg-blue-100 text-blue-700',
  Regional: 'bg-purple-100 text-purple-700',
  Country: 'bg-green-100 text-green-700',
  Event: 'bg-orange-100 text-orange-700',
  Strategy: 'bg-rose-100 text-rose-700',
};

function newNote(): GlobalNote {
  return {
    id: `gn_${Date.now()}`,
    title: '',
    content: '',
    category: 'Global',
    tags: [],
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

function NoteCard({
  note,
  selected,
  onClick,
}: {
  note: GlobalNote;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-3 transition-colors ${selected ? 'bg-accent border-primary/30' : 'hover:bg-accent/50'}`}
    >
      <div className="flex items-start gap-2">
        <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${categoryColor[note.category]}`}>
          {categoryIcon[note.category]}
          {note.category}
        </span>
      </div>
      <p className="text-sm font-medium mt-1.5 leading-snug line-clamp-2">{note.title || <em className="text-muted-foreground">Untitled</em>}</p>
      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{note.content.slice(0, 100)}</p>
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {note.tags.slice(0, 4).map(t => (
            <span key={t} className="text-xs px-1.5 py-0.5 bg-accent rounded text-muted-foreground">#{t}</span>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-1.5">{note.createdAt}</p>
    </button>
  );
}

function NoteEditor({
  note,
  onChange,
  onSave,
  onDelete,
}: {
  note: GlobalNote;
  onChange: (n: GlobalNote) => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  const [tagInput, setTagInput] = useState('');

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (t && !note.tags.includes(t)) {
      onChange({ ...note, tags: [...note.tags, t] });
    }
    setTagInput('');
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Title */}
      <Input
        value={note.title}
        onChange={e => onChange({ ...note, title: e.target.value })}
        placeholder="Note title…"
        className="text-base font-medium border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      {/* Meta */}
      <div className="flex gap-2 flex-wrap">
        <Select value={note.category} onValueChange={v => onChange({ ...note, category: v as GlobalNote['category'] })}>
          <SelectTrigger className="h-7 text-xs w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => (
              <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {note.category === 'Regional' && (
          <Select value={note.regionId ?? ''} onValueChange={v => onChange({ ...note, regionId: v })}>
            <SelectTrigger className="h-7 text-xs w-40">
              <SelectValue placeholder="Select region…" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(r => (
                <SelectItem key={r.id} value={r.id} className="text-xs">{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {note.category === 'Country' && (
          <Input
            value={note.countryCode ?? ''}
            onChange={e => onChange({ ...note, countryCode: e.target.value.toUpperCase() })}
            placeholder="Country code (e.g. DE)"
            className="h-7 text-xs w-40"
          />
        )}
      </div>

      {/* Tags */}
      <div>
        <div className="flex gap-2 mb-2">
          <Input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTag()}
            placeholder="Add tag and press Enter…"
            className="h-7 text-xs flex-1"
          />
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addTag}>
            <Tag className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {note.tags.map(t => (
            <span key={t} className="inline-flex items-center gap-1 text-xs px-1.5 py-0.5 bg-accent rounded text-muted-foreground">
              #{t}
              <button onClick={() => onChange({ ...note, tags: note.tags.filter(x => x !== t) })} className="hover:text-destructive">✕</button>
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <Textarea
        value={note.content}
        onChange={e => onChange({ ...note, content: e.target.value })}
        placeholder="Write your intelligence notes here…"
        className="flex-1 text-sm resize-none min-h-[280px]"
      />

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="destructive" size="sm" onClick={onDelete} className="text-xs">
          <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
        </Button>
        <Button size="sm" onClick={onSave} className="text-xs">
          Save Note
        </Button>
      </div>
    </div>
  );
}

export default function Notes() {
  const [notes, setNotes] = useState<GlobalNote[]>(defaultNotes);
  const [selectedId, setSelectedId] = useState<string | null>(defaultNotes[0]?.id ?? null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<GlobalNote | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredNotes = useMemo(() => notes.filter(n => {
    const matchCat = filterCategory === 'all' || n.category === filterCategory;
    const q = searchQuery.toLowerCase();
    const matchQ = !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some(t => t.includes(q));
    return matchCat && matchQ;
  }), [notes, filterCategory, searchQuery]);

  const selectedNote = useMemo(() => notes.find(n => n.id === selectedId) ?? null, [notes, selectedId]);
  const [draftNote, setDraftNote] = useState<GlobalNote | null>(null);

  // Update draft whenever selected changes
  const handleSelect = (id: string) => {
    setSelectedId(id);
    setDraftNote(null);
  };

  const activeDraft: GlobalNote | null = draftNote ?? selectedNote;

  function saveNote() {
    if (!activeDraft) return;
    setNotes(prev => prev.map(n => n.id === activeDraft.id ? activeDraft : n));
    setDraftNote(null);
  }

  function deleteNote() {
    if (!activeDraft) return;
    const remaining = notes.filter(n => n.id !== activeDraft.id);
    setNotes(remaining);
    setSelectedId(remaining[0]?.id ?? null);
    setDraftNote(null);
  }

  function addNote() {
    const n = newNote();
    setEditingNote(n);
    setDialogOpen(true);
  }

  function confirmAdd() {
    if (!editingNote) return;
    setNotes(prev => [editingNote, ...prev]);
    setSelectedId(editingNote.id);
    setEditingNote(null);
    setDialogOpen(false);
  }

  const grouped = useMemo(() => {
    const map: Partial<Record<GlobalNote['category'], GlobalNote[]>> = {};
    for (const n of filteredNotes) {
      (map[n.category] ??= []).push(n);
    }
    return map;
  }, [filteredNotes]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of notes) counts[n.category] = (counts[n.category] ?? 0) + 1;
    return counts;
  }, [notes]);

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Intelligence Notes</h1>
          <p className="text-xs text-muted-foreground">{notes.length} notes · Organized by category, region, and country</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs" onClick={addNote}>
              <Plus className="h-3.5 w-3.5 mr-1" /> New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Note</DialogTitle>
            </DialogHeader>
            {editingNote && (
              <div className="space-y-3">
                <Input
                  value={editingNote.title}
                  onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
                  placeholder="Title…"
                />
                <Select value={editingNote.category} onValueChange={v => setEditingNote({ ...editingNote, category: v as GlobalNote['category'] })}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Textarea
                  value={editingNote.content}
                  onChange={e => setEditingNote({ ...editingNote, content: e.target.value })}
                  placeholder="Note content…"
                  className="text-sm h-40"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button size="sm" onClick={confirmAdd}>Create Note</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(f => f === cat ? 'all' : cat)}
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${filterCategory === cat ? `${categoryColor[cat]} border-current font-medium` : 'hover:bg-accent border-transparent'}`}
          >
            {categoryIcon[cat]}
            {cat}
            {categoryCounts[cat] && <span className="font-bold">{categoryCounts[cat]}</span>}
          </button>
        ))}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: notes list */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-2 overflow-y-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search notes…"
              className="h-8 text-xs pl-8"
            />
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">No notes match your filter</div>
          ) : filterCategory === 'all' ? (
            Object.entries(grouped).map(([cat, catNotes]) => (
              <div key={cat}>
                <p className={`text-xs font-semibold px-1 py-0.5 rounded mb-1 inline-flex items-center gap-1 ${categoryColor[cat as GlobalNote['category']]}`}>
                  {categoryIcon[cat as GlobalNote['category']]} {cat}
                </p>
                <div className="space-y-1">
                  {catNotes.map(n => (
                    <NoteCard key={n.id} note={n} selected={selectedId === n.id} onClick={() => handleSelect(n.id)} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-1">
              {filteredNotes.map(n => (
                <NoteCard key={n.id} note={n} selected={selectedId === n.id} onClick={() => handleSelect(n.id)} />
              ))}
            </div>
          )}
        </div>

        {/* Right: note editor */}
        <div className="flex-1 border rounded-xl p-4 overflow-y-auto">
          {activeDraft ? (
            <NoteEditor
              note={activeDraft}
              onChange={n => setDraftNote(n)}
              onSave={saveNote}
              onDelete={deleteNote}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
              <BookOpen className="h-8 w-8 opacity-30" />
              <p className="text-sm">Select a note to view or edit</p>
              <Button variant="outline" size="sm" className="text-xs mt-2" onClick={addNote}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Create your first note
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
