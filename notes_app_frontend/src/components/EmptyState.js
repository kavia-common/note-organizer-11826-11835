import React from 'react';

// PUBLIC_INTERFACE
export default function EmptyState({ onCreate }) {
  /** Empty/search-no-result state with a CTA to create a note. */
  return (
    <div className="empty" role="note">
      <h3>No notes found</h3>
      <p>Try adjusting your search or create a new note to get started.</p>
      <div style={{ marginTop: 12 }}>
        <button className="btn accent" onClick={onCreate} aria-label="Create a note">+ Create a note</button>
      </div>
    </div>
  );
}
