import { getUniverses } from '@/lib/universes';
import { UniversesPageClient } from './client';

export default async function Page() {
  const universes = await getUniverses();
  return <UniversesPageClient universes={universes} />;
}
