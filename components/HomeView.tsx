'use client';

import Link from 'next/link';
import { usePrefs } from '@/lib/prefs';
import { UniverseCard } from './UniverseCard';
import type { UniverseMeta } from '@/lib/types';

export function HomeView({ featured, total, eraCount }: { featured: UniverseMeta[]; total: number; eraCount: number }) {
  const { t } = usePrefs();

  return (
    <div className="ah-fade">
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ borderBottom: '1px solid var(--line2)' }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: 'var(--hero-topo)', opacity: 0.5 }} />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(120% 90% at 78% -10%, var(--gold-glow), transparent 55%)' }}
        />
        <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-14 px-8 py-24 lg:grid-cols-[1.35fr_.9fr]">
          <div>
            <div className="mb-5 font-mono text-[12px] uppercase tracking-[0.22em]" style={{ color: 'var(--gold)' }}>
              {t.hero_kicker}
            </div>
            <h1 className="mb-5 font-serif text-[52px] font-medium leading-[1.04] md:text-[62px]" style={{ color: 'var(--fg)' }}>
              {t.hero_title}
            </h1>
            <p className="mb-5 max-w-[560px] font-serif text-[22px] font-light italic leading-[1.4]" style={{ color: 'var(--gold)' }}>
              {t.hero_tagline}
            </p>
            <p className="mb-8 max-w-[540px] font-sans text-[16.5px] leading-[1.65]" style={{ color: 'var(--fg2)' }}>
              {t.hero_desc}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/universes"
                className="inline-flex h-[46px] items-center gap-2 rounded-[7px] px-6 font-sans text-[14.5px] font-semibold no-underline"
                style={{ background: 'var(--gold)', color: 'var(--gold-fg)' }}
              >
                {t.cta_explore} →
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex h-[46px] items-center rounded-[7px] px-[22px] font-sans text-[14.5px] font-medium no-underline"
                style={{ border: '1px solid var(--line)', color: 'var(--fg)' }}
              >
                {t.cta_portfolio}
              </Link>
            </div>
          </div>
          <div
            className="relative hidden aspect-[3/4] overflow-hidden rounded-xl lg:block"
            style={{ border: '1px solid var(--line)', background: 'linear-gradient(160deg,#1a2336,#0c1322)' }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'repeating-linear-gradient(135deg, rgba(201,164,92,.10) 0 1px, transparent 1px 11px)' }}
            />
            <div className="absolute left-[18px] top-4 font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--gold)' }}>
              Atlas · plate I
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderBottom: '1px solid var(--line2)', background: 'var(--bg2)' }}>
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 px-8 md:grid-cols-3">
          {[
            [String(total), t.nav_universes],
            [String(eraCount), t.f_era],
            ['4', t.d_langs],
          ].map(([num, label]) => (
            <div key={label} className="px-2 py-7" style={{ borderLeft: '1px solid var(--line2)' }}>
              <div className="font-serif text-[38px] font-medium leading-none" style={{ color: 'var(--fg)' }}>
                {num}
              </div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--gold)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-[1180px] px-8 pb-12 pt-20">
        <div className="mb-9 flex items-end justify-between gap-6">
          <div>
            <div className="mb-3 font-mono text-[11.5px] uppercase tracking-[0.2em]" style={{ color: 'var(--gold)' }}>
              {t.home_featured}
            </div>
            <h2 className="font-serif text-[34px] font-medium" style={{ color: 'var(--fg)' }}>
              {t.home_featured_desc}
            </h2>
          </div>
          <Link href="/universes" className="whitespace-nowrap font-sans text-[14px] no-underline" style={{ color: 'var(--gold)' }}>
            {t.u_title} →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((u) => (
            <UniverseCard key={u.id} u={u} />
          ))}
        </div>
      </section>
    </div>
  );
}
