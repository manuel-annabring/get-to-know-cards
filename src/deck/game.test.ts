import { describe, expect, it } from 'vitest';
import { makeGroup, realisticGroups } from './fixtures';
import { advance, initialState } from './game';
import { mulberry32 } from './rng';
import type { GameState } from './types';

const groups = [makeGroup('a', 2), makeGroup('b', 2), makeGroup('c', 1)];

function cardState(state: GameState) {
  if (state.phase !== 'card') throw new Error(`expected card, got ${state.phase}`);
  return state;
}

describe('game state machine', () => {
  it('starts on the start card', () => {
    expect(initialState()).toEqual({ phase: 'start' });
  });

  it('advance from start deals a deck and shows card 0', () => {
    const next = cardState(advance(initialState(), groups, mulberry32(1)));
    expect(next.index).toBe(0);
    expect(next.total).toBe(5);
    expect(next.deck).toHaveLength(5);
  });

  it('advance from a card moves to the next card, keeping the same deck', () => {
    const first = cardState(advance(initialState(), groups, mulberry32(1)));
    const second = cardState(advance(first, groups, mulberry32(2)));
    expect(second.index).toBe(1);
    expect(second.total).toBe(first.total);
    expect(second.deck).toBe(first.deck);
  });

  it('advance from the last card goes to the end, with the played deck', () => {
    let state = advance(initialState(), groups, mulberry32(1));
    const deck = cardState(state).deck;
    for (let i = 0; i < 4; i += 1) state = advance(state, groups, mulberry32(9));
    expect(cardState(state).index).toBe(4);
    state = advance(state, groups, mulberry32(9));
    expect(state).toEqual({ phase: 'end', deck });
  });

  it('advance from the end starts a new shuffle at card 0', () => {
    let state = advance(initialState(), groups, mulberry32(1));
    while (state.phase === 'card') state = advance(state, groups, mulberry32(1));
    expect(state.phase).toBe('end');
    const again = cardState(advance(state, groups, mulberry32(2)));
    expect(again.index).toBe(0);
    expect(again.total).toBe(5);
  });

  it('plays the whole realistic deck through, visiting each card once, then reshuffles', () => {
    const real = realisticGroups();
    let state = advance(initialState(), real, mulberry32(3));
    const seen: string[] = [];
    while (state.phase === 'card') {
      seen.push(state.deck[state.index]?.id ?? 'missing');
      expect(state.total).toBe(69);
      state = advance(state, real, mulberry32(3));
    }
    expect(state.phase).toBe('end');
    expect(seen).toHaveLength(69);
    expect(new Set(seen).size).toBe(69);

    const next = cardState(advance(state, real, mulberry32(4)));
    expect(next.deck.map((c) => c.id)).not.toEqual(seen);
  });

  it('does not mutate the state it is given', () => {
    const first = cardState(advance(initialState(), groups, mulberry32(1)));
    const snapshot = structuredClone(first);
    advance(first, groups, mulberry32(1));
    expect(first).toEqual(snapshot);
  });

  it('with no questions at all, start and end both lead to the end card', () => {
    const start = advance(initialState(), [], mulberry32(1));
    expect(start).toEqual({ phase: 'end', deck: [] });
    expect(advance(start, [], mulberry32(1))).toEqual({ phase: 'end', deck: [] });
    expect(advance(initialState(), [makeGroup('empty', 0)], mulberry32(1)).phase).toBe('end');
  });

  it('works with the default Math.random', () => {
    expect(advance(initialState(), groups).phase).toBe('card');
  });
});
