'use client';

import { usePrefs } from '@/lib/prefs';
import { UniversesExplorer } from '@/components/UniversesExplorer';
import type { UniverseMeta } from '@/lib/types';

export function UniversesPageClient({ universes }: { universes: UniverseMeta[] }) {
  const { t } = usePrefs();
  return (
    <div className="ah-fade mx-auto max-w-[1180px] px-8 pb-24 pt-14">
      <div className="mb-3.5 font-mono text-[11.5px] uppercase tracking-[0.2em]" style={{ color: 'var(--gold)' }}>
        {t.brandTag}
      </div>
      <h1 className="mb-3 font-serif text-[42px] font-medium" style={{ color: 'var(--fg)' }}>
        {t.u_title}
      </h1>
      <p className="mb-8 max-w-[620px] font-sans text-[16px] leading-[1.6]" style={{ color: 'var(--fg2)' }}>
        {t.u_desc}
      </p>
      <UniversesExplorer universes={universes} />
    </div>
  );
}
