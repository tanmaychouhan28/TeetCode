import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  Tag, 
  Search, 
  BookOpen, 
  Check, 
  Copy,
  Sparkles
} from 'lucide-react';
import { NoteItem } from '../types';
import { api } from '../services/api';

export const NotesView: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Form State for active note
  const [title, setTitle] = useState<string>('');
  const [topic, setTopic] = useState<string>('General');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  const topicsList = ['All', 'Graphs', 'Dynamic Programming', 'Arrays', 'Trees', 'Linked Lists', 'General'];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    const data = await api.getNotes();
    setNotes(data);
    if (data.length > 0) {
      selectNote(data[0]);
    }
    setLoading(false);
  };

  const selectNote = (note: NoteItem) => {
    setActiveNote(note);
    setTitle(note.title);
    setTopic(note.topic);
    setContent(note.content);
    setTags(note.tags.join(', '));
  };

  const handleCreateNew = async () => {
    const newNote = await api.createNote(
      'Graphs',
      'New Algorithmic Invariant Note',
      '## Core Invariants\n\n- Write key algorithmic insights here\n- Time & Space Bounds:',
      'graphs,patterns'
    );
    setNotes([newNote, ...notes]);
    selectNote(newNote);
  };

  const handleSave = async () => {
    if (!activeNote) return;
    setIsSaving(true);
    const updated = await api.updateNote(activeNote.id, title, content, topic);
    setNotes(notes.map(n => n.id === activeNote.id ? { ...updated, tags: tags.split(',').map(t => t.trim()) } : n));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDelete = async (id: number) => {
    await api.deleteNote(id);
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    if (remaining.length > 0) {
      selectNote(remaining[0]);
    } else {
      setActiveNote(null);
    }
  };

  const handleInsertCheatSheet = (snippet: string) => {
    setContent(prev => prev + '\n\n' + snippet);
  };

  const filteredNotes = notes.filter(n => {
    const matchTopic = selectedTopic === 'All' || n.topic.toLowerCase() === selectedTopic.toLowerCase();
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    return matchTopic && matchSearch;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#1A1A1A] text-[#EFF1F6]">
      {/* Header */}
      <div className="border-b border-[#333333] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FileText size={22} className="text-[#FFA116]" />
            <span>TeetCode Algorithmic Notes & Invariant Knowledge Base</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Curate your personal cheatsheets, recurrence relations, and algorithmic mental models.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-[#FFA116] text-black font-bold text-xs rounded-lg hover:bg-[#FFB03A] transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Grid: Notes List (4 cols) & Markdown Editor (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">
        {/* Left: Notes Catalog (4 cols) */}
        <div className="lg:col-span-4 bg-[#222222] border border-[#333333] rounded-2xl flex flex-col overflow-hidden">
          {/* Search & Topic Filters */}
          <div className="p-3 border-b border-[#333333] space-y-2.5 bg-[#1E1E1E]">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#858585]" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-xs text-white focus:outline-none focus:border-[#FFA116]"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {topicsList.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                    selectedTopic === t
                      ? 'bg-[#FFA116] text-black font-bold'
                      : 'bg-[#1A1A1A] border border-[#333333] text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#2C2C2C]">
            {loading ? (
              <div className="p-6 text-center text-xs font-mono text-[#A1A1AA]">Loading notes...</div>
            ) : filteredNotes.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#A1A1AA]">No notes found.</div>
            ) : (
              filteredNotes.map((note) => {
                const isActive = activeNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => selectNote(note)}
                    className={`p-3.5 cursor-pointer transition-colors ${
                      isActive ? 'bg-[#2A2A2A] border-l-2 border-[#FFA116]' : 'hover:bg-[#282828]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{note.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1A1A1A] border border-[#333333] text-[#A1A1AA]">
                        {note.topic}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#858585] mt-1 line-clamp-2">
                      {note.content.replace(/#/g, '')}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Markdown Editor Pane (8 cols) */}
        <div className="lg:col-span-8 bg-[#222222] border border-[#333333] rounded-2xl flex flex-col overflow-hidden">
          {activeNote ? (
            <>
              {/* Editor Header Bar */}
              <div className="p-3 bg-[#1E1E1E] border-b border-[#333333] flex flex-wrap items-center justify-between gap-3">
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-2.5 py-1 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-xs font-bold text-white focus:outline-none focus:border-[#FFA116]"
                  />
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="py-1 px-2.5 bg-[#1A1A1A] border border-[#3C3C3C] rounded-lg text-xs text-[#A1A1AA] focus:outline-none focus:border-[#FFA116] shrink-0"
                  >
                    {topicsList.filter(t => t !== 'All').map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-3.5 py-1.5 bg-[#FFA116] text-black font-bold text-xs rounded-lg hover:bg-[#FFB03A] transition-colors flex items-center gap-1.5"
                  >
                    {saveSuccess ? <Check size={12} /> : <Save size={12} />}
                    <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(activeNote.id)}
                    className="p-1.5 text-[#858585] hover:text-[#FF375F] rounded hover:bg-[#1A1A1A] transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Quick Snippet Inserts */}
              <div className="px-3 py-1.5 bg-[#1A1A1A] border-b border-[#333333] flex items-center gap-2 text-[11px] font-mono text-[#858585] overflow-x-auto scrollbar-none">
                <span className="shrink-0">Insert Invariant:</span>
                <button
                  onClick={() => handleInsertCheatSheet('### BFS Traversal Pattern\n- **Queue**: `collections.deque([start])`\n- **Visited**: `set([start])`\n- **In-place mut**: Mark on enqueue')}
                  className="px-2 py-0.5 rounded bg-[#242424] border border-[#333333] text-[#A1A1AA] hover:text-white shrink-0"
                >
                  + BFS Queue
                </button>
                <button
                  onClick={() => handleInsertCheatSheet('### DP 1D Tabulation\n- `dp = [float(\'inf\')] * (amount + 1)`\n- `dp[0] = 0`\n- `dp[i] = min(dp[i], dp[i - c] + 1)`')}
                  className="px-2 py-0.5 rounded bg-[#242424] border border-[#333333] text-[#A1A1AA] hover:text-white shrink-0"
                >
                  + DP Tabulation
                </button>
                <button
                  onClick={() => handleInsertCheatSheet('### Fast & Slow Pointers (Floyd)\n- `slow = fast = head`\n- `while fast and fast.next:`\n- `  slow = slow.next; fast = fast.next.next`')}
                  className="px-2 py-0.5 rounded bg-[#242424] border border-[#333333] text-[#A1A1AA] hover:text-white shrink-0"
                >
                  + Fast/Slow Pointers
                </button>
              </div>

              {/* Textarea Content */}
              <div className="flex-1 p-4 bg-[#1A1A1A] overflow-hidden">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your markdown notes and algorithmic reasoning..."
                  className="w-full h-full p-2 bg-[#1A1A1A] text-[#EFF1F6] font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs font-mono text-[#A1A1AA]">
              Select or create a note to begin editing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
