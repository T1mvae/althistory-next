'use client';

import Link from 'next/link';
import { usePrefs } from '@/lib/prefs';

export function Footer() {
  const { t } = usePrefs();
  return (
    <footer style={{ borderTop: '1px solid var(--line2)', background: 'var(--bg2)' }}>
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-6 px-8 py-10">
        <div>
          <div className="font-serif text-[19px] font-semibold" style={{ color: 'var(--fg)' }}>
            AltHistory
          </div>
          <div className="mt-1 font-sans text-[13px]" style={{ color: 'var(--fg2)' }}>
            {t.foot_tagline}
          </div>
        </div>
        <div className="flex items-center gap-5 font-sans text-[13.5px]" style={{ color: 'var(--fg2)' }}>
          <Link href="/universes" className="no-underline">
            {t.nav_universes}
          </Link>
          <Link href="/portfolio" className="no-underline">
            {t.nav_portfolio}
          </Link>
        </div>
      </div>
    </footer>
  );
}
