import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchNotes, createNote, updateNoteById, deleteNoteById } from '../services/notesService';

// PUBLIC_INTERFACE
export const NotesContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * NotesProvider wraps children with Supabase-backed notes state and CRUD methods.
 * It fetches notes on mount and exposes async CRUD functions.
 */
export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastError, setLastError] = useState(null);

  // Initial load from Supabase
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setLastError(null);
      try {
        const data = await fetchNotes();
        if (active) setNotes(data);
      } catch (e) {
        if (active) setLastError(e);
        // eslint-disable-next-line no-console
        console.error('Failed to fetch notes from Supabase:', e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // PUBLIC_INTERFACE
  const addNote = async ({ title, content, category }) => {
    /**
     * Create a note in Supabase and update local state.
     * Returns the created note id.
     */
    setLastError(null);
    const newNote = await createNote({ title, content, category });
    setNotes(prev => [newNote, ...prev]);
    return newNote.id;
  };

  // PUBLIC_INTERFACE
  const updateNote = async (id, { title, content, category }) => {
    /**
     * Update a note in Supabase and update local state.
     */
    setLastError(null);
    const updated = await updateNoteById(id, { title, content, category });
    setNotes(prev => prev.map(n => (n.id === id ? updated : n)));
  };

  // PUBLIC_INTERFACE
  const deleteNote = async (id) => {
    /**
     * Delete a note in Supabase and update local state.
     */
    setLastError(null);
    await deleteNoteById(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const categories = useMemo(() => {
    const set = new Set(notes.map(n => n.category || 'General'));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const value = useMemo(
    () => ({
      notes,
      addNote,
      updateNote,
      deleteNote,
      categories,
      loading,
      lastError,
    }),
    [notes, categories, loading, lastError]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useNotes gives read/write access to notes state and helpers.
 */
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return ctx;
}
