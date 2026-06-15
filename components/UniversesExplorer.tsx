'use client';

import { useMemo, useState } from 'react';
import { UniverseCard } from './UniverseCard';
import { usePrefs } from '@/lib/prefs';
import type { UniverseMeta } from '@/lib/types';

type FilterKey = 'era' | 'genre' | 'status' | 'region' | 'language' | 'tag';

function uniq(xs: string[]): string[] {
  return [...new Set(xs.filter(Boolean))];
}

export function UniversesExplorer({ universes }: { universes: UniverseMeta[] }) {
  const { t } = usePrefs();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    era: '',
    genre: '',
    status: '',
    region: '',
    language: '',
    tag: '',
  });

  const opts = useMemo(
    () => ({
      era: uniq(universes.map((u) => u.era)),
      genre: uniq(universes.map((u) => u.type)),
      status: uniq(universes.map((u) => u.status)),
      region: uniq(universes.flatMap((u) => u.region)),
      language: uniq(universes.flatMap((u) => u.languages)),
      tag: uniq(universes.flatMap((u) => u.tags)),
    }),
    [universes],
  );

  const q = search.trim().toLowerCase();
  const matches = universes.filter((u) => {
    if (filters.era && u.era !== filters.era) return false;
    if (filters.genre && u.type !== filters.genre) return false;
    if (filters.status && u.status !== filters.status) return false;
    if (filters.region && !u.region.includes(filters.region)) return false;
    if (filters.language && !u.languages.includes(filters.language)) return false;
    if (filters.tag && !u.tags.includes(filters.tag)) return false;
    if (q) {
      const hay = `${u.name} ${u.summary} ${u.tags.join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const hasFilters = Object.values(filters).some(Boolean) || !!q;
  const set = (k: FilterKey, v: string) =>
    setFilters((f) => ({ ...f, [k]: f[k] === v ? '' : v }));
  const clear = () => {
    setFilters({ era: '', genre: '', status: '', region: '', language: '', tag: '' });
    setSearch('');
  };

  const rows: [FilterKey, string, string[]][] = [
    ['era', t.f_era, opts.era],
    ['genre', t.f_genre, opts.genre],
    ['status', t.f_status, opts.status],
    ['region', t.f_region, opts.region],
    ['language', t.f_language, opts.language],
    ['tag', t.f_tags, opts.tag],
  ];

  const chip = (active: boolean): React.CSSProperties =>
    active
      ? { background: 'var(--gold-soft)', border: '1px solid var(--gold)', color: 'var(--gold)' }
      : { background: 'transparent', border: '1px solid var(--line2)', color: 'var(--fg2)' };

  return (
    <>
      {/* search */}
      <div className="relative mb-5 max-w-[480px]">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.u_search}
          className="h-[46px] w-full rounded-[9px] px-4 font-sans text-[14.5px] outline-none"
          style={{ background: 'var(--card)', border: '1px solid var(--line2)', color: 'var(--fg)' }}
        />
      </div>

      {/* filters */}
      <div
        className="mb-3.5 rounded-xl px-5 pb-5 pt-[18px]"
        style={{ background: 'var(--card)', border: '1px solid var(--line2)' }}
      >
        {rows.map(([key, label, values]) => (
          <div key={key} className="flex items-start gap-3.5 py-[7px]">
            <div
              className="w-[86px] flex-none pt-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em]"
              style={{ color: 'var(--muted)' }}
            >
              {label}
            </div>
            <div className="flex flex-wrap gap-[7px]">
              <button
                onClick={() => set(key, '')}
                className="rounded-[7px] px-3 py-1.5 font-sans text-[12.5px]"
                style={chip(!filters[key])}
              >
                {t.f_all}
              </button>
              {values.map((v) => (
                <button
                  key={v}
                  onClick={() => set(key, v)}
                  className="rounded-[7px] px-3 py-1.5 font-sans text-[12.5px]"
                  style={chip(filters[key] === v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex min-h-6 items-center justify-between">
        <div className="font-mono text-[12px] tracking-[0.08em]" style={{ color: 'var(--fg2)' }}>
          {matches.length} / {universes.length} {t.u_title.toLowerCase()}
        </div>
        {hasFilters && (
          <button
            onClick={clear}
            className="font-sans text-[13px]"
            style={{ color: 'var(--gold)', background: 'none', border: 'none' }}
          >
            {t.f_clear} ×
          </button>
        )}
      </div>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((u) => (
            <UniverseCard key={u.id} u={u} />
          ))}
        </div>
      ) : (
        <div
          className="rounded-xl py-[70px] text-center"
          style={{ border: '1px dashed var(--line)' }}
        >
          <div className="font-serif text-[20px] italic" style={{ color: 'var(--fg2)' }}>
            {t.u_noresults}
          </div>
        </div>
      )}
    </>
  );
}
