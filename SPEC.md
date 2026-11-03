# SPEC: "Welche Frage war das?" (working title)

Status: v0.1, agreed in the spec session on 2026-11-03. Phase 1 is detailed. Phases 2 and 3 are sketches and get detailed after the Phase 1 review.

## 1. Product

A digital deck of question cards for getting to know each other. Mobile first (portrait), played by 3 or more people in one room, with one phone passed around.

**Round of play**

1. One card is shown. The current player takes the phone and reads the question silently.
2. They answer out loud **without saying the question**.
3. The others guess what the question was. This should trigger follow-up questions and small talk.
4. The player passes the phone on. The next player taps anywhere, and the next card appears.

**The twist:** the deck contains *groups* of questions that have the same answer form (Details in 2). The answer "Gummibärchen" fits "Which sweet do you like best?" and also "Which sweet do you not like at all?". Guessers can't tell which one was meant, so they have to ask.

**Done feels like:** pick up the phone, tap, and within 10 seconds a group is laughing about a wrong guess. The UI is never in the way: one big question, one colourful card, one gesture.

**Not in this product:** scoring, accounts, backend, ads, analytics, multiplayer sync, in-app reveal of the question.

## 2. Game rules the app must encode

- The deck is made of **question groups**. A group has 1 to 3 questions with the same answer form:
  - pair: "Favourite animal" / "Animal you dislike"
  - trio: "How old are you" / "How old do you feel" / "What is your shoe size" (answer is always a number)
  - single: "Why are you here right now?" (no counterpart)
- Every question is its own card. A card shows exactly one question, never two.
- One game = the whole deck, shuffled once, played through once. All cards of a group are always in the same game.
- **Order:** random, but two cards of the same group are never adjacent when avoidable. The card colour follows the position in the deck, never the group, so it can't give a hint.
- After the last card an end screen appears. A tap shuffles again and starts a new game.
- The first screen is a start card (title and hint "tap anywhere").

## 3. Contracts

Changing a contract is always a stop (see Autonomy rules in `CLAUDE.md`).

### 3.1 Content data (`src/content/de.ts`)

```ts
export interface QuestionGroup {
  id: string;          // stable key, kebab-case, e.g. "sweets"
  questions: string[]; // 1 to 3 items, German, each ends with "?"
}
export const groups: QuestionGroup[];
```

- Card content is German data. Everything else in the repo (code, comments, docs, commit messages) is English.
- Content lives only in `src/content/`. One module per language. Language switching is out of scope for now, but code must not hardcode German strings outside `src/content/` and `src/ui/strings.ts`.
- Content rules (checked by a test in slice 1.3):
  - at most 60 characters per question
  - no duplicate questions
  - excluded topics: politics, relationship status, weight and body, appearance, religion, income. No body shaming.

### 3.2 Look constants (`src/theme.ts`)

All tweakable look values live in this one module. Components import from it and contain no raw colours, sizes or timings.

| Constant | Value |
|---|---|
| Palette "Bonbon" (bg / ink) | `#F0543C` / `#FFFFFF`, `#FFB627` / `#2A1650`, `#0E9F8E` / `#FFFFFF`, `#6C4BE8` / `#FFFFFF`, `#E8387F` / `#FFFFFF`, `#2F6FED` / `#FFFFFF` |
| Decor shape tint | white at 20% alpha on dark cards, `#2A1650` at 10% alpha on the yellow card |
| Page background | `#FFF6EA` |
| Font | Fredoka (variable, self-hosted), weight 500 for all card text, tight letter spacing |
| Question size | 42px up to 24 chars, 36px up to 36 chars, 32px above, scaled down if the text would overflow |
| Transition | slide in from the right, 380ms, `cubic-bezier(.2,.8,.2,1)`, old card moves left and scales to 95% |
| Decor layouts | 6 layouts (circles, rings, quarters, halves, rounded squares), cycled by deck position |
| Card radius | 30px |

Reference for the intended look: the mockup from the spec session (cards in portrait, large text left-aligned and vertically centred, 2 to 3 decor shapes per card clipped at the edges, counter "n / N" at the bottom).

### 3.3 Layout

- Portrait. On a phone the card fills the viewport with a 12px margin, respects safe areas, and uses `100dvh`.
- On wider screens the card is centred with a maximum width of 420px and a portrait aspect ratio.
- Smallest supported viewport: 360x640.

### 3.4 Tech

Static site, no backend, no accounts. Vite, TypeScript, vanilla DOM (no UI framework). npm. Runtime dependencies: only the self-hosted font. Details in `CLAUDE.md` and `DECISIONS.md`.

Dependencies approved with this spec (installed in slice 0, or in slice 2.1 for the PWA plugin): `vite`, `typescript`, `vitest`, `eslint` with `typescript-eslint`, `prettier`, `@fontsource-variable/fredoka`, `vite-plugin-pwa`. Anything else is a stop.

## 4. Phase 1: Playable deck

Goal: Manuel opens the dev server on his phone or in the browser and plays through a full deck.

Order: look first (1.1), then logic and content (1.2, 1.3), then wiring (1.4).

### Slice 0: Setup
Goal:            project skeleton with all verification commands and a way for Claude to see the result
Scope:           repo root (`package.json`, configs, `index.html`, `src/main.ts` placeholder, `.gitignore`), `CLAUDE.md` command section
Out of scope:    any game or look code
Depends on:      none
Taste-critical:  no
Acceptance criteria:
- [ ] `git init` done, `.gitignore` covers `node_modules` and `dist`, first commit on `main`
- [ ] `npm run typecheck`, `lint`, `test`, `build` each pass, and `npm run check` runs all four
- [ ] `npm run dev` serves a placeholder page, and a screenshot in the browser pane at 390x844 shows it
- [ ] the exact commands and the screenshot method (including how to set the mobile viewport) are written into `CLAUDE.md`
- [ ] no console errors or warnings

### Slice 1.1: Card look
Goal:            a single card renders exactly like the agreed mockup, driven only by `src/theme.ts`
Scope:           `src/theme.ts`, `src/styles.css`, `src/ui/card.ts`, `src/ui/strings.ts`, a temporary preview page that shows start card, six question cards (one per colour, shortest and longest text) and the end card
Out of scope:    deck logic, tapping, transitions, real content
Depends on:      slice 0
Taste-critical:  yes
Acceptance criteria:
- [ ] typecheck, lint, build, tests pass
- [ ] a unit test checks that every palette pair has a contrast ratio of at least 3:1 (WCAG large text)
- [ ] screenshot at 390x844: the card is portrait, fills the width minus the 12px margin, text is left-aligned and vertically centred, 2 to 3 decor shapes are clipped at the card edges, the counter sits at the bottom
- [ ] screenshots at 360x640 and 1280x720 show no overflowing text and no clipped text for the longest question, desktop shows the capped 420px card centred
- [ ] start card and end card match the mockup (title, hint line)
- [ ] changing one colour in `theme.ts` changes it everywhere (no raw colour values in other files, checked by grep)
- [ ] the font is loaded from the local bundle (no external font request in the network log)
- [ ] no console errors or warnings

### Slice 1.2: Deck engine
Goal:            pure logic that builds a shuffled deck from groups and steps through the game states
Scope:           `src/deck/` (types, `buildDeck`, game state machine) and its tests
Out of scope:    DOM, content, styling
Depends on:      slice 0
Taste-critical:  no
Acceptance criteria:
- [ ] typecheck, lint, build, tests pass
- [ ] the RNG is injectable, so tests are deterministic
- [ ] `buildDeck` returns every question of every group exactly once, each as a card with `id`, `groupId`, `text`
- [ ] over 200 seeded runs on a realistic fixture (pairs, trios, singles), no two adjacent cards share a group; a fixture with only one group is allowed to violate this, and a test documents it
- [ ] state machine: `start` -> card 0 ... card N-1 -> `end` -> (advance) -> new shuffle, card 0; `advance` on any state is covered by a test
- [ ] no module in `src/deck/` imports from the DOM or `src/ui/`

### Slice 1.3: Content v1
Goal:            the first real deck, in German
Scope:           `src/content/de.ts`, `src/content/de.test.ts`
Out of scope:    UI, other languages
Depends on:      slice 0
Taste-critical:  yes
Acceptance criteria:
- [ ] typecheck, lint, build, tests pass
- [ ] 30 to 40 groups: at least 20 pairs, 3 to 6 trios, 4 to 6 singles
- [ ] all examples from Manuel's brief are in the deck (food likes and dislikes, favourite animal and disliked animal, music, age, felt age, shoe size in the number trio, last holiday and dream destination, why are you here, sweets liked and disliked). Coffee or tea and "Was machst du beruflich?" were removed on Manuel's request after the Phase 1 review (D-031)
- [ ] tests enforce the content rules from 3.1 (length, duplicates, ends with "?", every group has 1 to 3 questions, unique ids)
- [ ] a test scans for excluded-topic keywords (politics, party, election, relationship status, single, married, weight, kilo, fat, thin, figure, religion, salary, income) and fails on a hit
- [ ] tone: light, suited for adults who barely know each other. Decision logged with a note on how groups were chosen
- [ ] pairs are real opposites or counterparts, and trios share one answer form (checked by the reviewer)

### Slice 1.4: Wire-up and interaction
Goal:            the playable game
Scope:           `src/main.ts`, `src/ui/` (game view, transition), `src/styles.css`
Out of scope:    new content, PWA, sound, settings
Depends on:      slices 1.1, 1.2, 1.3
Taste-critical:  yes (transition feel)
Acceptance criteria:
- [ ] typecheck, lint, build, tests pass
- [ ] tapping anywhere on the page (not only on the card) advances: start card -> card 1 -> ... -> end card -> new shuffled game
- [ ] the counter reads "n / N" and matches the deck
- [ ] the slide transition matches `theme.ts` (380ms, from the right). Taps during the animation are ignored. After the animation exactly one card element is in the DOM
- [ ] 40 rapid taps in a row cause no error and no extra DOM nodes left behind
- [ ] keyboard: Enter, Space and ArrowRight advance
- [ ] with `prefers-reduced-motion` the transition is a short crossfade
- [ ] no text selection on long press, no double-tap zoom, no pull-to-refresh, no horizontal scroll at 360x640
- [ ] a full game through the dev server in the browser pane: screenshots of the first card, a middle card, the end card
- [ ] no console errors or warnings

## 5. Phase 2: Quick deploy

Goal: Manuel opens a public URL on his phone and plays with a group (first real try: the day after the Phase 1 review). Everything that is not needed for that moves to Phase 3.

Hosting decision (Manuel, 2026-11-04): GitHub Pages from a public repo `manuel-annabring/get-to-know-cards`, deployed by a GitHub Action on every push to `main`. The site lives at `https://manuel-annabring.github.io/get-to-know-cards/`, so the build must work under a sub-path. Before the first push the local history is rewritten to the GitHub noreply email, so the personal email does not become public.

### Slice 2.1: Production build for a sub-path
Goal:            `dist/` works when served from any path, with a proper page title and favicon
Scope:           `vite.config.ts` (`base: './'`), `index.html` (title, description, theme-color), `public/favicon.svg`
Out of scope:    PWA, manifest, service worker, home-screen icons, analytics, any game change
Depends on:      Phase 1
Taste-critical:  no
Acceptance criteria:
- [ ] typecheck, lint, build, tests pass
- [ ] `dist/index.html` and the built CSS and JS contain no absolute asset paths (no `src="/`, `href="/`, `url(/`)
- [ ] `dist/` copied to a temp folder under `get-to-know-cards/` and served by a static server (for example `python3 -m http.server`) plays correctly at `http://localhost:<port>/get-to-know-cards/`: start card, a few cards, end card at 390x844; the font loads from the served `dist` (network log), no console errors or warnings
- [ ] the same works at the root path (`vite preview`)
- [ ] `dev/` is not in `dist/`
- [ ] `<title>` is "Welche Frage war das?", a short German `description` and a `theme-color` taken from the first palette colour are set; the favicon shows in the tab
- [ ] no console errors or warnings

### Slice 2.2: Repo files and deploy workflow
Goal:            the repository is ready to be published, and every push to `main` deploys to Pages
Scope:           `.github/workflows/deploy.yml`, `README.md`, `.gitignore` check
Out of scope:    creating the remote, pushing, enabling Pages (that is slice 2.3), licence, issue templates
Depends on:      slice 2.1
Taste-critical:  no
Acceptance criteria:
- [ ] the workflow runs on push to `main` and on manual dispatch, installs with `npm ci`, runs `npm run check`, uploads `dist/` with the official Pages actions (`actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`, `actions/checkout`, `actions/setup-node`, each pinned to a major version), and sets the `pages: write` and `id-token: write` permissions only on the deploy job
- [ ] the workflow file passes a YAML syntax check
- [ ] `README.md` (English, short): what the game is, how to play in three sentences, how to run it locally, the live URL, and a note that card content is German
- [ ] no secrets, tokens, personal paths or personal email in any tracked file (`git grep` for `icloud`, `/Users/`, `token`)
- [ ] `npm run check` passes

### Slice 2.3: First deploy (run by the coordinator, outward-facing)
Goal:            the game is live on the Pages URL
Scope:           git history rewrite to the noreply email (before the first push only), merging the phase branches into `main`, creating the public repo, pushing, enabling Pages, updating the commit hashes in STATUS.md and REVIEW-phase-1.md
Depends on:      slices 2.1, 2.2
Acceptance criteria:
- [ ] before the rewrite a backup tag or branch exists and the rewrite only changes author and committer identity; trees are identical (`git diff <backup> HEAD` is empty)
- [ ] `main` contains all of Phase 1 and Phase 2; the working tree is clean
- [ ] public repo `manuel-annabring/get-to-know-cards` exists with the full history; `git log --format=%ae` shows only the noreply address
- [ ] Pages is enabled with the workflow build type, and the Actions run for the push succeeds (status read with `gh run`)
- [ ] the live URL in the browser pane at 390x844: start card, a few cards, console clean, the font served from the site
- [ ] STATUS.md has the URL

Stop conditions specific to this slice: Pages cannot be enabled for the account or repo type, the Action fails twice, or any step would need credentials.

## 6. Phase 3: Installable and polish (sketch)

Detailed after Manuel has played the game with a group.

- PWA: manifest, service worker, offline play, installable on the home screen (needs `vite-plugin-pwa`, already approved)
- App icon (see the `icon-brief` skill)
- "How to play" screen: three short sentences, reachable from the start card
- Better slide feel (Manuel: fine for now, improve later)
- More variety in the pairs: 17 of 24 pairs were "like / dislike"; add first/last, past/future, real/wish
- Review leftovers: end card and last card can share a colour, small-text contrast on the red, teal and pink cards, tap-lock timer slack, German strings in `dev/preview.ts`
- Licence for the repo, custom domain

## 7. Backlog (not planned)

- Categories or intensity levels ("light" / "deeper")
- More languages (content modules already allow it)
- Optional "show the question again" at the end of a turn
- Round length setting (draw only N groups instead of the whole deck)
- Share link or QR code on the start card
