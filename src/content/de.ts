export type { QuestionGroup } from './types';
import type { QuestionGroup } from './types';

// Questions in one group share an answer form, so one short answer ("Gummibärchen", "Katze",
// "42") fits every question of the group and the guessers have to ask.
export const groups: QuestionGroup[] = [
  // Pairs
  {
    id: 'food',
    questions: ['Was isst du am liebsten?', 'Was isst du nicht gerne?'],
  },
  {
    id: 'sweets',
    questions: ['Welche Süßigkeit isst du am liebsten?', 'Welche Süßigkeit magst du gar nicht?'],
  },
  {
    id: 'drinks',
    questions: ['Was trinkst du am liebsten?', 'Was trinkst du nie?'],
  },
  {
    id: 'animals',
    questions: ['Was ist dein Lieblingstier?', 'Welches Tier magst du nicht?'],
  },
  {
    id: 'pet-names',
    questions: ['Wie hieß dein erstes Haustier?', 'Wie hieß dein Lieblingskuscheltier?'],
  },
  {
    id: 'music',
    questions: ['Welche Musik hörst du gerne?', 'Welche Musik kannst du nicht ausstehen?'],
  },
  {
    id: 'films',
    questions: [
      'Welchen Film kannst du immer wieder sehen?',
      'Welchen Film fandest du richtig schlecht?',
    ],
  },
  {
    id: 'books',
    questions: [
      'Welches Buch hat dir am besten gefallen?',
      'Welches Buch hast du nicht zu Ende gelesen?',
    ],
  },
  {
    id: 'holidays',
    questions: ['Wo war dein letzter Urlaub?', 'Wohin möchtest du einmal reisen?'],
  },
  {
    id: 'hobbies',
    questions: [
      'Was machst du am liebsten in deiner Freizeit?',
      'Was würdest du gerne mal ausprobieren?',
    ],
  },
  {
    id: 'sports',
    questions: ['Welchen Sport machst du gerne?', 'Welchen Sport findest du langweilig?'],
  },
  {
    id: 'childhood-job',
    questions: ['Was wolltest du als Kind werden?'],
  },
  {
    id: 'school-subjects',
    questions: [
      'Was war dein Lieblingsfach in der Schule?',
      'Welches Schulfach mochtest du gar nicht?',
    ],
  },
  {
    id: 'weekdays',
    questions: ['Welcher Wochentag ist dein liebster?', 'Welcher Wochentag nervt dich am meisten?'],
  },
  {
    id: 'seasons',
    questions: [
      'Welche Jahreszeit magst du am liebsten?',
      'Welche Jahreszeit magst du nicht so gern?',
    ],
  },
  {
    id: 'weather',
    questions: ['Welches Wetter magst du am liebsten?', 'Welches Wetter magst du gar nicht?'],
  },
  {
    id: 'colours',
    questions: ['Was ist deine Lieblingsfarbe?', 'Welche Farbe magst du gar nicht?'],
  },
  {
    id: 'smells',
    questions: [
      'Welcher Geruch gefällt dir am besten?',
      'Welchen Geruch kannst du nicht ausstehen?',
    ],
  },
  {
    id: 'apps',
    questions: ['Welche App nutzt du am meisten?', 'Welche App hast du zuletzt gelöscht?'],
  },
  {
    id: 'skills',
    questions: ['Was kannst du richtig gut?', 'Was kannst du überhaupt nicht?'],
  },
  {
    id: 'habits',
    questions: ['Was machst du morgens als Erstes?', 'Was machst du abends als Letztes?'],
  },
  {
    id: 'daily-mood',
    questions: ['Was nervt dich im Alltag am meisten?', 'Was freut dich im Alltag am meisten?'],
  },
  {
    id: 'small-fears',
    questions: ['Wovor hast du ein bisschen Angst?', 'Wovor hattest du als Kind Angst?'],
  },
  {
    id: 'places',
    questions: ['Wo bist du am liebsten?', 'Wo bist du nur ungern?'],
  },

  // Trios
  {
    id: 'age-numbers',
    questions: ['Wie alt bist du?', 'Wie alt fühlst du dich?', 'Welche Schuhgröße hast du?'],
  },
  {
    id: 'counting-numbers',
    questions: [
      'Wie viele Geschwister hast du?',
      'Wie viele Länder hast du schon bereist?',
      'Wie viele Stunden schläfst du pro Nacht?',
    ],
  },
  {
    id: 'home-places',
    questions: ['Wo bist du geboren?', 'Wo wohnst du gerade?', 'Wo würdest du gerne wohnen?'],
  },
  {
    id: 'daily-times',
    questions: [
      'Wann stehst du normalerweise auf?',
      'Wann isst du normalerweise zu Mittag?',
      'Wann gehst du normalerweise ins Bett?',
    ],
  },
  {
    id: 'words',
    questions: [
      'Welches Wort sagst du zu oft?',
      'Welches Wort findest du schön?',
      'Welches Wort schreibst du immer falsch?',
    ],
  },

  // Singles
  {
    id: 'why-here',
    questions: ['Warum bist du gerade hier?'],
  },
  {
    id: 'sea-or-mountains',
    questions: ['Was ist dir lieber, Meer oder Berge?'],
  },
  {
    id: 'first-time',
    questions: ['Was hast du zuletzt zum ersten Mal gemacht?'],
  },
  {
    id: 'last-laugh',
    questions: ['Worüber hast du zuletzt richtig gelacht?'],
  },
];
