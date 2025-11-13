import React, { createContext, useContext, useMemo } from 'react';
import { createApiClient } from './api';

const Ctx = createContext(null);

// PUBLIC_INTERFACE
export function ApiProvider({ children }) {
  /** Provides the API client instance to children via React Context. */
  const api = useMemo(() => createApiClient(), []);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

// PUBLIC_INTERFACE
export function useApi() {
  /** Hook to access the API client. */
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApi must be used within ApiProvider');
  return ctx;
}
