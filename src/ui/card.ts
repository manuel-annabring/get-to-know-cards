import {
  cssVariables,
  decorLayouts,
  endLook,
  palette,
  questionFontSize,
  questionLook,
  questionText,
  startLook,
  type Corner,
  type DecorShape,
} from '../theme';
import { strings } from './strings';

/** Sets the theme custom properties on the root element. Call once at startup. */
export function applyTheme(root: HTMLElement = document.documentElement): void {
  for (const [name, value] of Object.entries(cssVariables())) {
    root.style.setProperty(name, value);
  }
}

// Ref px to real px: `--u` (styles.css) is one ref px at the current card width.
const ref = (n: number): string => `calc(${n} * var(--u))`;
const corner = (c: Corner): string => (typeof c === 'number' ? ref(c) : c);

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function shapeEl(shape: DecorShape): HTMLElement {
  const node = el('div', shape.ring ? 'card__shape card__shape--ring' : 'card__shape');
  const s = node.style;
  s.width = ref(shape.w);
  s.height = ref(shape.h ?? shape.w);
  s.borderRadius = Array.isArray(shape.radius)
    ? (shape.radius as readonly Corner[]).map(corner).join(' ')
    : corner(shape.radius as Corner);
  if (shape.ring) s.borderWidth = ref(shape.ring);
  if (shape.rot) s.transform = `rotate(${shape.rot}deg)`;
  for (const side of ['top', 'right', 'bottom', 'left'] as const) {
    const offset = shape[side];
    if (offset !== undefined) s[side] = ref(offset);
  }
  return node;
}

function cardEl(colorIndex: number, layoutIndex: number): HTMLElement {
  const colors = palette[colorIndex];
  const layout = decorLayouts[layoutIndex];
  if (!colors || !layout) throw new RangeError('Card look index out of range');

  const card = el('div', 'card');
  card.lang = 'de';
  card.style.setProperty('--card-bg', colors.bg);
  card.style.setProperty('--card-ink', colors.ink);
  card.style.setProperty('--card-tint', colors.tint);

  const decor = el('div', 'card__decor');
  decor.setAttribute('aria-hidden', 'true');
  decor.append(...layout.map(shapeEl));
  card.append(decor);
  return card;
}

function textCard(
  look: { colorIndex: number; layoutIndex: number },
  children: HTMLElement[],
): HTMLElement {
  const card = cardEl(look.colorIndex, look.layoutIndex);
  const body = el('div', 'card__body card__body--text');
  const column = el('div', 'card__column');
  column.append(...children);
  body.append(column);
  card.append(body);
  return card;
}

export function createStartCard(): HTMLElement {
  return textCard(startLook, [
    el('p', 'card__label', strings.startLabel),
    el('h1', 'card__title', strings.startTitle),
    el('p', 'card__hint', strings.startHint),
  ]);
}

export function createEndCard(): HTMLElement {
  return textCard(endLook, [
    el('h1', 'card__title', strings.endTitle),
    el('p', 'card__hint', strings.endHint),
  ]);
}

export interface QuestionCardOptions {
  text: string;
  /** 0-based position in the shuffled deck. */
  position: number;
  total: number;
}

export function createQuestionCard({ text, position, total }: QuestionCardOptions): HTMLElement {
  const look = questionLook(position);
  const card = cardEl(look.colorIndex, look.layoutIndex);

  const body = el('div', 'card__body card__body--question');
  const question = el('p', 'card__question', text);
  question.style.setProperty('--question-size', String(questionFontSize(text.length)));
  body.append(question);

  card.append(body, el('div', 'card__counter', strings.counter(position + 1, total)));
  watchFit(body, question);
  return card;
}

/** Shrinks the question until it fits its box; re-runs when the box is resized. */
function watchFit(body: HTMLElement, question: HTMLElement): void {
  if (typeof ResizeObserver === 'undefined') return;
  new ResizeObserver(() => fitQuestion(body, question)).observe(body);
}

function fitQuestion(body: HTMLElement, question: HTMLElement): void {
  const style = getComputedStyle(body);
  const room = body.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  const fits = (): boolean =>
    question.offsetHeight <= room && question.scrollWidth <= question.clientWidth;

  let fit = 1;
  question.style.setProperty('--fit', String(fit));
  while (!fits() && fit > questionText.minFit) {
    fit *= questionText.fitStep;
    question.style.setProperty('--fit', String(fit));
  }
}
