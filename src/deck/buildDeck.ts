import type { QuestionGroup } from '../content/types';
import type { Rng } from './rng';
import type { Card } from './types';

/**
 * Builds a shuffled deck with every question of every group exactly once.
 *
 * Cards of the same group are never adjacent whenever that is possible at all,
 * which is exactly when the largest group has at most ceil(n / 2) cards. The
 * order is random: each step draws a random remaining card, but only from groups
 * that still leave the rest of the deck arrangeable. When no arrangement exists,
 * the deck is still complete and violates adjacency as little as this greedy
 * fallback manages.
 */
export function buildDeck(groups: readonly QuestionGroup[], rng: Rng = Math.random): Card[] {
  // One pile of cards per group, each pile shuffled so the question order inside
  // a group is random too.
  const piles = groups
    .map((group) =>
      shuffle(
        group.questions.map((text, index): Card => ({
          id: `${group.id}-${index}`,
          groupId: group.id,
          text,
        })),
        rng,
      ),
    )
    .filter((pile) => pile.length > 0);

  const counts = piles.map((pile) => pile.length);
  let remaining = counts.reduce((sum, count) => sum + count, 0);
  const deck: Card[] = [];
  let last = -1;

  while (remaining > 0) {
    const pick = chooseGroup(counts, remaining, last, rng);
    const card = piles[pick]?.pop();
    if (!card) throw new Error('deck builder picked an empty group');
    deck.push(card);
    counts[pick] = (counts[pick] ?? 0) - 1;
    remaining -= 1;
    last = pick;
  }
  return deck;
}

/**
 * True when `remaining` cards with these per-group counts can be arranged without
 * adjacent equal groups, given that the card before them belongs to group `last`
 * (-1 for none). A group may fill every second slot; the one before the sequence
 * takes the first slot away from `last`.
 */
function canFinish(counts: readonly number[], remaining: number, last: number): boolean {
  const limit = Math.ceil(remaining / 2);
  const lastLimit = Math.floor(remaining / 2);
  return counts.every((count, group) => count <= (group === last ? lastLimit : limit));
}

function chooseGroup(counts: number[], remaining: number, last: number, rng: Rng): number {
  const candidates: number[] = [];
  counts.forEach((count, group) => {
    if (count === 0 || group === last) return;
    counts[group] = count - 1;
    if (canFinish(counts, remaining - 1, group)) candidates.push(group);
    counts[group] = count;
  });

  if (candidates.length > 0) {
    // Weight by remaining cards so the result is as close to a plain shuffle as the
    // constraint allows.
    const weights = candidates.map((group) => counts[group] ?? 0);
    return candidates[weightedIndex(weights, rng)] ?? -1;
  }

  // No arrangement exists from here. Spread the biggest group out as far as possible.
  const open = counts.flatMap((count, group) => (count > 0 && group !== last ? [group] : []));
  if (open.length === 0) return last; // only the previous group is left
  const biggest = Math.max(...open.map((group) => counts[group] ?? 0));
  const ties = open.filter((group) => counts[group] === biggest);
  return ties[Math.floor(rng() * ties.length)] ?? -1;
}

function weightedIndex(weights: readonly number[], rng: Rng): number {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = Math.floor(rng() * total);
  for (let i = 0; i < weights.length; i += 1) {
    roll -= weights[i] ?? 0;
    if (roll < 0) return i;
  }
  return weights.length - 1;
}

function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
}
