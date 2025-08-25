import React from 'react';

// PUBLIC_INTERFACE
export default function Navbar({ query, onQueryChange, onCreate }) {
  /** Navbar with brand, search, and create button. */
  return (
    <header className="navbar" role="banner" aria-label="Top Navigation">
      <div className="brand" aria-label="Notes App">
        <span className="brand-mark" />
        Notes
      </div>
      <div className="search" role="search">
        <span className="icon" aria-hidden="true">🔎</span>
        <input
          type="search"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search notes"
        />
      </div>
      <div className="grow" />
      <button className="btn accent" onClick={onCreate} aria-label="Create new note">
        + New Note
      </button>
    </header>
  );
}
