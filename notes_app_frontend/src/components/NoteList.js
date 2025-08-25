import React from 'react';

// PUBLIC_INTERFACE
export default function NoteList({ notes, onSelect, onDelete }) {
  /** Grid list of note cards. */
  return (
    <section aria-label="Notes list" className="list">
      {notes.map(n => (
        <article key={n.id} className="card" aria-label={`Note ${n.title}`}>
          <header className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <h3 className="title">{n.title || 'Untitled'}</h3>
              <div className="meta">
                {n.category || 'General'} • {new Date(n.updatedAt).toLocaleString()}
              </div>
            </div>
            <div className="row">
              <button className="icon-btn" onClick={() => onSelect(n.id)} aria-label="Open note">Open</button>
              <button className="icon-btn danger" onClick={() => onDelete(n.id)} aria-label="Delete note">Delete</button>
            </div>
          </header>
          <p className="content-preview">{n.content || 'No content yet.'}</p>
        </article>
      ))}
    </section>
  );
}
