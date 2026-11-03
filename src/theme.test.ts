import { describe, expect, it } from 'vitest';
import {
  cssVariables,
  decorLayouts,
  endLook,
  palette,
  questionFontSize,
  questionLook,
  startLook,
  transition,
} from './theme';

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

describe('palette', () => {
  it.each(palette.map((p) => [p.bg, p.ink] as const))(
    'ink %s on bg %s has contrast of at least 3:1 (WCAG large text)',
    (bg, ink) => {
      expect(contrast(bg, ink)).toBeGreaterThanOrEqual(3);
    },
  );

  it('uses 6-digit hex colours for bg and ink', () => {
    for (const { bg, ink } of palette) {
      expect(bg).toMatch(/^#[0-9A-F]{6}$/i);
      expect(ink).toMatch(/^#[0-9A-F]{6}$/i);
    }
  });
});

describe('look indexes', () => {
  it('cycles colour and layout by deck position', () => {
    expect(questionLook(0)).toEqual({ colorIndex: 1, layoutIndex: 1 });
    expect(questionLook(5)).toEqual({ colorIndex: 0, layoutIndex: 0 });
    expect(questionLook(6)).toEqual({ colorIndex: 1, layoutIndex: 1 });
  });

  it('keeps fixed card looks inside the palette and layouts', () => {
    for (const look of [startLook, endLook]) {
      expect(palette[look.colorIndex]).toBeDefined();
      expect(decorLayouts[look.layoutIndex]).toBeDefined();
    }
  });

  it('has 2 to 3 decor shapes per layout', () => {
    for (const layout of decorLayouts) {
      expect(layout.length).toBeGreaterThanOrEqual(2);
      expect(layout.length).toBeLessThanOrEqual(3);
    }
  });
});

describe('questionFontSize', () => {
  it('steps down with text length', () => {
    expect(questionFontSize(24)).toBe(42);
    expect(questionFontSize(25)).toBe(36);
    expect(questionFontSize(36)).toBe(36);
    expect(questionFontSize(37)).toBe(32);
  });
});

describe('transition', () => {
  it('matches the spec and reaches the CSS variables', () => {
    expect(transition.durationMs).toBe(380);
    expect(transition.easing).toBe('cubic-bezier(.2, .8, .2, 1)');
    expect(transition.exitScale).toBe(0.95);
    const vars = cssVariables();
    expect(vars['--transition-duration']).toBe('380ms');
    expect(vars['--transition-exit-shift']).toBe('-20%');
  });

  it('keeps the reduced-motion fade short', () => {
    expect(transition.reducedFadeMs).toBeLessThan(transition.durationMs / 2);
  });
});
