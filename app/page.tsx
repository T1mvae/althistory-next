import { getUniverses } from '@/lib/universes';
import { HomeView } from '@/components/HomeView';

export const revalidate = 3600; // ISR: refresh from Notion hourly

export default async function Page() {
  const universes = await getUniverses();
  const featured = universes.filter((u) => u.featured).slice(0, 3);
  const eraCount = new Set(universes.map((u) => u.era).filter(Boolean)).size;
  return (
    <HomeView
      featured={featured.length ? featured : universes.slice(0, 3)}
      total={universes.length}
      eraCount={eraCount}
    />
  );
}
