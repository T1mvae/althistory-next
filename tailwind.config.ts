import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-spectral)', 'Georgia', 'serif'],
        sans: ['var(--font-plex-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
      colors: {
        // semantic tokens are driven by CSS variables in globals.css
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        card: 'var(--card)',
        line: 'var(--line)',
        line2: 'var(--line2)',
        fg: 'var(--fg)',
        fg2: 'var(--fg2)',
        muted: 'var(--muted)',
        gold: 'var(--gold)',
        goldfg: 'var(--gold-fg)',
        'gold-soft': 'var(--gold-soft)',
      },
    },
  },
  plugins: [],
};

export default config;
