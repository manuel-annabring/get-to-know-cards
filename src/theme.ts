/**
 * Every tweakable look value lives here. Components and CSS read these through
 * `cssVariables()` (custom properties set at startup) and never hold raw
 * colours, pixel sizes or timings of their own.
 *
 * Sizes marked "ref px" are measured on the mockup card (`referenceCard`) and
 * scale with the real card width, so the card looks the same at every size.
 */

export interface CardColors {
  /** Card background. */
  readonly bg: string;
  /** Text colour. */
  readonly ink: string;
  /** Decor shape tint. */
  readonly tint: string;
}

/** Palette "Bonbon". Order matters: the card colour follows the deck position. */
export const palette: readonly CardColors[] = [
  { bg: '#F0543C', ink: '#FFFFFF', tint: 'rgba(255, 255, 255, 0.2)' },
  { bg: '#FFB627', ink: '#2A1650', tint: 'rgba(42, 22, 80, 0.1)' },
  { bg: '#0E9F8E', ink: '#FFFFFF', tint: 'rgba(255, 255, 255, 0.2)' },
  { bg: '#6C4BE8', ink: '#FFFFFF', tint: 'rgba(255, 255, 255, 0.2)' },
  { bg: '#E8387F', ink: '#FFFFFF', tint: 'rgba(255, 255, 255, 0.2)' },
  { bg: '#2F6FED', ink: '#FFFFFF', tint: 'rgba(255, 255, 255, 0.2)' },
];

export const pageBackground = '#FFF6EA';

export const font = {
  /** Family name registered by `@fontsource-variable/fredoka`. */
  family: "'Fredoka Variable', system-ui, sans-serif",
  weight: 700,
  letterSpacing: '-0.01em',
  lineHeight: 1.12,
} as const;

/** The agreed mockup card. All "ref px" values below are measured on it. */
export const referenceCard = { width: 280, height: 520 } as const;

export const cardLayout = {
  /** Card corner radius in real px (not scaled). */
  radius: 30,
  /** Gap between card and viewport edge on phones, real px. */
  margin: 12,
  /** Maximum card width on wide screens, real px. */
  maxWidth: 420,
} as const;

export const questionText = {
  /** Left/right padding, ref px. */
  paddingX: 26,
  /** Top/bottom padding, ref px. Symmetric, so it keeps the text centred and clear of the counter. */
  paddingY: 52,
  /** First step whose `maxChars` is not exceeded wins; `fallbackSize` is used above all steps. */
  sizeSteps: [
    { maxChars: 24, size: 42 },
    { maxChars: 36, size: 36 },
  ],
  fallbackSize: 32,
  /** Overflow protection: shrink by this factor per step, never below `minFit`. */
  fitStep: 0.94,
  minFit: 0.4,
} as const;

export const counter = { size: 13, bottom: 20 } as const;

export const startCard = {
  labelSize: 14,
  titleSize: 46,
  hintSize: 15,
  hintGap: 22,
  paddingX: 26,
} as const;

/** Colour and decor layout indexes of the fixed cards. */
export const startLook = { colorIndex: 0, layoutIndex: 0 } as const;
export const endLook = { colorIndex: 2, layoutIndex: 3 } as const;

/** Card change. Slide in from the right; the old card moves left and shrinks while it is covered. */
export const transition = {
  durationMs: 380,
  easing: 'cubic-bezier(.2, .8, .2, 1)',
  /** The new card starts this far right of its resting place, in percent of the card width (plus the margin). */
  enterFrom: 100,
  /** The old card moves left by this share of its width, in percent. */
  exitShift: -20,
  exitScale: 0.95,
  /** `prefers-reduced-motion: reduce`: a short crossfade instead of the slide. */
  reducedFadeMs: 150,
  /** The lock is released this long after the nominal end even if no animation event arrives. */
  fallbackSlackMs: 120,
} as const;

/** Corner radius: ref px, or a percentage of the shape. */
export type Corner = number | `${number}%`;

/** A decor shape. Sizes and offsets are ref px; `rot` is degrees; `ring` is a border width. */
export interface DecorShape {
  readonly w: number;
  /** Defaults to `w`. */
  readonly h?: number;
  readonly radius: Corner | readonly [Corner, Corner, Corner, Corner];
  readonly rot?: number;
  readonly ring?: number;
  readonly top?: number;
  readonly right?: number;
  readonly bottom?: number;
  readonly left?: number;
}

/** Six layouts, cycled by deck position. */
export const decorLayouts: readonly (readonly DecorShape[])[] = [
  [
    { w: 190, radius: '50%', top: -60, right: -60 },
    { w: 130, radius: [0, '100%', 0, 0], left: 0, bottom: 0 },
  ],
  [
    { w: 160, radius: '50%', ring: 26, top: 40, left: -50 },
    { w: 96, radius: '50%', right: 34, bottom: 44 },
  ],
  [
    { w: 220, h: 110, radius: [220, 220, 0, 0], right: -30, bottom: 0 },
    { w: 84, radius: '26%', rot: 20, top: 34, right: 34 },
  ],
  [
    { w: 150, radius: [0, 0, '100%', 0], left: 0, top: 0 },
    { w: 64, radius: '50%', left: 44, bottom: 70 },
    { w: 120, radius: '50%', right: -40, bottom: -30 },
  ],
  [
    { w: 240, radius: '50%', left: -70, bottom: -100 },
    { w: 76, radius: '50%', ring: 16, top: 40, right: 36 },
  ],
  [
    { w: 130, radius: '30%', rot: 15, top: -30, left: -30 },
    { w: 110, h: 220, radius: [220, 0, 0, 220], right: 0, bottom: 70 },
  ],
];

/** Colour and layout index of the question card at a 0-based deck position. */
export function questionLook(position: number): { colorIndex: number; layoutIndex: number } {
  return {
    colorIndex: (position + 1) % palette.length,
    layoutIndex: (position + 1) % decorLayouts.length,
  };
}

/** Question font size in ref px for a text of the given length. */
export function questionFontSize(chars: number): number {
  const step = questionText.sizeSteps.find((s) => chars <= s.maxChars);
  return step ? step.size : questionText.fallbackSize;
}

/** Custom properties for the document root. Unitless ones are ref px (see `--u` in styles.css). */
export function cssVariables(): Record<string, string> {
  return {
    '--page-bg': pageBackground,
    '--font-family': font.family,
    '--font-weight': String(font.weight),
    '--letter-spacing': font.letterSpacing,
    '--line-height': String(font.lineHeight),
    '--ref-width': String(referenceCard.width),
    '--ref-height': String(referenceCard.height),
    '--card-radius': `${cardLayout.radius}px`,
    '--card-margin': `${cardLayout.margin}px`,
    '--card-max-width': `${cardLayout.maxWidth}px`,
    '--question-pad-x': String(questionText.paddingX),
    '--question-pad-y': String(questionText.paddingY),
    '--counter-size': String(counter.size),
    '--counter-bottom': String(counter.bottom),
    '--start-pad-x': String(startCard.paddingX),
    '--start-label-size': String(startCard.labelSize),
    '--start-title-size': String(startCard.titleSize),
    '--start-hint-size': String(startCard.hintSize),
    '--start-hint-gap': String(startCard.hintGap),
    '--transition-duration': `${transition.durationMs}ms`,
    '--transition-easing': transition.easing,
    '--transition-enter-from': `${transition.enterFrom}%`,
    '--transition-exit-shift': `${transition.exitShift}%`,
    '--transition-exit-scale': String(transition.exitScale),
    '--transition-fade-duration': `${transition.reducedFadeMs}ms`,
  };
}
