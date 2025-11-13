/**
 * API client for the Recipe app.
 * - Base URL from REACT_APP_API_BASE || REACT_APP_BACKEND_URL
 * - If feature flag 'useMockData' is enabled in REACT_APP_FEATURE_FLAGS, use mock responses.
 * - Exposes methods: listRecipes, searchRecipes, getRecipe
 */

// PUBLIC_INTERFACE
export function createApiClient() {
  /** This is a public function that returns an API client bound to the detected environment configuration. */
  const envBase =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    '';

  const flagsRaw = process.env.REACT_APP_FEATURE_FLAGS || '';
  const flags = new Set(
    flagsRaw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  );
  const useMock = flags.has('useMockData') || !envBase;

  const baseUrl = envBase?.replace(/\/+$/, '');

  async function httpGet(path, params) {
    const url = new URL((baseUrl || '') + path, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, v);
      });
    }
    const res = await fetch(url.toString().replace(window.location.origin, ''), {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res.json();
  }

  // Mock data
  const mockRecipes = [
    {
      id: '1',
      title: 'Creamy Garlic Pasta',
      description: 'A rich and creamy pasta with garlic and parmesan.',
      timeMinutes: 25,
      servings: 2,
      image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?q=80&w=1200&auto=format&fit=crop',
      ingredients: [
        '200g spaghetti',
        '3 cloves garlic',
        '1 cup cream',
        '1/2 cup parmesan',
        'Salt & pepper',
      ],
      steps: [
        'Cook pasta until al dente.',
        'Sauté garlic in butter.',
        'Add cream and reduce.',
        'Toss with pasta and cheese.',
      ],
      tags: ['pasta', 'vegetarian', 'quick'],
    },
    {
      id: '2',
      title: 'Grilled Lemon Chicken',
      description: 'Juicy grilled chicken with a zesty lemon marinade.',
      timeMinutes: 35,
      servings: 4,
      image: 'https://images.unsplash.com/photo-1604908176997-431224e1e00d?q=80&w=1200&auto=format&fit=crop',
      ingredients: [
        '4 chicken breasts',
        '2 lemons',
        'Olive oil',
        'Garlic',
        'Salt & pepper',
      ],
      steps: [
        'Marinate chicken in lemon, oil, garlic.',
        'Preheat grill.',
        'Grill until cooked through.',
      ],
      tags: ['chicken', 'grill', 'gluten-free'],
    },
    {
      id: '3',
      title: 'Avocado Toast Deluxe',
      description: 'Crispy toast topped with smashed avocado and poached egg.',
      timeMinutes: 15,
      servings: 1,
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop',
      ingredients: [
        '2 slices sourdough',
        '1 ripe avocado',
        '1 egg',
        'Chili flakes, salt',
      ],
      steps: [
        'Toast bread.',
        'Smash avocado with salt.',
        'Poach egg and assemble.',
      ],
      tags: ['breakfast', 'vegetarian', 'quick'],
    },
  ];

  function simulateLatency(data, ms = 200) {
    return new Promise(resolve => setTimeout(() => resolve(data), ms));
  }

  // PUBLIC_INTERFACE
  async function listRecipes() {
    /** Returns a list of recipes, optionally from backend or mock. */
    if (useMock) return simulateLatency(mockRecipes);
    return httpGet('/recipes');
  }

  // PUBLIC_INTERFACE
  async function searchRecipes(query) {
    /** Search recipes by query string. */
    if (useMock) {
      const q = (query || '').toLowerCase();
      const filtered = mockRecipes.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      );
      return simulateLatency(filtered);
    }
    return httpGet('/recipes/search', { q: query });
  }

  // PUBLIC_INTERFACE
  async function getRecipe(id) {
    /** Returns a single recipe by id. */
    if (useMock) {
      const found = mockRecipes.find(r => r.id === id);
      if (!found) throw new Error('Recipe not found');
      return simulateLatency(found);
    }
    return httpGet(`/recipes/${encodeURIComponent(id)}`);
  }

  return {
    listRecipes,
    searchRecipes,
    getRecipe,
    __config: { baseUrl, useMock },
  };
}
