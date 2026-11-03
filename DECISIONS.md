# Decisions

Impact `foundation`: other slices build on it, expensive to change. Impact `easy-to-change`: a value or look that can be retuned in minutes. Status is `open` until Manuel has seen it at review, then `accepted` or `changed`.

| ID | Slice | Decision | Alternatives | Why | Impact | Status |
|---|---|---|---|---|---|---|
| D-001 | spec | Deck is made of groups of 1 to 3 questions with the same answer form; each question is its own card | only pairs; two questions on one card | the shoe size and age example needs trios; one question per card keeps the card simple and the guessing honest | foundation | accepted |
| D-002 | spec | One game = whole deck shuffled once, then an end screen; tap reshuffles. Same-group cards avoid being adjacent | endless draw; fixed round length | simplest to understand; round length setting is in the backlog | foundation | accepted |
| D-003 | spec | No scoring, no in-app reveal of the question in v1 | points, reveal button | keeps the UI to one gesture and the focus on conversation | easy-to-change | accepted |
| D-004 | spec | Audience: adults who barely know each other, light tone. Excluded: politics, relationship status, weight and body, appearance, religion, income | deeper or family version | decided by Manuel | easy-to-change | accepted |
| D-005 | spec | German content only in v1, stored as a data module per language (`src/content/de.ts`) | hardcode in UI, i18n library | a second language later is a new data file, not a refactor | foundation | accepted |
| D-006 | spec | Static PWA, no backend, no accounts | native iOS app, hosted service | opens from a link or QR code, works offline, nothing to run | foundation | accepted |
| D-007 | spec | Look: palette Bonbon, rounded font, slide transition, decor shapes on, portrait | Sorbet and Deep palettes, geometric or grotesk font, flip and pop transitions | picked by Manuel in the mockup | easy-to-change | accepted |
| D-008 | spec | Card colour follows deck position, not group | colour per group | a group colour would give away which questions belong together | easy-to-change | open |
| D-009 | spec | Working title "Welche Frage war das?" | none yet | describes the mechanic in the title | easy-to-change | open |
| D-010 | spec | Stack: Vite, TypeScript, vanilla DOM, npm | React, Svelte | one screen and one gesture: a framework adds weight and no value | foundation | open |
| D-011 | spec | Font: Fredoka, variable, self-hosted via `@fontsource-variable/fredoka` | Nunito, Baloo 2, DM Sans | closest match to the "Rund" mockup choice, OFL licence, works offline | easy-to-change | open |
| D-012 | spec | On wide screens the card is capped at 420px and centred; on phones it fills the viewport with a 12px margin | full-bleed on phones | matches the mockup frame; the margin shows the card shape | easy-to-change | open |
| D-013 | spec | Content v1 is drafted by Claude (30 to 40 groups) and reviewed by Manuel at the phase review | Manuel writes all | fastest path to something playable; Manuel strikes and edits | easy-to-change | open |
| D-014 | spec | No Playwright. Visual verification via dev server and the browser pane at 390x844 | Playwright screenshots in CI | fewer dependencies; the workflow already assumes browser pane screenshots | easy-to-change | open |
| D-015 | 0 | Toolchain: ESLint 10 flat config with `typescript-eslint` strict preset and `no-explicit-any` as error, Prettier (single quotes, 100 columns, `*.md` ignored), tsconfig with `strict` plus `noUncheckedIndexedAccess` and `noUnused*`, Vitest configured inside `vite.config.ts` with the `node` environment and `src/**/*.test.ts`, no jsdom yet. `lint` also runs `prettier --check`; `build` runs `tsc --noEmit` first | looser tsconfig, separate vitest config, jsdom from the start, Prettier checking Markdown | strict settings are cheapest at the start; Markdown (SPEC, WORKFLOW) is not ours to reformat; `src/deck/` is pure logic so a DOM environment is not needed until UI tests exist | easy-to-change | open |
