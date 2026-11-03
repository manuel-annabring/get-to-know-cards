import { describe, expect, it } from 'vitest';
import { palette } from './theme';

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

// The browser reads <meta name="theme-color"> before any script runs, so it has to be literal
// in index.html. The next test pins it to the palette instead.
const themeColorMeta = /<meta\s+name="theme-color"\s+content="([^"]*)"\s*\/?>/;

function withoutThemeColor(html: string): string {
  return html.replace(themeColorMeta, '');
}

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
      .filter(([file, text]) =>
        colorLiteral.test(file === '/index.html' ? withoutThemeColor(text) : text),
      )
      .map(([file]) => file);
    expect(offenders).toEqual([]);
  });

  it('sets the theme-color in index.html to the first palette colour', () => {
    const match = themeColorMeta.exec(sources['/index.html'] ?? '');
    expect(match?.[1]).toBe(palette[0]?.bg);
  });
});
