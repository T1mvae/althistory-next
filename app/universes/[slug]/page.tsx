import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllSlugs, getUniverseBySlug } from '@/lib/universes';
import { DetailView } from '@/components/DetailView';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const u = await getUniverseBySlug(params.slug);
  if (!u) return { title: 'Not found' };
  return {
    title: u.name,
    description: u.summary || u.coreIdea || undefined,
    openGraph: {
      title: u.name,
      description: u.summary || u.coreIdea || undefined,
      images: u.cover ? [{ url: u.cover }] : undefined,
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const u = await getUniverseBySlug(params.slug);
  if (!u) notFound();
  return <DetailView u={u} />;
}
