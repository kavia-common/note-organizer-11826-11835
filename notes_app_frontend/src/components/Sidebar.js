import React from 'react';

// PUBLIC_INTERFACE
export default function Sidebar({ categories, active, onChange }) {
  /** Sidebar categories/filters list. */
  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="section-title">Categories</div>
      <nav className="filter-list" aria-label="Categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-item ${active === cat ? 'active' : ''}`}
            onClick={() => onChange(cat)}
            aria-pressed={active === cat}
            aria-label={`Filter by ${cat}`}
          >
            <span>🗂️</span>
            <span>{cat}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
