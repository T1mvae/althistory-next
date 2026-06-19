import { notion, notionRequest } from './notion';
import type { TimelineEvent, Faction, Character } from './types';

/**
 * Parses a universe page body into structured sections.
 *
 * It walks the page's blocks, detects each heading_2 from the
 * "🧩 Universe Template", and collects the content beneath it until the
 * next heading. This is what lets you write freely in Notion under the
 * template headings and have the site pick it up.
 */

export interface ParsedBody {
  summary: string;
  podDetail: string;
  coreIdea: string;
  timeline: TimelineEvent[];
  factions: Faction[];
  culture: string;
  maps: string[];
  characters: Character[];
  nextPlans: string;
}

type SectionKey =
  | 'pod'
  | 'core'
  | 'timeline'
  | 'factions'
  | 'culture'
  | 'maps'
  | 'characters'
  | 'next'
  | 'related'
  | 'summary'
  | null;

function classifyHeading(text: string): SectionKey {
  const t = text.toLowerCase();
  if (/summary|кратко|краткое описание/.test(t)) return 'summary';
  if (/point of divergence|точка расхождения/.test(t)) return 'pod';
  if (/core idea|основная идея/.test(t)) return 'core';
  if (/timeline|хронолог/.test(t)) return 'timeline';
  if (/factions|states|государств|фракц/.test(t)) return 'factions';
  if (/culture|religion|ideology|культур|религ|идеолог/.test(t)) return 'culture';
  if (/maps|visuals|карт/.test(t)) return 'maps';
  if (/figures|institutions|характер|фигур|институт/.test(t)) return 'characters';
  if (/next|status|статус|план/.test(t)) return 'next';
  if (/related|связанн/.test(t)) return 'related';
  return null;
}

function richText(arr: any[] | undefined): string {
  if (!arr) return '';
  return arr.map((r) => r.plain_text).join('').trim();
}

/** Strip leading template hint lines (we wrote italic instructions in the template). */
function isHint(text: string): boolean {
  return /^[—\-*]?\s*(скопируй|заполняй|для каждого|один абзац|список|где сейчас|ссылки|это поля)/i.test(
    text,
  );
}

export async function parseUniverseBody(pageId: string): Promise<ParsedBody> {
  const out: ParsedBody = {
    summary: '',
    podDetail: '',
    coreIdea: '',
    timeline: [],
    factions: [],
    culture: '',
    maps: [],
    characters: [],
    nextPlans: '',
  };

  // Collect raw text + bullets grouped per section.
  const para: Record<string, string[]> = {};
  const bullets: Record<string, string[]> = {};
  let current: SectionKey = null;

  let cursor: string | undefined = undefined;
  const blocks: any[] = [];
  do {
    const res: any = await notionRequest(() =>
      notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      }),
    );
    blocks.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);

  for (const b of blocks) {
    if (b.type === 'heading_2' || b.type === 'heading_1' || b.type === 'heading_3') {
      const text = richText(b[b.type]?.rich_text);
      current = classifyHeading(text);
      continue;
    }
    if (!current) continue;

    if (b.type === 'paragraph') {
      const text = richText(b.paragraph.rich_text);
      if (text && !isHint(text)) {
        (para[current] = para[current] || []).push(text);
      }
    } else if (b.type === 'bulleted_list_item' || b.type === 'numbered_list_item') {
      const text = richText(b[b.type].rich_text);
      if (text && !isHint(text)) {
        (bullets[current] = bullets[current] || []).push(text);
      }
    }
  }

  const joinPara = (k: string) => (para[k] || []).join('\n\n').trim();

  out.podDetail = joinPara('pod');
  out.coreIdea = joinPara('core');
  out.culture = joinPara('culture');
  out.nextPlans = joinPara('next');
  out.summary =
    joinPara('summary') ||
    out.coreIdea.split(/(?<=[.!?])\s/)[0] ||
    out.podDetail.split(/(?<=[.!?])\s/)[0] ||
    '';

  // Timeline bullets: "YEAR — Label — text"  (em-dash or hyphen)
  out.timeline = (bullets['timeline'] || []).map((line) => {
    const parts = line.split(/\s+[—–-]\s+/);
    if (parts.length >= 3) {
      return { year: parts[0].trim(), label: parts[1].trim(), text: parts.slice(2).join(' — ').trim() };
    }
    if (parts.length === 2) {
      return { year: parts[0].trim(), label: parts[1].trim(), text: '' };
    }
    return { year: '', label: line.trim(), text: '' };
  });

  // Factions: "**Name** — note"
  out.factions = (bullets['factions'] || []).map((line) => {
    const clean = line.replace(/\*\*/g, '');
    const [name, ...rest] = clean.split(/\s+[—–-]\s+/);
    return { name: name.trim(), note: rest.join(' — ').trim() };
  });

  // Characters: "**Name** — role"
  out.characters = (bullets['characters'] || []).map((line) => {
    const clean = line.replace(/\*\*/g, '');
    const [name, ...rest] = clean.split(/\s+[—–-]\s+/);
    return { name: name.trim(), role: rest.join(' — ').trim() };
  });

  // Maps: each bullet is a caption
  out.maps = (bullets['maps'] || []).map((l) => l.replace(/\*\*/g, '').trim());

  return out;
}
