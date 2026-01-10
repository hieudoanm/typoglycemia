import { useState, useEffect, useCallback } from 'react';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'lofi',
}

const KEY = 'typoglycemia-theme';

export const useTheme = (defaultTheme: Theme = Theme.LIGHT) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Lazy initializer: check localStorage first, then system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(KEY) as Theme | null;
      if (saved) return saved;
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      return prefersDark ? Theme.DARK : Theme.LIGHT;
    }
    return defaultTheme;
  });

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    try {
      localStorage.setItem(KEY, theme);
    } catch (error) {
      console.error(error);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === Theme.DARK ? Theme.LIGHT : Theme.DARK));
  }, []);

  return { theme, toggleTheme };
};
