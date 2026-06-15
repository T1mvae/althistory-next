import Link from 'next/link';
import { getUniverses } from '@/lib/universes';
import { Cover } from '@/components/Cover';

const tools = [
  'Notion (CMS)',
  'Historical research',
  'Cartography',
  'Timeline design',
  'Next.js / TypeScript',
  'Tailwind CSS',
];
const process = [
  ['1', 'Define the divergence', 'Establish a single, documented point where history changes — and the real constraints around it.'],
  ['2', 'Model the cascade', 'Trace consequences across politics, economy, religion and culture, keeping each step plausible.'],
  ['3', 'Structure the data', 'Normalise every world into the same database schema so it can be filtered, compared and translated.'],
  ['4', 'Document & present', 'Write it up as a navigable archive with timelines, maps and multilingual summaries.'],
];
const skills = [
  ['Research', 'Grounding each premise in real historical conditions.'],
  ['Historical analysis', 'Reasoning about cause, contingency and consequence.'],
  ['Systems thinking', 'Modelling how political, economic and cultural systems interact.'],
  ['Worldbuilding', 'Designing coherent, original settings at scale.'],
  ['Narrative design', 'Turning a model into readable institutions and figures.'],
  ['Database organisation', 'A normalised, queryable, multilingual content schema.'],
  ['Data structuring', 'Consistent fields, statuses, tags and relations.'],
  ['Multilingual presentation', 'Authoring and falling back across several languages.'],
];

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

export default async function Page() {
  const universes = await getUniverses();
  const selected = (universes.filter((u) => u.featured).length
    ? universes.filter((u) => u.featured)
    : universes
  ).slice(0, 3);

  return (
    <div className="ah-fade">
      <section style={{ borderBottom: '1px solid var(--line2)', background: 'var(--bg2)' }}>
        <div className="mx-auto max-w-[920px] px-8 pb-14 pt-16">
          <div className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.2em]" style={{ color: 'var(--gold)' }}>
            Project Case Study
          </div>
          <h1 className="mb-4 font-serif text-[40px] font-medium leading-[1.08] md:text-[46px]" style={{ color: 'var(--fg)' }}>
            AltHistory — worldbuilding as a research &amp; systems-design practice
          </h1>
          <p className="max-w-[660px] font-sans text-[17px] leading-[1.65]" style={{ color: 'var(--fg2)' }}>
            A long-running personal project: a structured archive of alternate-historical worlds, built on a
            Notion content database, historical research, and multilingual documentation.
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-[920px] flex-col gap-11 px-8 pb-8 pt-14">
        <Block label="Overview">
          <p className="font-sans text-[15.5px] leading-[1.74]" style={{ color: 'var(--fg)' }}>
            AltHistory is a collection of internally-consistent alternate timelines. Each world begins from a
            documented point of divergence and is developed through cascading consequences across politics,
            economy, religion and culture — fiction treated as a modelling exercise.
          </p>
        </Block>
        <Block label="My role">
          <p className="font-sans text-[15.5px] leading-[1.74]" style={{ color: 'var(--fg)' }}>
            Sole author and designer: historical research, world logic, the database schema, the multilingual
            content model, and the presentation layer (this site, built with Next.js + Notion).
          </p>
        </Block>
        <Block label="Tools">
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <span key={tool} className="rounded-md px-2.5 py-1.5 font-mono text-[12px]" style={{ color: 'var(--fg)', border: '1px solid var(--line)' }}>
                {tool}
              </span>
            ))}
          </div>
        </Block>
        <Block label="Process">
          <div className="flex flex-col gap-4">
            {process.map(([no, ti, d]) => (
              <div key={no} className="flex gap-4">
                <div className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full font-mono text-[13px]" style={{ border: '1px solid var(--gold)', color: 'var(--gold)' }}>
                  {no}
                </div>
                <div>
                  <div className="mb-1 font-serif text-[18px] font-medium" style={{ color: 'var(--fg)' }}>{ti}</div>
                  <div className="font-sans text-[14px] leading-[1.6]" style={{ color: 'var(--fg2)' }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </Block>
        <Block label="Skills">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl sm:grid-cols-2" style={{ background: 'var(--line2)', border: '1px solid var(--line2)' }}>
            {skills.map(([ti, d]) => (
              <div key={ti} className="p-4" style={{ background: 'var(--card)' }}>
                <div className="mb-1 font-serif text-[16px] font-medium" style={{ color: 'var(--fg)' }}>{ti}</div>
                <div className="font-sans text-[12.5px] leading-[1.5]" style={{ color: 'var(--fg2)' }}>{d}</div>
              </div>
            ))}
          </div>
        </Block>
      </div>

      <section className="mx-auto max-w-[920px] px-8 pb-20 pt-5">
        <div className="pt-11" style={{ borderTop: '1px solid var(--line2)' }}>
          <div className="mb-5 font-mono text-[11.5px] uppercase tracking-[0.2em]" style={{ color: 'var(--gold)' }}>
            Selected universes
          </div>
          <div className="mb-9 grid grid-cols-1 gap-[18px] sm:grid-cols-3">
            {selected.map((u) => (
              <Link key={u.id} href={`/universes/${u.slug}`} className="overflow-hidden rounded-xl no-underline" style={{ background: 'var(--card)', border: '1px solid var(--line2)' }}>
                <Cover hue={u.hue} src={u.cover} alt={u.name} className="aspect-[16/10]" />
                <div className="p-4">
                  <div className="mb-1.5 font-serif text-[17px] font-medium" style={{ color: 'var(--fg)' }}>{u.name}</div>
                  {u.summary && (
                    <div className="font-sans text-[12.5px] leading-[1.5]" style={{ color: 'var(--fg2)' }}>{u.summary}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <Link href="/universes" className="inline-flex h-[46px] items-center gap-2 rounded-[7px] px-6 font-sans text-[14.5px] font-semibold no-underline" style={{ background: 'var(--gold)', color: 'var(--gold-fg)' }}>
            Browse the full archive →
          </Link>
        </div>
      </section>
    </div>
  );
}
