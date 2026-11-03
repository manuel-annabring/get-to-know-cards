import { describe, expect, it } from 'vitest';

// src/deck/ is pure logic: it must not reach into src/ui/ or touch the DOM.
const sources = import.meta.glob(['/src/deck/**/*.ts', '!/src/deck/**/*.test.ts'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const importSpecifier = /(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g;
const domGlobal = /\b(?:document|window|navigator|localStorage|sessionStorage|HTMLElement)\b/;

describe('src/deck is pure logic', () => {
  it('scans the expected files', () => {
    const files = Object.keys(sources);
    expect(files).toContain('/src/deck/buildDeck.ts');
    expect(files).toContain('/src/deck/game.ts');
  });

  it('imports nothing from src/ui', () => {
    const offenders = Object.entries(sources).flatMap(([file, text]) =>
      [...text.matchAll(importSpecifier)]
        .map((match) => match[1] ?? '')
        .filter((specifier) => /(^|\/)ui(\/|$)/.test(specifier))
        .map((specifier) => `${file}: ${specifier}`),
    );
    expect(offenders).toEqual([]);
  });

  it('uses no DOM globals', () => {
    const offenders = Object.entries(sources)
      .filter(([, text]) => domGlobal.test(text))
      .map(([file]) => file);
    expect(offenders).toEqual([]);
  });
});
