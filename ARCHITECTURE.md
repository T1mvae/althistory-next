# AltHistory — Architecture & Notion Integration

This prototype (`AltHistory.dc.html`) is the **presentation layer** — fully designed and interactive. Below is the recommended way to back it with Notion and ship it on Next.js. Keep the MVP small; the schema is what lets you grow later.

---

## 1. Recommended stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** (port the inline styles from the prototype to Tailwind tokens — colors, the Spectral/IBM Plex pairing, the gold accent `#c9a45c`)
- **Notion API** as a headless CMS (`@notionhq/client`)
- **Static generation** (`generateStaticParams` + ISR) so pages are fast and SEO-friendly
- No heavy extra libraries. `next/image`, `next/font`, and the Notion SDK are enough.

```
app/
  layout.tsx                 // fonts, theme provider, <Nav/> <Footer/>
  page.tsx                   // landing
  universes/page.tsx         // grid + filters (client island for filtering)
  universes/[slug]/page.tsx  // detail; generateStaticParams from Notion
  timeline/page.tsx
  portfolio/page.tsx
  [lang]/...                 // optional: locale-prefixed routes
components/
  Nav.tsx  Footer.tsx  LangSwitcher.tsx  ThemeToggle.tsx
  UniverseCard.tsx  FilterBar.tsx  Timeline.tsx  CoverPlaceholder.tsx
lib/
  notion.ts                  // client + queries
  mappers.ts                 // Notion page -> Universe type
  i18n.ts                    // resolve(field, lang) with fallback
  types.ts
```

---

## 2. Notion database schema

One **"Universes"** database. Use Notion property types as noted.

| Property | Notion type | Notes |
|---|---|---|
| `Name` | Title | Internal/default name |
| `Slug` | Rich text | URL key, e.g. `bronze-concord` |
| `Status` | Select | `Draft` / `Active` / `Expanded` / `Archived` |
| `Type` | Select | `Alternate History` / `Sci-Fi` / `Post-Apocalypse` / `Fantasy History` … |
| `Era` | Select | `Antiquity` / `Medieval` / `Early Modern` / `Modern` / `Future` |
| `Region` | Select | e.g. `Eastern Mediterranean` |
| `Tags` | Multi-select | freeform tags |
| `Cover` | Files & media | optional cover image (falls back to generated placeholder) |
| `PointOfDivergence` | Rich text | short label, e.g. `1453 — the walls hold` |
| `Featured` | Checkbox | shows on landing |
| `Languages` | Multi-select | which translations exist: `EN`, `RU`, `PT`, `UK` |
| `LastUpdated` | Last edited time | automatic |
| `Related` | Relation (self) | links to other universes |

### Translatable fields — recommended approach

Don't make a column per language for long content; it bloats the DB. **Two options:**

**A. Suffix columns (simplest, matches your draft).** Good for short fields:
`title_en`, `title_ru`, `title_pt`, `title_uk`, `summary_en`, `summary_ru`, … plus `coreIdea_*`. The mapper builds `{ en, ru, pt, uk }` objects, exactly like the `tr()` helper in this prototype.

**B. Child "Translations" database (cleaner at scale).** A second DB with `Universe` (relation), `Locale` (select), `Title`, `Summary`, `CoreIdea`, `Culture`, `NextPlans` (rich text). One row per (universe × locale). The mapper groups by locale. Long, structured sections (Timeline, Factions, Characters) live as their own small related databases or as structured blocks on the universe's page body.

**Fallback rule (already implemented in the prototype):** `value[lang] || value.en || value.ru || firstAvailable`. Empty sections are hidden, never broken.

### On-site automatic translation (live in the prototype)

The prototype already does **live machine translation** of the Notion content. Behaviour:

- **EN + RU** are author-provided (manual translations win, always).
- **PT + UK** (and any language without a manual translation) are translated **on demand** the first time you switch to them, then **cached in `localStorage`** so they never re-translate. A small "Auto-translation / Tradução automática" badge appears in the header while this happens.
- Cards translate `title + summary` in small batches; opening a universe translates its full body (POD, Core Idea, Timeline, Factions, Culture, …) in one pass.
- The priority chain is: **manual translation (Notion) → machine translation (cache) → original (RU/EN)**. So the day you add a real `title_en` in Notion, it instantly overrides the machine version.

**For the production Next.js site**, move this to the server: at build time (or in an API route), detect fields missing a translation and run them through a translation provider — **Claude, DeepL, or Google Translate** — then store the result back (in Notion, or in a small KV/JSON cache keyed by source-text hash). Same priority chain. This keeps the site fast (no per-visit API calls) and lets you "promote" any machine translation to a reviewed manual one by editing Notion. UI chrome (nav, section headers, buttons) stays in hand-written locale files — only the CMS content is auto-translated.

---

## 3. Data flow

1. `lib/notion.ts` queries the Universes DB (filter `Status != Draft` for public, or show all).
2. `lib/mappers.ts` turns each Notion page into a typed `Universe` object — the same shape the prototype uses (`title`, `summary`, `pod`, `timeline[]`, `factions[]`, `maps[]`, `langs[]`, `hue`, …).
3. Pages are statically generated; `revalidate: 3600` (ISR) picks up Notion edits hourly.
4. The filter/search UI is a small **client component** that filters the already-fetched list (same logic as `renderVals` here) — no API calls on the client.

---

## 4. `.env.local`

```
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxx
NOTION_UNIVERSES_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://althistory.yourname.dev
```

Never commit `.env.local`. On Vercel, set the same vars in **Project → Settings → Environment Variables**.

---

## 5. Connect Notion

1. notion.so/my-integrations → **New integration** → copy the token into `NOTION_TOKEN`.
2. Open your Universes database → **•••  → Connections → Add** your integration.
3. Copy the database ID from its URL (the 32-char hash) into `NOTION_UNIVERSES_DB_ID`.
4. `npm i @notionhq/client`.

---

## 6. Run locally

```
npm install
npm run dev      # http://localhost:3000
```

## 7. Deploy to Vercel

1. Push to GitHub.
2. vercel.com → **Add New → Project** → import the repo.
3. Add the env vars from step 4.
4. Deploy. Add your custom domain under **Settings → Domains**.
5. SEO/OG: set `metadata` per page (`title`, `description`, `openGraph.images`) so links preview well in Telegram/LinkedIn.

---

## 8. Putting it on your résumé

- **Title:** *AltHistory — Worldbuilding & Research Archive (personal project)*
- **One-liner:** "Designed and built a multilingual, Notion-backed archive of 8 internally-consistent alternate-history worlds; Next.js + TypeScript + Tailwind."
- Link to **`/portfolio`** specifically — it's written in English as a project case study (Overview → Problem → Role → Tools → Process → Results → Skills).
- Skills to claim, all evidenced by the site: research, historical analysis, **systems thinking**, worldbuilding, narrative design, **data structuring / database design**, information architecture, multilingual content modelling, visual/UI design.
- Frame it as **applied analytical work**, not a hobby: a normalized content model, a fallback-aware i18n system, and a documented research method.
