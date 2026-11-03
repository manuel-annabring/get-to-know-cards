import type { QuestionGroup } from '../content/types';

export function makeGroup(id: string, size: number): QuestionGroup {
  return { id, questions: Array.from({ length: size }, (_, i) => `${id} question ${i}?`) };
}

/** About the real deck shape: mostly pairs, a few trios, a few singles (35 groups, 69 cards). */
export function realisticGroups(): QuestionGroup[] {
  return [
    ...Array.from({ length: 24 }, (_, i) => makeGroup(`pair-${i}`, 2)),
    ...Array.from({ length: 5 }, (_, i) => makeGroup(`trio-${i}`, 3)),
    ...Array.from({ length: 6 }, (_, i) => makeGroup(`single-${i}`, 1)),
  ];
}
