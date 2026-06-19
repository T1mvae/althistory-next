import { Client } from '@notionhq/client';

if (!process.env.NOTION_TOKEN) {
  // Thrown lazily so `next build` of static assets still works without env in CI previews.
  console.warn('[notion] NOTION_TOKEN is not set — Notion requests will fail.');
}

export const notion = new Client({ auth: process.env.NOTION_TOKEN });

/* ---------- Rate-limit-safe request helper ----------
 * The static build fetches every page's full block tree, which can burst past
 * Notion's ~3 req/s public-API limit. We cap concurrency and retry 429s with
 * backoff (honouring the `retry-after` header) so the build paces itself
 * instead of failing. */
const MAX_CONCURRENT = 2;
let active = 0;
const waiters: Array<() => void> = [];

function acquire(): Promise<void> {
  if (active < MAX_CONCURRENT) {
    active++;
    return Promise.resolve();
  }
  return new Promise((resolve) => waiters.push(resolve));
}
function release() {
  const next = waiters.shift();
  if (next) next(); // hand the permit straight to the next waiter
  else active--;
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function notionRequest<T>(fn: () => Promise<T>): Promise<T> {
  await acquire();
  try {
    for (let attempt = 0; ; attempt++) {
      try {
        return await fn();
      } catch (e: any) {
        const rateLimited = e?.code === 'rate_limited' || e?.status === 429;
        if (!rateLimited || attempt >= 8) throw e;
        const retryAfter = Number(e?.headers?.get?.('retry-after')) || 0;
        const backoff = retryAfter > 0 ? retryAfter * 1000 : Math.min(20000, 1000 * 2 ** attempt);
        await sleep(backoff + Math.random() * 400);
      }
    }
  } finally {
    release();
  }
}

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
