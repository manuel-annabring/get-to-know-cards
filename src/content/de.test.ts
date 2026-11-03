import { describe, expect, it } from 'vitest';
import { groups } from './de';

const questions = groups.flatMap((group) => group.questions);

// Whole words only, so "Auswahl" does not hit "Wahl". \b does not know umlauts, hence the lookarounds.
const excludedWords = [
  // politics
  'Politik',
  'Politiker',
  'Politikerin',
  'politisch',
  'Partei',
  'Parteien',
  'Wahl',
  'Wahlen',
  'Regierung',
  // relationship status
  'Beziehungsstatus',
  'Beziehung',
  'Single',
  'Singles',
  'verheiratet',
  'geschieden',
  'Freundin',
  'Partner',
  'Partnerin',
  'Ehemann',
  'Ehefrau',
  // weight and body, appearance
  'Gewicht',
  'Kilo',
  'Kilos',
  'dick',
  'dünn',
  'Figur',
  'Körper',
  'Aussehen',
  'Diät',
  'abnehmen',
  // religion
  'Religion',
  'Glaube',
  'Glauben',
  'Gott',
  // income
  'Gehalt',
  'Gehälter',
  'Einkommen',
  'Verdienst',
  'verdienen',
  'Lohn',
];

function findExcludedWords(text: string): string[] {
  return excludedWords.filter((word) =>
    new RegExp(`(?<!\\p{L})${word}(?!\\p{L})`, 'iu').test(text),
  );
}

describe('German content: structure', () => {
  const count = (size: number) => groups.filter((g) => g.questions.length === size).length;

  it('has 30 to 40 groups', () => {
    expect(groups.length).toBeGreaterThanOrEqual(30);
    expect(groups.length).toBeLessThanOrEqual(40);
  });

  it('has at least 20 pairs, 3 to 6 trios and 4 to 6 singles', () => {
    expect(count(2)).toBeGreaterThanOrEqual(20);
    expect(count(3)).toBeGreaterThanOrEqual(3);
    expect(count(3)).toBeLessThanOrEqual(6);
    expect(count(1)).toBeGreaterThanOrEqual(4);
    expect(count(1)).toBeLessThanOrEqual(6);
  });

  it('gives every group 1 to 3 questions', () => {
    for (const group of groups) {
      expect(group.questions.length, group.id).toBeGreaterThanOrEqual(1);
      expect(group.questions.length, group.id).toBeLessThanOrEqual(3);
    }
  });

  it('uses unique kebab-case group ids', () => {
    const ids = groups.map((group) => group.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
  });
});

describe('German content: question rules', () => {
  it('keeps every question at 60 characters or less', () => {
    const longest = Math.max(...questions.map((q) => q.length));
    expect(longest).toBeLessThanOrEqual(60);
    for (const question of questions) expect(question.length, question).toBeLessThanOrEqual(60);
  });

  it('ends every question with a question mark', () => {
    for (const question of questions) expect(question.endsWith('?'), question).toBe(true);
  });

  it('has no duplicate questions (case-insensitive)', () => {
    const lower = questions.map((q) => q.trim().toLowerCase());
    expect(new Set(lower).size).toBe(lower.length);
  });

  it('has no empty or padded questions', () => {
    for (const question of questions) expect(question, question).toBe(question.trim());
    for (const question of questions) expect(question.length, question).toBeGreaterThan(1);
  });
});

describe('German content: excluded topics', () => {
  it('matches whole words only, case-insensitively', () => {
    expect(findExcludedWords('Welche Partei wählst du?')).toEqual(['Partei']);
    expect(findExcludedWords('WIE VIEL GEHALT?')).toEqual(['Gehalt']);
    expect(findExcludedWords('Was war deine Auswahl?')).toEqual([]);
    expect(findExcludedWords('Wie viele Kilometer fährst du?')).toEqual([]);
    expect(findExcludedWords('Wie viel verdienst du?')).toEqual(['Verdienst']);
  });

  it('finds no excluded-topic keyword in any question', () => {
    const hits = questions.flatMap((q) => findExcludedWords(q).map((word) => `${word}: ${q}`));
    expect(hits).toEqual([]);
  });
});
