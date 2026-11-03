// Dev-only: not part of the production build (vite builds index.html only).
import '../src/styles.css';
import { applyTheme, createEndCard, createQuestionCard, createStartCard } from '../src/ui/card';

applyTheme();

const questions = [
  'Kaffee oder Tee?',
  'Welche Süßigkeit isst du am liebsten?',
  'Was war dein erstes Handy und wie sah es aus?',
  'Welche Superkraft hättest du gern für einen Tag?',
  'Was machst du, wenn du nicht schlafen kannst?',
  'Was war das Peinlichste, das dir im Urlaub je passiert ist?',
];

const cards = [
  createStartCard(),
  ...questions.map((text, position) =>
    createQuestionCard({ text, position, total: questions.length }),
  ),
  createEndCard(),
];

// ?solo=0 shows only the 0th card of the list above in the real phone layout (.stage),
// for screenshots at 390x844, 360x640 and 1280x720.
const solo = new URLSearchParams(location.search).get('solo');
const soloCard = solo === null ? undefined : cards[Number(solo)];

if (soloCard) {
  const stage = document.createElement('main');
  stage.className = 'stage';
  stage.append(soloCard);
  document.body.replaceChildren(stage);
} else {
  const grid = document.querySelector<HTMLDivElement>('#grid');
  for (const card of cards) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.append(card);
    grid?.append(cell);
  }
}
