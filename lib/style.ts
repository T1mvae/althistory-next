/** Visual helpers ported from the design prototype. */
import type { CSSProperties } from 'react';

export function coverStyle(hue: number): CSSProperties {
  return {
    backgroundImage: [
      `repeating-linear-gradient(135deg, hsla(${hue},40%,60%,.12) 0 1px, transparent 1px 10px)`,
      `radial-gradient(130% 150% at 82% -25%, hsla(${hue},55%,58%,.45), transparent 58%)`,
      `linear-gradient(158deg, hsl(${hue} 34% 24%), hsl(${(hue + 34) % 360} 30% 13%))`,
    ].join(','),
  };
}

export function heroStyle(hue: number): CSSProperties {
  return {
    backgroundImage: [
      `radial-gradient(120% 130% at 78% -20%, hsla(${hue},55%,55%,.5), transparent 55%)`,
      `linear-gradient(160deg, hsl(${hue} 35% 20%), hsl(${(hue + 30) % 360} 32% 10%))`,
    ].join(','),
  };
}

export function statusStyle(status: string): CSSProperties {
  const map: Record<string, [string, string]> = {
    Active: ['rgba(91,138,114,.18)', '#7fc79e'],
    Expanded: ['rgba(201,164,92,.2)', '#d8b46a'],
    Draft: ['rgba(124,135,159,.2)', '#9fa8c0'],
    Archived: ['rgba(154,106,79,.2)', '#c69076'],
  };
  const [bg, fg] = map[status] || map.Draft;
  return { background: bg, color: fg, border: `1px solid ${bg.replace(/[\d.]+\)$/, '.5)')}` };
}

export function dotColor(hue: number): string {
  return `hsl(${hue} 55% 58%)`;
}
