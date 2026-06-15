import { getUniverses } from '@/lib/universes';
import { UniversesPageClient } from './client';

export const revalidate = 3600;

export default async function Page() {
  const universes = await getUniverses();
  return <UniversesPageClient universes={universes} />;
}
