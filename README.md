# Welche Frage war das?

A digital card deck for getting to know each other, made for phones. Working title; the game is called "Welche Frage war das?" ("Which question was that?").

Live: https://manuel-annabring.github.io/get-to-know-cards/

## How to play

One player reads a card silently and answers it aloud, without saying the question. The others guess which question it was. Then the next player draws the next card.

The twist: the deck has groups of questions that share the same answer form. "Gummibärchen" could answer "favourite sweet" or "sweet you dislike", so guessing is part of the fun.

## Run it locally

```sh
npm install
npm run dev     # dev server on http://localhost:5173
npm run check   # typecheck, lint, test and build
```

## Notes

- Stack: Vite, TypeScript, vanilla DOM, Vitest, ESLint, Prettier. A static site, no backend.
- The card content and the interface text are in German.
- Every push to `main` is built, checked and deployed to GitHub Pages by `.github/workflows/deploy.yml`.
- Project docs: `SPEC.md` (scope and contracts), `STATUS.md` (where we are), `DECISIONS.md` (decision log), `WORKFLOW.md` (how we work).
