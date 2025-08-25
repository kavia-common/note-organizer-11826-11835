import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { generateId, nowTs } from '../utils/id';

// PUBLIC_INTERFACE
export const NotesContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * NotesProvider wraps children with notes state, persistence, and CRUD methods.
 */
export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const didLoad = useRef(false);

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem('notes.v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setNotes(parsed.map(n => ({ ...n, updatedAt: new Date(n.updatedAt).getTime() })));
      } else {
        // Seed with a sample note for first run
        setNotes([
          {
            id: generateId(),
            title: 'Welcome to Notes',
            content: 'Create, search, and manage your notes.\nUse the + New Note button to get started.',
            category: 'General',
            updatedAt: nowTs(),
          },
        ]);
      }
    } catch {
      // ignore corrupted storage
    } finally {
      didLoad.current = true;
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!didLoad.current) return;
    try {
      localStorage.setItem('notes.v1', JSON.stringify(notes));
    } catch {
      // ignore quota errors
    }
  }, [notes]);

  // PUBLIC_INTERFACE
  const addNote = ({ title, content, category }) => {
    const id = generateId();
    const n = {
      id,
      title: title?.trim() || 'Untitled',
      content: content || '',
      category: category?.trim() || 'General',
      updatedAt: nowTs(),
    };
    setNotes(prev => [n, ...prev]);
    return id;
  };

  // PUBLIC_INTERFACE
  const updateNote = (id, { title, content, category }) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id
          ? {
              ...n,
              title: title?.trim() || 'Untitled',
              content: content ?? n.content,
              category: category?.trim() || 'General',
              updatedAt: nowTs(),
            }
          : n
      )
    );
  };

  // PUBLIC_INTERFACE
  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const categories = useMemo(() => {
    const set = new Set(notes.map(n => n.category || 'General'));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const value = useMemo(
    () => ({ notes, addNote, updateNote, deleteNote, categories }),
    [notes, addNote, updateNote, deleteNote, categories]
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
