# CLAUDE.md

Project: "Welche Frage war das?" (working title). A digital question-card deck for getting to know each other, mobile first. Read `SPEC.md` for scope, contracts and slices, `STATUS.md` for where we are, `DECISIONS.md` for decisions. `WORKFLOW.md` describes how we work.

## Language

- Manuel and Claude talk in German.
- Everything in the repo is English: code, comments, docs, commit messages.
- The only German text is card content in `src/content/` and UI strings in `src/ui/strings.ts`.

## Stack

Vite, TypeScript, vanilla DOM (no UI framework), npm, Vitest, ESLint, Prettier. Static site, no backend. The only runtime dependency is the self-hosted font (`@fontsource-variable/fredoka`). A new dependency is a stop (see Autonomy rules).

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server on port 5173 (`strictPort`, fails if the port is taken) |
| `npm run typecheck` | `tsc --noEmit`, strict |
| `npm run lint` | ESLint, then `prettier --check .` (Markdown files are not checked) |
| `npm run test` | `vitest run`, tests live next to the code as `src/**/*.test.ts` |
| `npm run build` | typecheck, then `vite build` into `dist/` |
| `npm run check` | typecheck, lint, test, build in that order; run before every commit |

Fix formatting with `npx prettier --write .`.

How Claude sees the result (dev server plus the browser pane):

1. Start the server with `preview_start` and `name: "dev"`. The entry lives in `.claude/launch.json` (port 5173). It opens the browser pane at `http://localhost:5173`. Stop it with `preview_stop` when done.
2. Set the phone viewport with `resize_window` and `width: 390, height: 844` (the `mobile` preset is 375x812, not the same). Other sizes to check: 360x640 and 1280x720. Navigate or reload after resizing.
3. Take a screenshot with `computer` and `action: "screenshot"` (the image is in a 2x coordinate frame; pass `scale: 0.5` to save tokens). Use `read_page` or `get_page_text` for text checks.
4. Read the console with `read_console_messages`. Use `onlyErrors: true` for errors. The two `[vite] connecting...` and `[vite] connected.` debug lines are normal; any warning or error is a failure.
5. Reset the viewport afterwards with `resize_window` and `preset: "desktop"`.

## Code rules

- All look values (colours, sizes, timings, layouts) live in `src/theme.ts`. No raw colours, pixel sizes or timings in components or CSS.
- Card content lives only in `src/content/`. No hardcoded German strings elsewhere except `src/ui/strings.ts`.
- `src/deck/` is pure logic: no DOM, no imports from `src/ui/`, injectable RNG.
- Mobile first. Smallest viewport 360x640. Use `100dvh`, safe-area insets, `touch-action: manipulation`.
- Respect `prefers-reduced-motion`.
- Keep modules small and typed. No `any`.
- Comments only where the why is not obvious.

## Autonomy rules (phase mode)

- Work phase by phase, not slice by slice. Follow SPEC.md. Manuel reviews at the end of each phase.
- No approval is needed for plans, commits or pushes inside a phase. Work on branch `phase/N-name`, one commit per slice.
- Decide open questions yourself using your recommendation. Log every non-trivial decision in DECISIONS.md with the alternative, the reason, and an impact tag (easy-to-change or foundation).
- Delegate each slice to a fresh-context subagent with a complete brief. The subagent verifies its slice, commits, updates STATUS.md and DECISIONS.md, and returns a short report. Subagents can't ask Manuel: they log decisions and report blockers.
- Stop and wait (and send a notification) only when:
  1. the phase is complete,
  2. the same problem failed twice,
  3. a slice's acceptance criteria can't be met without a SPEC or contract change,
  4. a new dependency, or anything destructive or hard to undo, would be needed.
- Before every slice, check plan usage. If the 5-hour window is nearly full, stop at a clean boundary, notify Manuel with the reset time, and resume after the reset.
- At the end of a phase: run a fresh-context reviewer, write REVIEW-phase-N.md, notify Manuel. Do not start the next phase.
- Everything outside a phase's slices is a note in STATUS.md, not work.

## Lessons

(Empty. Add after the first phase retro.)
