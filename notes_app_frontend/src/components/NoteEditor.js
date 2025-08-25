import React, { useEffect, useMemo, useState } from 'react';
import { useNotes } from '../context/NotesContext';

// PUBLIC_INTERFACE
export default function NoteEditor({ initialNote, onSave, onCancel }) {
  /**
   * Note editor for creating new or editing existing notes.
   */
  const isEdit = Boolean(initialNote?.id);
  const { categories } = useNotes();

  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [category, setCategory] = useState(initialNote?.category || 'General');
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    setTitle(initialNote?.title || '');
    setContent(initialNote?.content || '');
    setCategory(initialNote?.category || 'General');
    setCustomCategory('');
  }, [initialNote]);

  const allCategories = useMemo(() => {
    const base = Array.from(new Set(['General', ...categories]));
    if (customCategory && !base.includes(customCategory)) base.push(customCategory);
    return base;
  }, [categories, customCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cat = customCategory.trim() ? customCategory.trim() : category;
    onSave({ title, content, category: cat });
  };

  return (
    <section className="editor" aria-label={isEdit ? 'Edit note' : 'Create note'}>
      <h2 style={{ margin: 0 }}>{isEdit ? 'Edit Note' : 'New Note'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="row">
          <input
            className="input"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Title"
            required
          />
          <select
            className="select"
            value={category}
            aria-label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {allCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <textarea
          className="textarea"
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label="Content"
        />
        <input
          className="input"
          type="text"
          placeholder="Or create a new category (optional)"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
          aria-label="New category"
        />
        <div className="actions">
          <button type="button" className="btn secondary" onClick={onCancel} aria-label="Cancel">Cancel</button>
          <button type="submit" className="btn" aria-label="Save note">{isEdit ? 'Save Changes' : 'Create Note'}</button>
        </div>
      </form>
    </section>
  );
}
