import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import { NotesProvider, useNotes } from './context/NotesContext';

/**
 * Root app shell that provides Notes context and renders the layout.
 */
function AppShell() {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    categories,
  } = useNotes();

  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Filter and search derived list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter(n => activeCategory === 'All' || n.category === activeCategory)
      .filter(n => {
        if (!q) return true;
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, query, activeCategory]);

  useEffect(() => {
    // Ensure selected note remains valid after filtering
    if (selectedId && !filtered.some(n => n.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  const selectedNote = useMemo(
    () => notes.find(n => n.id === selectedId) || null,
    [notes, selectedId]
  );

  const onCreate = () => {
    setSelectedId(null);
    setIsEditorOpen(true);
  };

  const onSave = (payload) => {
    if (selectedNote) {
      updateNote(selectedNote.id, payload);
    } else {
      const newId = addNote(payload);
      setSelectedId(newId);
    }
    setIsEditorOpen(false);
  };

  const onCancel = () => {
    setIsEditorOpen(false);
  };

  const onSelectNote = (id) => {
    setSelectedId(id);
    setIsEditorOpen(true);
  };

  const onDelete = (id) => {
    deleteNote(id);
    if (selectedId === id) {
      setSelectedId(null);
      setIsEditorOpen(false);
    }
  };

  return (
    <div className="app-root">
      <Navbar
        query={query}
        onQueryChange={setQuery}
        onCreate={onCreate}
      />
      <div className="content">
        <Sidebar
          categories={['All', ...categories]}
          active={activeCategory}
          onChange={setActiveCategory}
        />
        <main className="main">
          <div className="main-inner">
            {!isEditorOpen && filtered.length === 0 && (
              <EmptyState onCreate={onCreate} />
            )}
            {!isEditorOpen && filtered.length > 0 && (
              <NoteList
                notes={filtered}
                onSelect={onSelectNote}
                onDelete={onDelete}
              />
            )}
            {isEditorOpen && (
              <NoteEditor
                key={selectedNote ? selectedNote.id : 'new'}
                initialNote={selectedNote}
                onSave={onSave}
                onCancel={onCancel}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** App entry with context provider. */
  return (
    <NotesProvider>
      <AppShell />
    </NotesProvider>
  );
}

export default App;
