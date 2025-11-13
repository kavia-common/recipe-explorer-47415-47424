import React, { useEffect, useState } from 'react';
import { Link } from '../router/HashRouter';
import { useApi } from '../services/ApiContext';

// PUBLIC_INTERFACE
export default function RecipeDetail({ params }) {
  /** Recipe detail page; expects params.id from router. */
  const api = useApi();
  const id = params?.id;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr('');
    api.getRecipe(id)
      .then((data) => { if (alive) setRecipe(data); })
      .catch((e) => { if (alive) setErr(e.message || 'Failed to load recipe'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [api, id]);

  if (loading) return <p>Loading recipe…</p>;
  if (err) return <p role="alert" style={{ color: 'var(--error)' }}>{err}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div>
      <Link className="link" to="/">{'← Back to Home'}</Link>

      <div className="detail">
        <article className="detail-card">
          <img className="detail-img" src={recipe.image} alt="" />
          <div className="detail-body">
            <h2 style={{ marginTop: 0 }}>{recipe.title}</h2>
            <p style={{ color: 'var(--muted)' }}>{recipe.description}</p>
            <p className="card-meta" style={{ marginTop: 8 }}>
              {recipe.timeMinutes} min • Serves {recipe.servings}
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {(recipe.tags || []).map((t) => (
                <span key={t} className="btn ghost" style={{ padding: '6px 10px', borderRadius: 999 }}>
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </article>

        <section className="section" aria-label="Ingredients and steps">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }}>
            <div>
              <h3>Ingredients</h3>
              <ul>
                {(recipe.ingredients || []).map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Steps</h3>
              <ol>
                {(recipe.steps || []).map((s, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>{s}</li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
