export interface Card {
  id: string; // `${groupId}-${questionIndex}`, unique as long as group ids are
  groupId: string;
  text: string;
}

export type GameState =
  | { readonly phase: 'start' }
  | {
      readonly phase: 'card';
      readonly deck: readonly Card[];
      /** Zero-based position of the current card in `deck`. */
      readonly index: number;
      /** Deck size, for the "n / N" counter (shown as `index + 1` / `total`). */
      readonly total: number;
    }
  | { readonly phase: 'end'; readonly deck: readonly Card[] };
