# Status

Current phase: Phase 1, Playable deck (all slices done, review fixes applied)
Branch: phase/1-playable-deck
Next action: Phase 2 kickoff

| Slice | Name | Status | Commit |
|---|---|---|---|
| 0 | Setup | done | 69fbe3a |
| 1.1 | Card look | done | 34c1169 |
| 1.2 | Deck engine | done | 2eab9ce |
| 1.3 | Content v1 | done | e339056 |
| 1.4 | Wire-up and interaction | done | ad4b500 |
| 1.5 | Review fixes (font weight, two questions) | done | HASH |

## Blockers

None. The repository has no remote, so the branch is not pushed.

## Gotchas

- Slice 0 is collaborative-light: it decides the commands and how Claude sees the result. Run it before kicking off the phase.
- Slice 1.1 and 1.4 are taste-critical. Criteria are "matches the mockup and `theme.ts` values", not "Manuel likes it".
- Phase 2 is only a sketch in SPEC.md. Detail it after the Phase 1 review.

## Notes (outside the phase)

- Idea: App icon via the `icon-brief` skill (Phase 2).
- Reviewer findings for the fix slice (details in REVIEW-phase-1.md section 5): iOS tap on `document` click (check on a real phone), last card and end card share a colour, tap-lock timer slack, small-text contrast on red, teal and pink, German strings in `dev/preview.ts`, content flags.
