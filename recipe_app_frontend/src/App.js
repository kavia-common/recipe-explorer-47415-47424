import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { HashRouter, Route, Routes, Link, useNavigate, useLocation } from './router/HashRouter';
import Home from './pages/Home';
import Search from './pages/Search';
import RecipeDetail from './pages/RecipeDetail';
import { ApiProvider } from './services/ApiContext';

// PUBLIC_INTERFACE
function App() {
  /**
   * The root application component.
   * - Provides theme toggle.
   * - Sets up a lightweight hash-based router.
   * - Wraps children in ApiProvider to expose the API client.
   */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="App">
      <HashRouter>
        <ApiProvider>
          <Navbar onToggleTheme={toggleTheme} />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
            </Routes>
          </main>
          <footer className="footer">
            <small>© {new Date().getFullYear()} Recipe Explorer • Ocean Professional</small>
          </footer>
        </ApiProvider>
      </HashRouter>
    </div>
  );
}

function Navbar({ onToggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [term, setTerm] = useState('');

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q') || '';
    setTerm(q);
  }, [location.search]);

  const onSubmit = (e) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-logo" aria-hidden>🍽️</div>
          <Link className="brand-name link" to="/">Recipe Explorer</Link>
        </div>
        <form className="searchbar" onSubmit={onSubmit} role="search" aria-label="Recipe search">
          <input
            className="search-input"
            type="search"
            placeholder="Search recipes (e.g., pasta, vegan, chicken)..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            aria-label="Search recipes"
          />
          <button className="btn" type="submit" aria-label="Search">Search</button>
          <button type="button" className="btn ghost" onClick={onToggleTheme} aria-label="Toggle theme">Toggle theme</button>
        </form>
      </div>
    </nav>
  );
}

export default App;
