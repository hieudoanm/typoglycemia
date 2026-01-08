import { useState, useEffect } from 'react';

type Theme = 'lofi' | 'dark';

const KEY = 'typoglycemia-theme';

export const useTheme = (defaultTheme: Theme) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Apply + persist theme
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  // Load saved theme
  useEffect(() => {
    const setThemeFromLocalStorage = () => {
      const saved = localStorage.getItem(KEY) as Theme | null;
      if (saved) setTheme(saved);
    };
    setThemeFromLocalStorage();
  }, []);

  const toggleTheme = () => {
    setTheme((t) => {
      return t === 'dark' ? 'lofi' : 'dark';
    });
  };

  return { theme, toggleTheme };
};
