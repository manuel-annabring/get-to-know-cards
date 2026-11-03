import { describe, expect, it } from 'vitest';
import type { QuestionGroup } from '../content/types';
import { advance, initialState, mulberry32 } from '../deck';
import { announcement, cardSpec, isAdvanceKey, step, type KeyLike } from './flow';

const groups: QuestionGroup[] = [
  { id: 'a', questions: ['A1?', 'A2?'] },
  { id: 'b', questions: ['B1?'] },
];

const key = (k: string, extra: Partial<KeyLike> = {}): KeyLike => ({
  key: k,
  repeat: false,
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  ...extra,
});

describe('cardSpec', () => {
  it('maps every phase of a full game to a card', () => {
    const rng = mulberry32(1);
    let state = initialState();
    const kinds: string[] = [cardSpec(state).kind];
    const counters: string[] = [];
    for (let i = 0; i < 5; i++) {
      state = advance(state, groups, rng);
      const spec = cardSpec(state);
      kinds.push(spec.kind);
      if (spec.kind === 'question') counters.push(`${spec.position + 1}/${spec.total}`);
    }
    expect(kinds).toEqual(['start', 'question', 'question', 'question', 'end', 'question']);
    expect(counters).toEqual(['1/3', '2/3', '3/3', '1/3']);
  });

  it('carries the text of the current card', () => {
    const state = advance(initialState(), groups, mulberry32(2));
    const spec = cardSpec(state);
    expect(spec.kind).toBe('question');
    if (spec.kind === 'question' && state.phase === 'card') {
      expect(spec.text).toBe(state.deck[0]?.text);
    }
  });

  it('throws on a state that points past the deck', () => {
    expect(() => cardSpec({ phase: 'card', deck: [], index: 0, total: 0 })).toThrow(RangeError);
  });
});

describe('step', () => {
  it('ignores the tap while busy', () => {
    expect(step(initialState(), true, groups)).toBeUndefined();
  });

  it('advances when not busy', () => {
    expect(step(initialState(), false, groups, mulberry32(3))?.phase).toBe('card');
  });
});

describe('announcement', () => {
  it('is empty for the start card and German for the others', () => {
    expect(announcement({ kind: 'start' })).toBe('');
    expect(
      announcement({ kind: 'question', text: 'Lieblingsfarbe?', position: 2, total: 66 }),
    ).toBe('Frage 3 von 66: Lieblingsfarbe?');
    expect(announcement({ kind: 'end' })).toContain('Deck durch');
  });
});

describe('isAdvanceKey', () => {
  it('accepts Enter, Space and ArrowRight', () => {
    for (const k of ['Enter', ' ', 'ArrowRight']) expect(isAdvanceKey(key(k))).toBe(true);
  });

  it('ignores auto-repeat, other keys and shortcuts', () => {
    expect(isAdvanceKey(key('Enter', { repeat: true }))).toBe(false);
    expect(isAdvanceKey(key('a'))).toBe(false);
    expect(isAdvanceKey(key('ArrowLeft'))).toBe(false);
    expect(isAdvanceKey(key('Enter', { metaKey: true }))).toBe(false);
  });
});
