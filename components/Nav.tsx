'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrefs } from '@/lib/prefs';
import type { Locale } from '@/lib/types';

const LOCALE_LABELS: [Locale, string][] = [
  ['en', 'EN'],
  ['ru', 'RU'],
  ['pt', 'PT'],
  ['uk', 'UK'],
];

export function Nav() {
  const { t, locale, setLocale, theme, toggleTheme } = usePrefs();
  const pathname = usePathname();

  const items = [
    { href: '/universes', label: t.nav_universes },
    { href: '/portfolio', label: t.nav_portfolio },
  ];

  return (
    <nav
      className="sticky top-0 z-50 flex h-16 items-center gap-6 px-8"
      style={{
        background: 'var(--navbg)',
        backdropFilter: 'saturate(160%) blur(10px)',
        borderBottom: '1px solid var(--line2)',
      }}
    >
      <Link href="/" className="flex items-baseline gap-2.5 no-underline">
        <span className="font-serif text-[21px] font-semibold" style={{ color: 'var(--fg)' }}>
          AltHistory
        </span>
        <span
          className="hidden font-mono text-[10.5px] uppercase tracking-[0.18em] sm:inline"
          style={{ color: 'var(--gold)' }}
        >
          {t.brandTag}
        </span>
      </Link>

      <div className="ml-4 hidden items-center gap-1 md:flex">
        {items.map((it) => {
          const active = pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className="px-3 py-2 font-sans text-sm no-underline"
              style={{ color: active ? 'var(--gold)' : 'var(--fg2)' }}
            >
              {it.label}
            </Link>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div
          className="flex items-center gap-0.5 rounded-lg p-[3px]"
          style={{ border: '1px solid var(--line2)' }}
        >
          {LOCALE_LABELS.map(([code, label]) => (
            <button
              key={code}
              onClick={() => setLocale(code)}
              className="rounded-md px-2.5 py-1 font-mono text-[11px]"
              style={
                locale === code
                  ? { background: 'var(--gold-soft)', color: 'var(--gold)' }
                  : { background: 'none', color: 'var(--fg2)' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="flex h-8 items-center gap-2 rounded-lg px-3 font-mono text-[11px] uppercase tracking-[0.08em]"
          style={{ background: 'var(--card)', border: '1px solid var(--line2)', color: 'var(--fg2)' }}
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: 'var(--gold)' }}
          />
          {theme}
        </button>
      </div>
    </nav>
  );
}
