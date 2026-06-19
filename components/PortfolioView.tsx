'use client';

import Link from 'next/link';
import { Cover } from './Cover';
import { usePrefs } from '@/lib/prefs';
import type { Locale, UniverseMeta } from '@/lib/types';

export interface PortfolioContent {
  kicker: string;
  title: string;
  intro: string;
  overview: { label: string; text: string };
  role: { label: string; text: string };
  toolsLabel: string;
  tools: string[];
  processLabel: string;
  process: { title: string; desc: string }[];
  skillsLabel: string;
  skills: { title: string; desc: string }[];
  selectedLabel: string;
  cta: string;
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-[180px_1fr]">
      <h2 className="font-mono text-[12px] uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>
        {label}
      </h2>
      <div>{children}</div>
    </div>
  );
}

export function PortfolioView({
  content,
  selected,
}: {
  content: Record<Locale, PortfolioContent>;
  selected: UniverseMeta[];
}) {
  const { locale } = usePrefs();
  const c = content[locale] || content.en;

  return (
    <div className="ah-fade">
      <section style={{ borderBottom: '1px solid var(--line2)', background: 'var(--bg2)' }}>
        <div className="mx-auto max-w-[920px] px-8 pb-14 pt-16">
          <div className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.2em]" style={{ color: 'var(--gold)' }}>
            {c.kicker}
          </div>
          <h1 className="mb-4 font-serif text-[40px] font-medium leading-[1.08] md:text-[46px]" style={{ color: 'var(--fg)' }}>
            {c.title}
          </h1>
          <p className="max-w-[660px] font-sans text-[17px] leading-[1.65]" style={{ color: 'var(--fg2)' }}>
            {c.intro}
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-[920px] flex-col gap-11 px-8 pb-8 pt-14">
        <Block label={c.overview.label}>
          <p className="font-sans text-[15.5px] leading-[1.74]" style={{ color: 'var(--fg)' }}>{c.overview.text}</p>
        </Block>
        <Block label={c.role.label}>
          <p className="font-sans text-[15.5px] leading-[1.74]" style={{ color: 'var(--fg)' }}>{c.role.text}</p>
        </Block>
        <Block label={c.toolsLabel}>
          <div className="flex flex-wrap gap-2">
            {c.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-md px-2.5 py-1.5 font-mono text-[12px]"
                style={{ color: 'var(--fg)', border: '1px solid var(--line)' }}
              >
                {tool}
              </span>
            ))}
          </div>
        </Block>
        <Block label={c.processLabel}>
          <div className="flex flex-col gap-4">
            {c.process.map((p, i) => (
              <div key={i} className="flex gap-4">
                <div
                  className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full font-mono text-[13px]"
                  style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }}
                >
                  {i + 1}
                </div>
                <div>
                  <div className="mb-1 font-serif text-[18px] font-medium" style={{ color: 'var(--fg)' }}>{p.title}</div>
                  <div className="font-sans text-[14px] leading-[1.6]" style={{ color: 'var(--fg2)' }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Block>
        <Block label={c.skillsLabel}>
          <div
            className="grid grid-cols-1 gap-px overflow-hidden rounded-xl sm:grid-cols-2"
            style={{ background: 'var(--line2)', border: '1px solid var(--line2)' }}
          >
            {c.skills.map((s, i) => (
              <div key={i} className="p-4" style={{ background: 'var(--card)' }}>
                <div className="mb-1 font-serif text-[16px] font-medium" style={{ color: 'var(--fg)' }}>{s.title}</div>
                <div className="font-sans text-[12.5px] leading-[1.5]" style={{ color: 'var(--fg2)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </Block>
      </div>

      <section className="mx-auto max-w-[920px] px-8 pb-20 pt-5">
        <div className="pt-11" style={{ borderTop: '1px solid var(--line2)' }}>
          <div className="mb-5 font-mono text-[11.5px] uppercase tracking-[0.2em]" style={{ color: 'var(--gold)' }}>
            {c.selectedLabel}
          </div>
          <div className="mb-9 grid grid-cols-1 gap-[18px] sm:grid-cols-3">
            {selected.map((u) => {
              const nm = u.nameByLocale?.[locale] || u.name;
              const sm = u.summaryByLocale?.[locale] || u.summary;
              return (
                <Link
                  key={u.id}
                  href={`/universes/${u.slug}`}
                  className="overflow-hidden rounded-xl no-underline"
                  style={{ background: 'var(--card)', border: '1px solid var(--line2)' }}
                >
                  <Cover hue={u.hue} src={u.cover} alt={nm} className="aspect-[16/10]" />
                  <div className="p-4">
                    <div className="mb-1.5 font-serif text-[17px] font-medium" style={{ color: 'var(--fg)' }}>{nm}</div>
                    {sm && <div className="font-sans text-[12.5px] leading-[1.5]" style={{ color: 'var(--fg2)' }}>{sm}</div>}
                  </div>
                </Link>
              );
            })}
          </div>
          <Link
            href="/universes"
            className="inline-flex h-[46px] items-center gap-2 rounded-[7px] px-6 font-sans text-[14.5px] font-semibold no-underline"
            style={{ background: 'var(--gold)', color: 'var(--gold-fg)' }}
          >
            {c.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
