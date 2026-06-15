# AltHistory — Next.js + Notion site

A production site for your AltHistory archive. It reads your **🧩 Вселенные · Universes**
Notion database **live**, renders the landing page, the filterable universe grid, individual
universe pages, a master timeline and the `/portfolio` case study — in 4 languages, with a
dark/parchment theme.

This is the real, deployable version of the design prototype: edit Notion → the site updates.

---

## 0. Requirements

- Node.js 18.18+ (or 20+)
- Your Notion workspace with the **🧩 Вселенные · Universes** database

## 1. Install

```bash
cd althistory-next
npm install
```

## 2. Connect Notion

1. Go to <https://www.notion.so/my-integrations> → **New integration** → name it `AltHistory Site` → copy the **Internal Integration Secret**.
2. Open your **🧩 Вселенные · Universes** database in Notion → top-right **•••** → **Connections** → **Connect to** → pick your integration.
3. Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

```env
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_UNIVERSES_DB_ID=84eb913e738e41b5a36de1bb52146dff   # already yours
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> The database ID is pre-filled for your workspace. If you ever recreate the DB, open it as a
> full page and copy the 32-character hash from the URL.

## 3. Run locally

```bash
npm run dev
# open http://localhost:3000
```

You should immediately see your real universes — the same tags, statuses, regions, eras and
covers that are in Notion. Change something in Notion, refresh (it revalidates hourly, or
restart `dev`) and it appears.

## 4. Deploy to Vercel

1. Push this folder to a GitHub repo.
2. <https://vercel.com> → **Add New → Project** → import the repo.
3. **Settings → Environment Variables** → add `NOTION_TOKEN`, `NOTION_UNIVERSES_DB_ID`,
   `NEXT_PUBLIC_SITE_URL` (your real domain).
4. **Deploy.** Add your custom domain under **Settings → Domains**.

Pages use **ISR** (`revalidate = 3600`), so Notion edits show up within an hour without a
redeploy. Want instant updates? Lower `revalidate`, or add a Notion webhook → Vercel deploy hook.

---

## How it maps to your Notion

### Database properties → site

| Notion property | Type | Used for |
|---|---|---|
| `Name` | Title | universe name / card title |
| `Slug` | Text | the page URL `/universes/<slug>` (auto-generated from Name if blank) |
| `Status` | Select | status badge + filter (Draft / Active / Expanded / Archived) |
| `Type` | Select | genre filter |
| `Era` | Select | era filter |
| `Region` | Multi-select | region filter |
| `Tags` | Multi-select | tag chips + filter |
| `Languages` | Multi-select | language filter + the “Languages” meta line |
| `Featured` | Checkbox | shown on the landing page |
| `Cover` (or page cover) | Files / cover | card & hero image (falls back to the engraved-atlas placeholder) |
| `Last Updated` | Last edited time | “last updated” line |

### Page body → detail sections

The body is parsed by the **🧩 Universe Template** headings. Write freely under each heading and
the site picks it up; empty sections are simply hidden:

- **Point of Divergence / Точка расхождения** → POD section
- **Core Idea / Основная идея** → Core idea
- **Timeline / Хронология** → timeline (bullets as `YEAR — Label — description`)
- **Main States & Factions / Государства и фракции** → factions (`**Name** — note`)
- **Religion, Ideology & Culture / Религия…** → culture
- **Maps & Visuals / Карты** → map placeholders (one caption per bullet)
- **Key Figures & Institutions / Ключевые фигуры** → figures (`**Name** — role`)
- **Current Status & Next Steps / Статус и планы** → next steps
- *(optional)* a **Summary** heading → the short card blurb (otherwise the first sentence of
  the Core Idea is used)

So the workflow is: **duplicate the template page → fill the properties + sections → it appears
on the site.** Exactly what you asked for.

---

## Languages & translation

- UI chrome (nav, headers, buttons) is translated in `lib/i18n.ts` for **EN / RU / PT / UK** —
  switch with the header toggle (stored in `localStorage`).
- Universe **content** comes from Notion as written. Add a `*_en` / `*_ru` field convention or a
  child “Translations” database when you want per-language content (see `ARCHITECTURE.md` in the
  parent folder).
- **Optional machine translation** for missing languages: set `TRANSLATE_PROVIDER=deepl` (or
  `openai`) and the matching API key in `.env.local`, then wire `lib/translate.ts` (stub included
  in the architecture notes) into `getUniverseBySlug`. Manual translations always win over machine.

## Project structure

```
app/
  layout.tsx              fonts, theme, nav, footer
  page.tsx                landing (featured + stats)
  universes/page.tsx      grid (server) + client.tsx (localized header)
  universes/[slug]/       universe detail (generateStaticParams + OG metadata)
  timeline/page.tsx       master timeline
  portfolio/page.tsx      résumé case study (English)
  loading.tsx not-found.tsx
components/                Nav, Footer, Cover, UniverseCard, UniversesExplorer,
                          HomeView, DetailView, TimelineView
lib/
  notion.ts               Notion client + DB id + hue helper
  universes.ts            queries: getUniverses / getUniverseBySlug / getAllSlugs
  parse.ts                page-body → structured sections parser
  mappers (in universes)  Notion properties → typed objects
  i18n.ts                 UI dictionaries (en/ru/pt/uk)
  prefs.tsx               locale + theme context
  style.ts                cover / hero / status gradients
  types.ts                shared types
```

## Notes & next steps

- **Related universes:** add a self-`Relation` property called `Related` in Notion, then map it in
  `lib/universes.ts` (`getUniverseBySlug`) — a one-line addition; left empty in the MVP.
- **Performance:** the listing parses each page body for its summary. With ISR this runs at most
  hourly. If your archive grows past ~50 worlds, add a dedicated `Summary` property and read it
  directly instead of parsing bodies on the list route.
- **For your résumé:** link `/portfolio` — it’s written in English as a project case study.
