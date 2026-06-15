'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Locale } from './types';
import { getDict, type Dict } from './i18n';

interface PrefCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  t: Dict;
}

const Ctx = createContext<PrefCtx | null>(null);

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // hydrate from storage
  useEffect(() => {
    try {
      const l = localStorage.getItem('ah_locale') as Locale | null;
      const th = localStorage.getItem('ah_theme') as 'dark' | 'light' | null;
      if (l) setLocaleState(l);
      if (th) setTheme(th);
    } catch {}
  }, []);

  // reflect theme on <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
    try {
      localStorage.setItem('ah_theme', theme);
    } catch {}
  }, [theme]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem('ah_locale', l);
    } catch {}
  };

  const value: PrefCtx = {
    locale,
    setLocale,
    theme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    t: getDict(locale),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePrefs(): PrefCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('usePrefs must be used inside <PrefsProvider>');
  return c;
}
