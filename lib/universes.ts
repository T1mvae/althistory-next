import { notion, UNIVERSES_DB_ID, hueFromSlug } from './notion';
import { parseUniverseBody } from './parse';
import { fetchBlockTree } from './notionBlocks';
import { localizeTree, translateString, saveCache } from './translate';
import type { UniverseMeta, UniverseDetail, Locale, BlockNode } from './types';

/* ---------- Notion property readers ---------- */

function readTitle(p: any): string {
  return (p?.title || []).map((t: any) => t.plain_text).join('').trim();
}
function readText(p: any): string {
  return (p?.rich_text || []).map((t: any) => t.plain_text).join('').trim();
}
function readSelect(p: any): string {
  return p?.select?.name || '';
}
function readMulti(p: any): string[] {
  return (p?.multi_select || []).map((s: any) => s.name);
}
function readCheckbox(p: any): boolean {
  return !!p?.checkbox;
}
function readDate(p: any): string {
  return p?.last_edited_time || p?.date?.start || '';
}
function readCover(page: any): string | undefined {
  // Prefer the page cover; fall back to a "Cover" files property.
  const c = page.cover;
  if (c?.type === 'external') return c.external.url;
  if (c?.type === 'file') return c.file.url;
  const filesProp = page.properties?.Cover?.files?.[0];
  if (filesProp?.type === 'external') return filesProp.external.url;
  if (filesProp?.type === 'file') return filesProp.file.url;
  return undefined;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9а-яёіїєґ]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function toMeta(page: any): UniverseMeta {
  const props = page.properties || {};
  const name = readTitle(props.Name);
  const slug = readText(props.Slug) || slugify(name) || page.id;
  return {
    id: page.id,
    slug,
    name,
    status: readSelect(props.Status) || 'Draft',
    type: readSelect(props.Type) || 'Alternate History',
    era: readSelect(props.Era) || '',
    region: readMulti(props.Region),
    tags: readMulti(props.Tags),
    languages: readMulti(props.Languages),
    featured: readCheckbox(props.Featured),
    cover: readCover(page),
    lastUpdated: readDate(props['Last Updated']) || page.last_edited_time || '',
    hue: hueFromSlug(slug),
    summary: '',
    pod: '',
  };
}

/* ---------- Public queries ---------- */

let _cache: { at: number; metas: UniverseMeta[] } | null = null;
const TTL = 60 * 1000; // 1 min in-process cache (ISR handles the real caching)

export async function getUniverses(): Promise<UniverseMeta[]> {
  if (_cache && Date.now() - _cache.at < TTL) return _cache.metas;

  const results: any[] = [];
  let cursor: string | undefined = undefined;
  do {
    const res: any = await notion.databases.query({
      database_id: UNIVERSES_DB_ID,
      page_size: 100,
      start_cursor: cursor,
      sorts: [{ property: 'Last Updated', direction: 'descending' }],
    });
    results.push(...res.results);
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);

  const metas = results.map(toMeta);

  // Pull a short summary + POD for each card from the page body (parallel, capped).
  await Promise.all(
    metas.map(async (m) => {
      try {
        const body = await parseUniverseBody(m.id);
        m.summary = body.summary;
        m.pod = body.timeline[0]?.year ? body.timeline[0].year : '';
        if (!m.pod) {
          // try first line of POD section as a short label
          m.pod = (body.podDetail.split('\n')[0] || '').slice(0, 48);
        }
      } catch {
        /* ignore per-row body errors */
      }
    }),
  );

  _cache = { at: Date.now(), metas };
  return metas;
}

export async function getAllSlugs(): Promise<string[]> {
  const metas = await getUniverses();
  return metas.map((m) => m.slug);
}

export async function getUniverseBySlug(slug: string): Promise<UniverseDetail | null> {
  const metas = await getUniverses();
  const meta = metas.find((m) => m.slug === slug);
  if (!meta) return null;

  // Render the whole Notion page faithfully (all blocks, nested children, images).
  const source = await fetchBlockTree(meta.id);

  // Localize body + hero summary into the other languages (cached; a no-op
  // unless translation is enabled, i.e. in CI).
  const bodyByLocale: Record<Locale, BlockNode[]> = {
    ru: source,
    en: await localizeTree(source, 'en'),
    pt: await localizeTree(source, 'pt'),
    uk: await localizeTree(source, 'uk'),
  };
  const sum = meta.summary;
  const summaryByLocale: Record<Locale, string> = {
    ru: sum,
    en: await translateString(sum, 'en'),
    pt: await translateString(sum, 'pt'),
    uk: await translateString(sum, 'uk'),
  };
  saveCache();

  return { ...meta, bodyByLocale, summaryByLocale };
}
