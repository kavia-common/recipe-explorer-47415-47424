# Recipe Explorer Frontend (Ocean Professional)

A lightweight React app for browsing, searching, and viewing recipes. It uses a minimal hash-based router and an env-driven API client with a mock-data fallback.

## Run

- npm start
- npm test
- npm run build

Open http://localhost:3000

## Routing

This project uses a small custom hash router (no dependencies):

- Home: `#/`
- Search: `#/search?q=term`
- Recipe Detail: `#/recipe/:id`

Links use the `Link` component from `src/router/HashRouter.js`.

## API Client and Feature Flags

Base URL:
- REACT_APP_API_BASE or REACT_APP_BACKEND_URL

Feature flags:
- REACT_APP_FEATURE_FLAGS: comma-separated list. Include `useMockData` to enable local mock data. If no base URL is provided, mock data is used by default.

Examples:
- REACT_APP_FEATURE_FLAGS=useMockData
- REACT_APP_API_BASE=https://api.example.com

Other supported env vars listed in the container description are not required here.

## Theme

The Ocean Professional theme is applied via CSS variables in `src/App.css`. A theme toggle is available in the navbar (light/dark).

## Structure

- src/router/HashRouter.js: tiny router
- src/services/api.js: API with mock fallback
- src/services/ApiContext.js: context provider
- src/pages/Home.js, Search.js, RecipeDetail.js: pages
- src/App.js: layout and routes
- src/App.css: theme and components
- src/index.css: base styles
