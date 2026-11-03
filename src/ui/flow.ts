import type { QuestionGroup } from '../content/types';
import { advance, type GameState, type Rng } from '../deck';
import { strings } from './strings';

/** Which card the game shows. Pure data, so the mapping can be tested without a DOM. */
export type CardSpec =
  | { readonly kind: 'start' }
  | {
      readonly kind: 'question';
      readonly text: string;
      readonly position: number;
      readonly total: number;
    }
  | { readonly kind: 'end' };

export function cardSpec(state: GameState): CardSpec {
  switch (state.phase) {
    case 'start':
      return { kind: 'start' };
    case 'end':
      return { kind: 'end' };
    case 'card': {
      const card = state.deck[state.index];
      if (!card) throw new RangeError('Game state points past the end of the deck');
      return { kind: 'question', text: card.text, position: state.index, total: state.total };
    }
  }
}

/** The next state, or `undefined` while a transition is running (the tap is ignored). */
export function step(
  state: GameState,
  busy: boolean,
  groups: readonly QuestionGroup[],
  rng?: Rng,
): GameState | undefined {
  return busy ? undefined : advance(state, groups, rng);
}

/** Text for the screen reader live region. The start card is already in the page, so it has none. */
export function announcement(spec: CardSpec): string {
  switch (spec.kind) {
    case 'start':
      return '';
    case 'end':
      return strings.announceEnd;
    case 'question':
      return strings.announceQuestion(spec.position + 1, spec.total, spec.text);
  }
}

export interface KeyLike {
  readonly key: string;
  readonly repeat: boolean;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly altKey: boolean;
}

const advanceKeys: ReadonlySet<string> = new Set(['Enter', ' ', 'ArrowRight']);

/** Holding a key down must not skip cards, so auto-repeat does not count. */
export function isAdvanceKey(event: KeyLike): boolean {
  return (
    advanceKeys.has(event.key) && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey
  );
}
