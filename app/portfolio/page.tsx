import { getUniverses } from '@/lib/universes';
import { translateBatch, saveCache } from '@/lib/translate';
import { PortfolioView, type PortfolioContent } from '@/components/PortfolioView';
import type { Locale } from '@/lib/types';

const EN: PortfolioContent = {
  kicker: 'Project Case Study',
  title: 'AltHistory — worldbuilding as a research & systems-design practice',
  intro:
    'A long-running personal project: a structured archive of alternate-historical worlds, built on a Notion content database, historical research, and multilingual documentation.',
  overview: {
    label: 'Overview',
    text: 'AltHistory is a collection of internally-consistent alternate timelines. Each world begins from a documented point of divergence and is developed through cascading consequences across politics, economy, religion and culture — fiction treated as a modelling exercise.',
  },
  role: {
    label: 'My role',
    text: 'Sole author and designer: historical research, world logic, the database schema, the multilingual content model, and the presentation layer (this site, built with Next.js + Notion).',
  },
  toolsLabel: 'Tools',
  tools: ['Notion (CMS)', 'Historical research', 'Cartography', 'Timeline design', 'Next.js / TypeScript', 'Tailwind CSS'],
  processLabel: 'Process',
  process: [
    { title: 'Define the divergence', desc: 'Establish a single, documented point where history changes — and the real constraints around it.' },
    { title: 'Model the cascade', desc: 'Trace consequences across politics, economy, religion and culture, keeping each step plausible.' },
    { title: 'Structure the data', desc: 'Normalise every world into the same database schema so it can be filtered, compared and translated.' },
    { title: 'Document & present', desc: 'Write it up as a navigable archive with timelines, maps and multilingual summaries.' },
  ],
  skillsLabel: 'Skills',
  skills: [
    { title: 'Research', desc: 'Grounding each premise in real historical conditions.' },
    { title: 'Historical analysis', desc: 'Reasoning about cause, contingency and consequence.' },
    { title: 'Systems thinking', desc: 'Modelling how political, economic and cultural systems interact.' },
    { title: 'Worldbuilding', desc: 'Designing coherent, original settings at scale.' },
    { title: 'Narrative design', desc: 'Turning a model into readable institutions and figures.' },
    { title: 'Database organisation', desc: 'A normalised, queryable, multilingual content schema.' },
    { title: 'Data structuring', desc: 'Consistent fields, statuses, tags and relations.' },
    { title: 'Multilingual presentation', desc: 'Authoring and falling back across several languages.' },
  ],
  selectedLabel: 'Selected universes',
  cta: 'Browse the full archive →',
};

/** Translate the fixed case-study copy into a locale (tools stay in English). */
async function localize(locale: Locale): Promise<PortfolioContent> {
  if (locale === 'en') return EN;
  const flat = [
    EN.kicker,
    EN.title,
    EN.intro,
    EN.overview.label,
    EN.overview.text,
    EN.role.label,
    EN.role.text,
    EN.toolsLabel,
    EN.processLabel,
    ...EN.process.flatMap((p) => [p.title, p.desc]),
    EN.skillsLabel,
    ...EN.skills.flatMap((s) => [s.title, s.desc]),
    EN.selectedLabel,
    EN.cta,
  ];
  const tr = await translateBatch(flat, locale);
  let i = 0;
  const n = () => tr[i++];
  return {
    kicker: n(),
    title: n(),
    intro: n(),
    overview: { label: n(), text: n() },
    role: { label: n(), text: n() },
    toolsLabel: n(),
    tools: EN.tools,
    processLabel: n(),
    process: EN.process.map(() => ({ title: n(), desc: n() })),
    skillsLabel: n(),
    skills: EN.skills.map(() => ({ title: n(), desc: n() })),
    selectedLabel: n(),
    cta: n(),
  };
}

export default async function Page() {
  const universes = await getUniverses();
  const selected = (
    universes.filter((u) => u.featured).length ? universes.filter((u) => u.featured) : universes
  ).slice(0, 3);

  const content: Record<Locale, PortfolioContent> = {
    en: EN,
    ru: await localize('ru'),
    pt: await localize('pt'),
    uk: await localize('uk'),
  };
  saveCache();

  return <PortfolioView content={content} selected={selected} />;
}
