'use client';

import { useState } from 'react';
import { usePrefs } from '@/lib/prefs';

export interface TLItem {
  y: number;
  year: string;
  label: string;
  text: string;
  uni: string;
  slug: string;
  hue: number;
}

export function TimelineView({ events, worlds }: { events: TLItem[]; worlds: { slug: string; name: string; hue: number }[] }) {
  const { t } = usePrefs();
  const [off, setOff] = useState<Record<string, boolean>>({});

  const visible = events.filter((e) => !off[e.slug]).sort((a, b) => a.y - b.y);

  return (
    <div className="ah-fade mx-auto max-w-[1080px] px-8 pb-24 pt-14">
      <div className="mb-3.5 font-mono text-[11.5px] uppercase tracking-[0.2em]" style={{ color: 'var(--gold)' }}>
        {t.brandTag}
      </div>
      <h1 className="mb-3 font-serif text-[42px] font-medium" style={{ color: 'var(--fg)' }}>
        {t.tl_title}
      </h1>
      <p className="mb-7 max-w-[640px] font-sans text-[16px] leading-[1.6]" style={{ color: 'var(--fg2)' }}>
        {t.tl_desc}
      </p>

      <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--muted)' }}>
        {t.tl_legend}
      </div>
      <div className="mb-10 flex flex-wrap gap-[9px]">
        {worlds.map((w) => {
          const isOff = off[w.slug];
          return (
            <button
              key={w.slug}
              onClick={() => setOff((o) => ({ ...o, [w.slug]: !o[w.slug] }))}
              className="inline-flex items-center gap-[7px] whitespace-nowrap rounded-full px-3 py-1.5 font-sans text-[12px]"
              style={
                isOff
                  ? { background: 'transparent', border: '1px solid var(--line2)', color: 'var(--muted)', opacity: 0.5 }
                  : { background: 'var(--card)', border: '1px solid var(--line)', color: 'var(--fg)' }
              }
            >
              <span className="inline-block h-[9px] w-[9px] rounded-full" style={{ background: `hsl(${w.hue} 55% 58%)` }} />
              {w.name}
            </button>
          );
        })}
      </div>

      <div className="ml-2" style={{ borderLeft: '2px solid var(--line)' }}>
        {visible.map((ev, i) => (
          <div key={i} className="relative pb-[30px] pl-9">
            <span
              className="absolute left-[-7px] top-[3px] h-3 w-3 rounded-full"
              style={{ background: `hsl(${ev.hue} 55% 58%)`, border: '3px solid var(--bg)' }}
            />
            <div className="mb-1.5 flex flex-wrap items-baseline gap-3.5">
              <span className="font-serif text-[22px] font-medium" style={{ color: 'var(--fg)' }}>
                {ev.year}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: `hsl(${ev.hue} 55% 58%)` }}>
                {ev.uni}
              </span>
            </div>
            <div className="mb-1 font-serif text-[17px]" style={{ color: 'var(--fg)' }}>
              {ev.label}
            </div>
            {ev.text && (
              <div className="max-w-[620px] font-sans text-[13.5px] leading-[1.6]" style={{ color: 'var(--fg2)' }}>
                {ev.text}
              </div>
            )}
          </div>
        ))}
        {visible.length === 0 && (
          <div className="py-10 pl-9 font-serif text-[18px] italic" style={{ color: 'var(--fg2)' }}>
            {t.u_noresults}
          </div>
        )}
      </div>
    </div>
  );
}
