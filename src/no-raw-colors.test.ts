import { describe, expect, it } from 'vitest';

// Every look value lives in src/theme.ts. This scans all other source files
// (tests excluded) for colour literals so a colour can only be changed in one place.
const sources = import.meta.glob(
  [
    '/src/**/*.{ts,css}',
    '/dev/**/*.{ts,html}',
    '/index.html',
    '!/src/**/*.test.ts',
    '!/src/theme.ts',
  ],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

const colorLiteral = /#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\(/i;

describe('raw colours', () => {
  it('scans the expected files', () => {
    const files = Object.keys(sources);
    expect(files).toContain('/src/styles.css');
    expect(files).toContain('/src/ui/card.ts');
    expect(files).not.toContain('/src/theme.ts');
    // CSS comes back empty unless `test.css` includes it (see vite.config.ts).
    expect(sources['/src/styles.css']).toContain('.card');
  });

  it('keeps colour literals out of everything but theme.ts and tests', () => {
    const offenders = Object.entries(sources)
      .filter(([, text]) => colorLiteral.test(text))
      .map(([file]) => file);
    expect(offenders).toEqual([]);
  });
});
