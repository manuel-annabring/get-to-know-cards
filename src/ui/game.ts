import type { QuestionGroup } from '../content/types';
import { initialState, type Rng } from '../deck';
import { createEndCard, createQuestionCard, createStartCard } from './card';
import { announcement, cardSpec, isAdvanceKey, step, type CardSpec } from './flow';
import { playTransition, prefersReducedMotion } from './transition';

function createCard(spec: CardSpec): HTMLElement {
  switch (spec.kind) {
    case 'start':
      return createStartCard();
    case 'end':
      return createEndCard();
    case 'question':
      return createQuestionCard(spec);
  }
}

/** Shows the start card in `stage` and advances the game on a tap anywhere or an advance key. */
export function mountGame(
  stage: HTMLElement,
  liveRegion: HTMLElement,
  groups: readonly QuestionGroup[],
  rng?: Rng,
): void {
  let state = initialState();
  let busy = false;
  let current = createCard(cardSpec(state));
  stage.append(current);

  const advanceGame = (): void => {
    const next = step(state, busy, groups, rng);
    if (!next) return;
    state = next;
    busy = true;

    const spec = cardSpec(state);
    const outgoing = current;
    current = createCard(spec);
    stage.append(current);
    liveRegion.textContent = announcement(spec);
    playTransition(outgoing, current, prefersReducedMotion(), () => {
      busy = false;
    });
  };

  document.addEventListener('click', advanceGame);
  document.addEventListener('keydown', (event) => {
    if (!isAdvanceKey(event)) return;
    event.preventDefault();
    advanceGame();
  });
}
