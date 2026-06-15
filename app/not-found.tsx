import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[920px] px-8 py-32 text-center">
      <div className="mb-4 font-mono text-[12px] uppercase tracking-[0.2em]" style={{ color: 'var(--gold)' }}>
        404
      </div>
      <h1 className="mb-5 font-serif text-[40px] font-medium" style={{ color: 'var(--fg)' }}>
        This universe hasn’t been written yet.
      </h1>
      <Link
        href="/universes"
        className="inline-flex h-[46px] items-center rounded-[7px] px-6 font-sans text-[14.5px] font-semibold no-underline"
        style={{ background: 'var(--gold)', color: 'var(--gold-fg)' }}
      >
        Back to the archive
      </Link>
    </div>
  );
}
