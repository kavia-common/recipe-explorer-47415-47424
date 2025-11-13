import React, { useEffect, useState } from 'react';
import { Link } from '../router/HashRouter';
import { useApi } from '../services/ApiContext';

// PUBLIC_INTERFACE
export default function Home() {
  /** Home page showing featured recipes grid. */
  const api = useApi();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    api.listRecipes()
      .then((data) => { if (alive) setRecipes(data); })
      .catch((e) => { if (alive) setErr(e.message || 'Failed to load'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [api]);

  return (
    <div>
      <section className="hero" aria-label="Welcome">
        <h1>Discover delicious recipes</h1>
        <p>Browse featured dishes or search to find your next meal idea.</p>
      </section>

      {loading && <p>Loading recipes…</p>}
      {err && <p role="alert" style={{ color: 'var(--error)' }}>{err}</p>}

      {!loading && !err && (
        <div className="grid" role="list">
          {recipes.map((r) => (
            <article className="card" key={r.id} role="listitem">
              <img className="card-img" src={r.image} alt="" />
              <div className="card-body">
                <h3 className="card-title">{r.title}</h3>
                <p className="card-meta">
                  {r.timeMinutes} min • Serves {r.servings}
                </p>
                <p style={{ marginTop: 0, marginBottom: 12 }}>{r.description}</p>
                <div className="card-actions">
                  <Link className="btn secondary" to={`/recipe/${encodeURIComponent(r.id)}`}>View</Link>
                  <Link className="btn ghost" to={`/search?q=${encodeURIComponent(r.tags?.[0] || '')}`}>Related</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
