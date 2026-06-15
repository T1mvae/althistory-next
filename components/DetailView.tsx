'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePrefs } from '@/lib/prefs';
import { Cover } from './Cover';
import { statusStyle, heroStyle } from '@/lib/style';
import type { UniverseDetail } from '@/lib/types';

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid grid-cols-1 gap-8 pb-11 md:grid-cols-[200px_1fr]"
      style={{ borderBottom: '1px solid var(--line2)' }}
    >
      <h2 className="pt-1.5 font-mono text-[12px] uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>
        {label}
      </h2>
      <div>{children}</div>
    </div>
  );
}

export function DetailView({ u }: { u: UniverseDetail }) {
  const { t } = usePrefs();
  const [copied, setCopied] = useState(false);

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
      <section className="relative overflow-hidden" style={{ ...heroStyle(u.hue), borderBottom: '1px solid var(--line2)' }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'repeating-linear-gradient(135deg, rgba(201,164,92,.08) 0 1px, transparent 1px 13px)' }}
        />
        <div className="relative mx-auto max-w-[1080px] px-8 pb-14 pt-8">
          <Link href="/universes" className="mb-10 inline-block font-sans text-[13.5px] text-white/80 no-underline">
            ← {t.d_back}
          </Link>
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full px-2.5 py-[5px] font-mono text-[11px] uppercase tracking-[0.1em]" style={statusStyle(u.status)}>
              {u.status}
            </span>
            <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-white/80">{u.type}</span>
          </div>
          <h1 className="mb-4 max-w-[780px] font-serif text-[44px] font-medium leading-[1.05] text-white md:text-[56px]">
            {u.name}
          </h1>
          {u.summary && (
            <p className="mb-7 max-w-[680px] font-serif text-[21px] font-light leading-[1.5] text-white/90">
              {u.summary}
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

      {/* BODY */}
      <div className="mx-auto flex max-w-[1080px] flex-col gap-12 px-8 pb-24 pt-14">
        {u.podDetail && (
          <Section label={t.d_pod}>
            <p className="max-w-[640px] font-sans text-[15.5px] leading-[1.72]" style={{ color: 'var(--fg2)' }}>
              {u.podDetail}
            </p>
          </Section>
        )}

        {u.coreIdea && (
          <Section label={t.d_core}>
            <p className="max-w-[660px] font-serif text-[20px] font-light leading-[1.6]" style={{ color: 'var(--fg)' }}>
              {u.coreIdea}
            </p>
          </Section>
        )}

        {u.timeline.length > 0 && (
          <Section label={t.d_timeline}>
            <div className="flex flex-col gap-6 pl-[26px]" style={{ borderLeft: '1px solid var(--line)' }}>
              {u.timeline.map((ev, i) => (
                <div key={i} className="relative">
                  <span
                    className="absolute left-[-32px] top-1.5 h-[9px] w-[9px] rounded-full"
                    style={{ background: 'var(--gold)', border: '2px solid var(--bg)' }}
                  />
                  {ev.year && (
                    <div className="mb-1.5 font-mono text-[12px] tracking-[0.06em]" style={{ color: 'var(--gold)' }}>
                      {ev.year}
                    </div>
                  )}
                  <div className="mb-1.5 font-serif text-[18px] font-medium" style={{ color: 'var(--fg)' }}>
                    {ev.label}
                  </div>
                  {ev.text && (
                    <div className="max-w-[600px] font-sans text-[14px] leading-[1.62]" style={{ color: 'var(--fg2)' }}>
                      {ev.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {u.factions.length > 0 && (
          <Section label={t.d_factions}>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {u.factions.map((f, i) => (
                <div key={i} className="rounded-[10px] p-4" style={{ background: 'var(--card)', border: '1px solid var(--line2)' }}>
                  <div className="mb-1.5 font-serif text-[17px] font-medium" style={{ color: 'var(--fg)' }}>
                    {f.name}
                  </div>
                  {f.note && (
                    <div className="font-sans text-[13px] leading-[1.55]" style={{ color: 'var(--fg2)' }}>
                      {f.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {u.culture && (
          <Section label={t.d_culture}>
            <p className="max-w-[660px] font-sans text-[15.5px] leading-[1.72]" style={{ color: 'var(--fg2)' }}>
              {u.culture}
            </p>
          </Section>
        )}

        {u.maps.length > 0 && (
          <Section label={t.d_maps}>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {u.maps.map((label, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-[10px]" style={{ ...heroStyle(u.hue), border: '1px solid var(--line)' }}>
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(0deg, rgba(201,164,92,.10) 0 1px, transparent 1px 16px), repeating-linear-gradient(90deg, rgba(201,164,92,.10) 0 1px, transparent 1px 16px)',
                    }}
                  />
                  <div className="absolute bottom-3 left-3.5 right-3.5">
                    <div className="font-serif text-[15px] italic text-white">{label}</div>
                    <div className="mt-1 font-mono text-[10px] tracking-[0.1em] text-white/60">[ map placeholder ]</div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {u.characters.length > 0 && (
          <Section label={t.d_chars}>
            <div className="flex flex-col">
              {u.characters.map((c, i) => (
                <div key={i} className="flex gap-4 py-3.5" style={{ borderBottom: '1px solid var(--line2)' }}>
                  <div className="w-[200px] flex-none font-serif text-[17px]" style={{ color: 'var(--fg)' }}>
                    {c.name}
                  </div>
                  <div className="font-sans text-[14px] leading-[1.55]" style={{ color: 'var(--fg2)' }}>
                    {c.role}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {u.nextPlans && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr]">
            <h2 className="pt-1.5 font-mono text-[12px] uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>
              {t.d_next}
            </h2>
            <div className="rounded-xl p-6" style={{ background: 'var(--gold-soft)', border: '1px solid var(--line)' }}>
              <p className="max-w-[620px] font-sans text-[15px] leading-[1.7]" style={{ color: 'var(--fg)' }}>
                {u.nextPlans}
              </p>
              {u.lastUpdated && (
                <div className="mt-3.5 font-mono text-[11px] tracking-[0.08em]" style={{ color: 'var(--fg2)' }}>
                  {t.d_updated} {new Date(u.lastUpdated).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
