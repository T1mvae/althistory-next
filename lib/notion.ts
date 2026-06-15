import { Client } from '@notionhq/client';

if (!process.env.NOTION_TOKEN) {
  // Thrown lazily so `next build` of static assets still works without env in CI previews.
  console.warn('[notion] NOTION_TOKEN is not set — Notion requests will fail.');
}

export const notion = new Client({ auth: process.env.NOTION_TOKEN });

export const UNIVERSES_DB_ID = (
  process.env.NOTION_UNIVERSES_DB_ID || ''
).replace(/-/g, '');

/** Stable hue (0–359) from a slug so each world keeps the same cover colour. */
export function hueFromSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) % 360;
  }
  return h;
}
