export type Locale = 'en' | 'ru' | 'pt' | 'uk';

export const LOCALES: Locale[] = ['en', 'ru', 'pt', 'uk'];
export const DEFAULT_LOCALE: Locale = 'en';

export interface TimelineEvent {
  year: string;
  label: string;
  text: string;
}

export interface Faction {
  name: string;
  note: string;
}

export interface Character {
  name: string;
  role: string;
}

/** The lightweight shape used for cards, grids and filters. */
export interface UniverseMeta {
  id: string;
  slug: string;
  name: string;
  status: string;
  type: string;
  era: string;
  region: string[];
  tags: string[];
  languages: string[];
  featured: boolean;
  cover?: string;
  lastUpdated: string;
  /** stable 0-359 hue derived from the slug, drives the cover gradient */
  hue: number;
  /** short blurb shown on cards (parsed from the page body) */
  summary: string;
  pod: string;
}

/** A single styled span of rich text from Notion. */
export interface RichSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  underline?: boolean;
  code?: boolean;
  href?: string;
}

/** A serialisable Notion block (with its children), for faithful rendering. */
export interface BlockNode {
  id: string;
  type: string;
  rich?: RichSpan[];
  children?: BlockNode[];
  imageUrl?: string;
  caption?: RichSpan[];
  language?: string;
  checked?: boolean;
  icon?: string;
  tableWidth?: number;
  cells?: RichSpan[][];
  href?: string;
}

/** The full shape used on a universe detail page — the whole Notion body. */
export interface UniverseDetail extends UniverseMeta {
  body: BlockNode[];
}
