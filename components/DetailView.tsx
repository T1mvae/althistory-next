'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePrefs } from '@/lib/prefs';
import { NotionBlocks } from './NotionBlocks';
import { statusStyle, heroStyle } from '@/lib/style';
import type { UniverseDetail } from '@/lib/types';

export function DetailView({ u }: { u: UniverseDetail }) {
  const { t, locale } = usePrefs();
  const [copied, setCopied] = useState(false);

  const name = u.nameByLocale?.[locale] || u.name;
  const summary = u.summaryByLocale?.[locale] || u.summary || '';
  const body = u.bodyByLocale[locale] || u.bodyByLocale.ru;

  const share = () => {
    try {
      navigator.clipboard?.writeText(window.location.href);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const meta: [string, string][] = [
    [t.d_era, u.era],
    [t.d_region, u.region.join(' · ')],
    [t.d_langs, u.languages.join(' · ')],
  ];

  return (
    <div className="ah-fade">
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ ...heroStyle(u.hue), borderBottom: '1px solid var(--line2)' }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'repeating-linear-gradient(135deg, rgba(201,164,92,.08) 0 1px, transparent 1px 13px)' }}
        />
        <div className="relative mx-auto max-w-[1080px] px-8 pb-14 pt-8">
          <Link href="/universes" className="mb-10 inline-block font-sans text-[13.5px] text-white/80 no-underline">
            ← {t.d_back}
          </Link>
          <div className="mb-4 flex items-center gap-3">
            <span
              className="rounded-full px-2.5 py-[5px] font-mono text-[11px] uppercase tracking-[0.1em]"
              style={statusStyle(u.status)}
            >
              {u.status}
            </span>
            <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-white/80">{u.type}</span>
          </div>
          <h1 className="mb-4 max-w-[780px] font-serif text-[44px] font-medium leading-[1.05] text-white md:text-[56px]">
            {name}
          </h1>
          {summary && (
            <p className="mb-7 max-w-[680px] font-serif text-[21px] font-light leading-[1.5] text-white/90">
              {summary}
            </p>
          )}
          <div className="flex flex-wrap items-end gap-7">
            {meta
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <div key={label}>
                  <div className="mb-[5px] font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">{label}</div>
                  <div className="font-sans text-[14px] text-white">{value}</div>
                </div>
              ))}
            <button
              onClick={share}
              className="ml-auto rounded-[7px] px-4 py-[9px] font-sans text-[13px] text-white"
              style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.25)' }}
            >
              {copied ? `✓ ${t.share}` : t.share}
            </button>
          </div>
        </div>
      </section>

      {/* BODY — the full Notion page, rendered faithfully */}
      <div className="mx-auto max-w-[1080px] px-8 pb-24 pt-12">
        <NotionBlocks blocks={body} />
      </div>
    </div>
  );
}
