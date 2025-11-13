import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from '../router/HashRouter';
import { useApi } from '../services/ApiContext';

// PUBLIC_INTERFACE
export default function Search() {
  /** Search page that reads 'q' from the URL and displays results. */
  const api = useApi();
  const location = useLocation();
  const q = useMemo(() => new URLSearchParams(location.search).get('q') || '', [location.search]);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(!!q);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    setErr('');
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.searchRecipes(q)
      .then((data) => { if (alive) setResults(data); })
      .catch((e) => { if (alive) setErr(e.message || 'Search failed'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [api, q]);

  return (
    <div>
      <section className="hero">
        <h1>Search results</h1>
        <p>Showing matches for: <strong>{q || '—'}</strong></p>
      </section>

      {loading && <p>Searching…</p>}
      {err && <p role="alert" style={{ color: 'var(--error)' }}>{err}</p>}
      {!loading && !err && results.length === 0 && q && <p>No results found.</p>}
      {!loading && !err && !q && <p>Enter a search term in the top bar to get started.</p>}

      <div className="grid" role="list">
        {results.map((r) => (
          <article className="card" key={r.id} role="listitem">
            <img className="card-img" src={r.image} alt="" />
            <div className="card-body">
              <h3 className="card-title">{r.title}</h3>
              <p className="card-meta">{r.timeMinutes} min • Serves {r.servings}</p>
              <div className="card-actions">
                <Link className="btn secondary" to={`/recipe/${encodeURIComponent(r.id)}`}>View</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
