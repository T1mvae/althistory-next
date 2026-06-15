export default function Loading() {
  return (
    <div className="mx-auto max-w-[1180px] px-8 py-24">
      <div className="font-mono text-[12px] uppercase tracking-[0.2em]" style={{ color: 'var(--gold)' }}>
        Loading archive…
      </div>
      <div className="mt-6 grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="aspect-[16/10] animate-pulse rounded-xl"
            style={{ background: 'var(--card)', border: '1px solid var(--line2)' }}
          />
        ))}
      </div>
    </div>
  );
}
