import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Lightweight hash-based router for environments without react-router.
 * Supports:
 * - <HashRouter> provider
 * - <Routes><Route path element /></Routes>
 * - <Link to>
 * - useNavigate(), useLocation()
 *
 * Path matching supports params as /recipe/:id (simple segment match).
 */

// Internal: parse the current hash to pathname and search
function readHashLocation() {
  const hash = window.location.hash || '#/';
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const [pathname, search = ''] = raw.split('?');
  return {
    pathname: pathname || '/',
    search: search ? `?${search}` : '',
    hash: '',
  };
}

const RouterContext = createContext({
  location: { pathname: '/', search: '', hash: '' },
  navigate: (to) => {},
});

export function HashRouter({ children }) {
  const [location, setLocation] = useState(readHashLocation());

  useEffect(() => {
    const onHashChange = () => setLocation(readHashLocation());
    window.addEventListener('hashchange', onHashChange);
    // Ensure there is a default hash
    if (!window.location.hash) {
      window.location.replace('#/');
    } else {
      setLocation(readHashLocation());
    }
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((to) => {
    if (typeof to === 'number') {
      window.history.go(to);
      return;
    }
    if (!to.startsWith('/')) {
      // support relative not implemented; require absolute for simplicity
      // fallback to root
      to = '/' + to;
    }
    window.location.hash = to;
  }, []);

  const value = useMemo(() => ({ location, navigate }), [location, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useLocation() {
  return useContext(RouterContext).location;
}

export function useNavigate() {
  return useContext(RouterContext).navigate;
}

export function Link({ to, children, ...rest }) {
  const href = `#${to.startsWith('/') ? to : '/' + to}`;
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

function matchPath(pathPattern, pathname) {
  // support /, /search, /recipe/:id
  if (pathPattern === '*') return { params: {} };
  const a = pathPattern.replace(/^\/+/, '').split('/');
  const b = pathname.replace(/^\/+/, '').split('/');
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i++) {
    const seg = a[i];
    const cur = b[i];
    if (seg.startsWith(':')) {
      params[seg.slice(1)] = decodeURIComponent(cur);
    } else if (seg !== cur) {
      return null;
    }
  }
  return { params };
}

const RoutesContext = createContext([]);

export function Routes({ children }) {
  // flatten child routes
  const routes = React.Children.toArray(children).filter(Boolean);
  return <RoutesContext.Provider value={routes}>{null}</RoutesContext.Provider>;
}

export function Route({ path, element }) {
  // Only used as descriptor under Routes. Actual rendering happens in RouterOutlet.
  return null;
}

// RouterOutlet renders the matched route
function RouterOutlet() {
  const routes = useContext(RoutesContext);
  const { location } = useContext(RouterContext);
  const pathname = location.pathname || '/';

  for (const r of routes) {
    const { path, element } = r.props || {};
    const match = matchPath(path || '/', pathname);
    if (match) {
      return React.cloneElement(element, { params: match.params, location });
    }
  }
  return null;
}

// Patch React tree so that <Routes> becomes an outlet renderer
// Wrap children to render outlet after provider composition
export function RouterRoot({ children }) {
  return (
    <>
      {children}
      <RouterOutlet />
    </>
  );
}

// Re-export default composition wrapper
export default function HashRouterRoot(props) {
  return (
    <HashRouter>
      <RouterRoot>{props.children}</RouterRoot>
    </HashRouter>
  );
}
