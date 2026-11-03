/** All German UI strings. Card content lives in `src/content/`. */
export const strings = {
  startLabel: 'Das Kennenlernspiel',
  startTitle: 'Welche Frage war das?',
  startHint: 'Tippe irgendwo, um die erste Karte zu ziehen.',
  endTitle: 'Deck durch',
  endHint: 'Tippe, um neu zu mischen.',
  counter: (current: number, total: number): string => `${current} / ${total}`,
} as const;
