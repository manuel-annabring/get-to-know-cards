# Status

Current phase: Phase 2, Quick deploy (done, waiting for Manuel's group test)
Branch: main (phase branches are merged; history was rewritten to the noreply email before the first push)
Live: https://manuel-annabring.github.io/get-to-know-cards/ (repo: https://github.com/manuel-annabring/get-to-know-cards)
Next action: Manuel plays with a group, then we detail Phase 3 in SPEC.md from what he saw

## Phase 1 (done)

| Slice | Name | Status | Commit |
|---|---|---|---|
| 0 | Setup | done | 6f711d3 |
| 1.1 | Card look | done | c5ec998 |
| 1.2 | Deck engine | done | a7dacea |
| 1.3 | Content v1 | done | 35b4410 |
| 1.4 | Wire-up and interaction | done | 37e77c6 |
| 1.5 | Review fixes (font weight, two questions) | done | 5dacd74 |

Hashes are those after the identity rewrite (the pre-rewrite history is in the local tag `backup-pre-noreply`).

## Phase 2 (quick deploy, done)

| Slice | Name | Status | Commit |
|---|---|---|---|
| 2.1 | Production build for a sub-path | done | 9d6d173 |
| 2.2 | Repo files and deploy workflow | done | 6336ef5 |
| 2.3 | First deploy (coordinator) | done | 3d38563 |

## Blockers

None.

## Gotchas

- Slice 0 is collaborative-light: it decides the commands and how Claude sees the result. Run it before kicking off the phase.
- Slice 1.1 and 1.4 are taste-critical. Criteria are "matches the mockup and `theme.ts` values", not "Manuel likes it".
- Phase 3 is only a sketch in SPEC.md. Detail it after Manuel has played with a group.
- Port 5173 is held by a dev server Manuel started in his own terminal; `preview_start` may land on another port. Use `localhost:5173` directly or `vite preview` on 4173 for the production build.

## Notes (outside the phase)

- Idea: App icon via the `icon-brief` skill (Phase 2).
- Reviewer leftovers moved to Phase 3 in SPEC.md: end card colour, small-text contrast, tap-lock timer slack, German strings in `dev/preview.ts`, more variety in the pairs.
