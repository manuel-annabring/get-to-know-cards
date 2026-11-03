import { describe, expect, it } from 'vitest';
import type { QuestionGroup } from '../content/types';
import { buildDeck } from './buildDeck';
import { makeGroup, realisticGroups } from './fixtures';
import { mulberry32 } from './rng';
import type { Card } from './types';

function adjacentPairs(deck: readonly Card[]): number {
  return deck.filter((card, i) => i > 0 && deck[i - 1]?.groupId === card.groupId).length;
}

function canAvoidAdjacency(groups: readonly QuestionGroup[]): boolean {
  const total = groups.reduce((sum, group) => sum + group.questions.length, 0);
  const largest = Math.max(0, ...groups.map((group) => group.questions.length));
  return largest <= Math.ceil(total / 2);
}

describe('mulberry32', () => {
  it('is deterministic per seed and stays in [0, 1)', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const values = Array.from({ length: 1000 }, () => a());
    expect(values).toEqual(Array.from({ length: 1000 }, () => b()));
    expect(values.every((v) => v >= 0 && v < 1)).toBe(true);
    expect(mulberry32(43)()).not.toBe(values[0]);
  });
});

describe('buildDeck contents', () => {
  it('contains every question of every group exactly once, as unique cards', () => {
    const groups = realisticGroups();
    const deck = buildDeck(groups, mulberry32(1));
    const expected = groups.flatMap((group) =>
      group.questions.map((text, i) => ({ id: `${group.id}-${i}`, groupId: group.id, text })),
    );
    expect(deck).toHaveLength(expected.length);
    expect(new Set(deck.map((card) => card.id)).size).toBe(deck.length);
    const byId = (a: Card, b: Card) => a.id.localeCompare(b.id);
    expect([...deck].sort(byId)).toEqual([...expected].sort(byId));
  });

  it('does not mutate its input', () => {
    const groups = realisticGroups();
    const snapshot = structuredClone(groups);
    buildDeck(groups, mulberry32(2));
    expect(groups).toEqual(snapshot);
  });

  it('returns an empty deck for no groups and skips groups without questions', () => {
    expect(buildDeck([], mulberry32(1))).toEqual([]);
    expect(buildDeck([makeGroup('empty', 0)], mulberry32(1))).toEqual([]);
    const deck = buildDeck(
      [makeGroup('empty', 0), makeGroup('a', 1), makeGroup('b', 1)],
      mulberry32(1),
    );
    expect(deck.map((card) => card.groupId).sort()).toEqual(['a', 'b']);
  });

  it('works with the default Math.random', () => {
    expect(buildDeck(realisticGroups())).toHaveLength(69);
  });

  it('is deterministic for a given seed and varies between seeds', () => {
    const groups = realisticGroups();
    const ids = (seed: number) => buildDeck(groups, mulberry32(seed)).map((card) => card.id);
    expect(ids(7)).toEqual(ids(7));
    const orders = new Set(Array.from({ length: 20 }, (_, seed) => ids(seed).join()));
    expect(orders.size).toBe(20);
    const firstCards = new Set(Array.from({ length: 60 }, (_, seed) => ids(seed)[0]));
    expect(firstCards.size).toBeGreaterThan(20);
  });
});

describe('buildDeck adjacency', () => {
  it('never puts two cards of the same group next to each other (200 seeded runs)', () => {
    const groups = realisticGroups();
    for (let seed = 0; seed < 200; seed += 1) {
      const deck = buildDeck(groups, mulberry32(seed));
      expect(adjacentPairs(deck), `seed ${seed}`).toBe(0);
    }
  });

  it('finds a valid arrangement whenever one exists (random small fixtures)', () => {
    let feasible = 0;
    let infeasible = 0;
    for (let seed = 0; seed < 3000; seed += 1) {
      const rng = mulberry32(seed);
      const groupCount = Math.floor(rng() * 7);
      const groups = Array.from({ length: groupCount }, (_, i) =>
        makeGroup(`g${i}`, Math.floor(rng() * 6)),
      );
      const total = groups.reduce((sum, group) => sum + group.questions.length, 0);
      const deck = buildDeck(groups, mulberry32(seed + 100_000));

      expect(deck, `seed ${seed}: completeness`).toHaveLength(total);
      expect(new Set(deck.map((card) => card.id)).size).toBe(total);
      if (canAvoidAdjacency(groups)) {
        feasible += 1;
        expect(adjacentPairs(deck), `seed ${seed}`).toBe(0);
      } else {
        infeasible += 1;
      }
    }
    // Guard against a generator that never reaches one of the two branches.
    expect(feasible).toBeGreaterThan(500);
    expect(infeasible).toBeGreaterThan(200);
  });

  it('finds a valid arrangement at the exact limit (largest group has ceil(n / 2) cards)', () => {
    const cases: QuestionGroup[][] = [
      [makeGroup('big', 3), makeGroup('a', 1), makeGroup('b', 1)], // n=5, 3 = ceil(5/2)
      [makeGroup('big', 3), makeGroup('a', 3)], // n=6, 3 = ceil(6/2)
      [makeGroup('big', 5), makeGroup('a', 1), makeGroup('b', 1), makeGroup('c', 2)], // n=9
    ];
    for (const groups of cases) {
      for (let seed = 0; seed < 100; seed += 1) {
        expect(adjacentPairs(buildDeck(groups, mulberry32(seed))), `seed ${seed}`).toBe(0);
      }
    }
  });

  it('documents that adjacency can be violated when no arrangement exists', () => {
    const single = [makeGroup('only', 3)];
    const deck = buildDeck(single, mulberry32(1));
    expect(deck).toHaveLength(3);
    expect(adjacentPairs(deck)).toBe(2);

    // One group with more than ceil(n / 2) cards: 4 of 6.
    const lopsided = [makeGroup('big', 4), makeGroup('a', 1), makeGroup('b', 1)];
    expect(canAvoidAdjacency(lopsided)).toBe(false);
    const lopsidedDeck = buildDeck(lopsided, mulberry32(1));
    expect(lopsidedDeck).toHaveLength(6);
    expect(adjacentPairs(lopsidedDeck)).toBeGreaterThan(0);
  });
});
