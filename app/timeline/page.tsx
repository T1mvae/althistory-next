import { getUniverses, getUniverseBySlug } from '@/lib/universes';
import { TimelineView, type TLItem } from '@/components/TimelineView';

/** Parse a year string like "1929", "1177 BCE", "c. 1177 BCE", "2077 CE" to a sortable number. */
function parseYear(raw: string): number {
  if (!raw) return 0;
  const bce = /bce|до н|b\.?c\.?/i.test(raw);
  const m = raw.match(/\d{1,5}/);
  const n = m ? parseInt(m[0], 10) : 0;
  return bce ? -n : n;
}

export default async function Page() {
  const metas = await getUniverses();
  const details = await Promise.all(metas.map((m) => getUniverseBySlug(m.slug)));

  const events: TLItem[] = [];
  const worlds: { slug: string; name: string; hue: number }[] = [];

  for (const u of details) {
    if (!u) continue;
    if (u.timeline.length) {
      worlds.push({ slug: u.slug, name: u.name, hue: u.hue });
      for (const ev of u.timeline) {
        events.push({
          y: parseYear(ev.year),
          year: ev.year,
          label: ev.label,
          text: ev.text,
          uni: u.name,
          slug: u.slug,
          hue: u.hue,
        });
      }
    }
  }

  return <TimelineView events={events} worlds={worlds} />;
}
