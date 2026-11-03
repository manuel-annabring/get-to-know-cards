# Status

Current phase: Phase 2, Quick deploy (slice 2.1 done). Phase 1 was reviewed by Manuel and accepted with fixes (slice 1.5 done).
Branch: phase/2-deploy (based on phase/1-playable-deck; merged into `main` in slice 2.3)
Next action: Slice 2.2

## Phase 1 (done)

| Slice | Name | Status | Commit |
|---|---|---|---|
| 0 | Setup | done | 69fbe3a |
| 1.1 | Card look | done | 34c1169 |
| 1.2 | Deck engine | done | 2eab9ce |
| 1.3 | Content v1 | done | e339056 |
| 1.4 | Wire-up and interaction | done | ad4b500 |
| 1.5 | Review fixes (font weight, two questions) | done | 6e686f3 |

Note: commit hashes change when the history is rewritten to the noreply email in slice 2.3. STATUS.md and REVIEW-phase-1.md are updated then.

## Phase 2 (quick deploy)

| Slice | Name | Status | Commit |
|---|---|---|---|
| 2.1 | Production build for a sub-path | done | pending |
| 2.2 | Repo files and deploy workflow | pending | |
| 2.3 | First deploy (coordinator) | pending | |

## Blockers

None. The repository has no remote yet (created in slice 2.3).

## Gotchas

- Slice 0 is collaborative-light: it decides the commands and how Claude sees the result. Run it before kicking off the phase.
- Slice 1.1 and 1.4 are taste-critical. Criteria are "matches the mockup and `theme.ts` values", not "Manuel likes it".
- Phase 3 is only a sketch in SPEC.md. Detail it after Manuel has played with a group.
- Port 5173 is held by a dev server Manuel started in his own terminal; `preview_start` may land on another port. Use `localhost:5173` directly or `vite preview` on 4173 for the production build.

## Notes (outside the phase)

- Idea: App icon via the `icon-brief` skill (Phase 2).
- Reviewer leftovers moved to Phase 3 in SPEC.md: end card colour, small-text contrast, tap-lock timer slack, German strings in `dev/preview.ts`, more variety in the pairs.
