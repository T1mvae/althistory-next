'use client';

import Link from 'next/link';
import { Cover } from './Cover';
import { statusStyle } from '@/lib/style';
import { usePrefs } from '@/lib/prefs';
import type { UniverseMeta } from '@/lib/types';

export function UniverseCard({ u }: { u: UniverseMeta }) {
  const { t, locale } = usePrefs();
  const name = u.nameByLocale?.[locale] || u.name;
  const summary = u.summaryByLocale?.[locale] || u.summary;
  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl"
      style={{ background: 'var(--card)', border: '1px solid var(--line2)' }}
    >
      <Link href={`/universes/${u.slug}`} className="no-underline">
        <Cover hue={u.hue} src={u.cover} alt={name} className="aspect-[16/10]">
          <span
            className="absolute left-3.5 top-3 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em]"
            style={statusStyle(u.status)}
          >
            {u.status}
          </span>
          {u.pod && (
            <span className="absolute bottom-3 right-3.5 whitespace-nowrap font-mono text-[10px] tracking-[0.1em] text-white/70">
              {u.pod}
            </span>
          )}
        </Cover>
      </Link>
      <div className="flex flex-1 flex-col p-[18px]">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--gold)' }}>
          {u.type}
          {u.era ? ` · ${u.era}` : ''}
        </div>
        <Link href={`/universes/${u.slug}`} className="no-underline">
          <div className="mb-2 font-serif text-[20px] font-medium" style={{ color: 'var(--fg)' }}>
            {name}
          </div>
        </Link>
        {summary && (
          <div className="mb-3.5 font-sans text-[13px] leading-[1.58]" style={{ color: 'var(--fg2)' }}>
            {summary}
          </div>
        )}
        {u.tags.length > 0 && (
          <div className="mb-4 mt-auto flex flex-wrap gap-1.5">
            {u.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-[5px] px-2 py-[3px] font-mono text-[10px]"
                style={{ color: 'var(--fg2)', border: '1px solid var(--line2)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/universes/${u.slug}`}
          className="self-start font-sans text-[13.5px] font-medium no-underline"
          style={{ color: 'var(--gold)' }}
        >
          {t.u_open} →
        </Link>
      </div>
    </div>
  );
}
