import type { QuestionGroup } from '../content/types';
import { buildDeck } from './buildDeck';
import type { Rng } from './rng';
import type { GameState } from './types';

export function initialState(): GameState {
  return { phase: 'start' };
}

/** start -> card 0 ... card N-1 -> end -> (new shuffle) card 0. Never mutates `state`. */
export function advance(
  state: GameState,
  groups: readonly QuestionGroup[],
  rng: Rng = Math.random,
): GameState {
  switch (state.phase) {
    case 'start':
    case 'end':
      return newGame(groups, rng);
    case 'card':
      return state.index + 1 < state.total
        ? { ...state, index: state.index + 1 }
        : { phase: 'end', deck: state.deck };
  }
}

function newGame(groups: readonly QuestionGroup[], rng: Rng): GameState {
  const deck = buildDeck(groups, rng);
  // An empty deck has no card 0, so the game goes straight to the end screen.
  if (deck.length === 0) return { phase: 'end', deck };
  return { phase: 'card', deck, index: 0, total: deck.length };
}
