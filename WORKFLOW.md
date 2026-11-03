# Phase-based autonomous workflow (for a new 3D web project)

Status: v0.1, untested. Update it after the first phase retro (section 14).

## 1. Idea

- **Manuel is the product owner.** He decides what gets built and how it should feel. He reviews once per phase.
- **Claude is the coordinator.** It plans, delegates slices to fresh-context workers, verifies, and keeps the project files current.
- A phase is a group of slices that ends in a product increment Manuel can try in the browser.
- Within a phase Claude does not wait for approval. It decides, logs the decision, and moves on.

Why this works: the conversation is only working memory. All durable state lives in files (section 2) and in git, so context compaction, a new session, or a usage-limit pause cannot lose it.

## 2. Project files

| File | Purpose | Written by |
|---|---|---|
| `CLAUDE.md` | Stack, commands, code rules, lessons, Autonomy rules (section 5) | Claude, Manuel approves |
| `SPEC.md` | Scope, contracts, phases, slices with acceptance criteria | Claude and Manuel together |
| `STATUS.md` | Current phase, slice table with status, next action, blockers, gotchas. Updated as the last step of every slice | Claude |
| `DECISIONS.md` | Decision log (section 6) | Claude |
| `REVIEW-phase-N.md` | Review package, created at the end of each phase (section 11) | Claude |

## 3. Starting a new project

Everything before step 5 is collaborative. Autonomy starts only once the inputs are good.

1. **Idea.** Manuel states the idea, references, and what "done" feels like.
2. **Spec session** (Opus, or Sonnet at high effort). Discuss and iterate. Resolve shape, geometry and look decisions now, together, with interactive 2D widgets where it helps. These are the decisions that cost most to unwind later. Write `SPEC.md` with phases, slices and acceptance criteria (section 4), and any contracts (asset names, data shapes).
3. **CLAUDE.md** from the previous project's version, trimmed to what applies, plus the Autonomy rules.
4. **Slice 0: setup.** Tooling, scripts, and the verification commands (typecheck, lint, build, tests). Decide here how Claude will see the result (dev server plus browser pane screenshots). New dependencies are approved here, not during a phase.
5. **Pre-flight checklist** (section 9), then **phase kickoff** (section 13).

## 4. Slice format in SPEC.md

```
### Slice 2.3: <name>
Goal:            one sentence
Scope:           files or areas that may change
Out of scope:    what must not be touched
Depends on:      slice ids
Taste-critical:  yes | no (does the result depend on how it looks or feels?)
Acceptance criteria (each one checkable by Claude):
- [ ] typecheck, lint, build, tests pass
- [ ] <behavior>: what happens when the user does X
- [ ] <visual>: what a screenshot of state Y must show
- [ ] no console errors or warnings
```

Rules:

- A criterion Claude can't check isn't a criterion. Rewrite it ("looks good" becomes "text is legible at 1280x720 and the object is centred").
- For taste-critical slices the criterion is "implemented with the recommended value, decision logged", not "Manuel likes it".
- **Order slices so look-defining ones come first.** Later slices then build on a look that Manuel has seen early in the review.
- **Keep tweakable values in one place** (a constants or theme file), so changes after review take minutes. This is the main defence against compounding taste decisions.

## 5. Autonomy rules (paste into CLAUDE.md)

```
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
```

## 6. DECISIONS.md format

| ID | Slice | Decision | Alternatives | Why | Impact | Status |
|---|---|---|---|---|---|---|
| D-012 | 2.3 | Paper colour #f4efe4 | pure white, grey | matches reference | easy-to-change | open |

- **Impact: foundation** means other slices build on it (geometry, API shape, file layout). It is expensive to change.
- **Impact: easy-to-change** is a value or a look that can be retuned in minutes.
- Status is `open` until Manuel has seen it at review, then `accepted` or `changed`.

## 7. The phase run (coordinator)

1. Read `CLAUDE.md`, `SPEC.md`, `STATUS.md`, `DECISIONS.md`.
2. Create the branch `phase/N-name`.
3. For each slice in order:
   1. Check plan usage (section 10).
   2. Write the worker brief (section 8) and start a fresh-context subagent.
   3. When it reports back, check the report against the acceptance criteria. Don't accept "done" without evidence (command output, screenshot).
   4. If the check fails: send it back once. A second failure is a stop (section 5).
   5. Make sure `STATUS.md` and `DECISIONS.md` are updated and committed.
4. After the last slice, run a fresh-context reviewer over the whole phase (section 11).
5. Write `REVIEW-phase-N.md`, push the branch, send the notification.

## 8. Worker brief (template)

```
You are implementing slice <id> of <project>. Read CLAUDE.md and SPEC.md section <x> first.

Goal:                <from SPEC>
Scope / out of scope: <from SPEC>
Acceptance criteria:  <copy from SPEC>
Relevant files:       <paths>
Decisions so far:     <relevant DECISIONS.md ids>

Do: implement, then verify against every criterion (run the commands, look at the browser, read the console).
Fix failures yourself before reporting.
You can't ask Manuel questions. For open choices, take your recommendation and log it in DECISIONS.md.
If you are blocked, stop and report why. Do not guess.
Finish: commit on the current branch (one commit, clear message), update STATUS.md.
Report back in under 15 lines: what changed, evidence for each criterion, decisions made, anything unverified.
```

## 9. Pre-flight checklist (before walking away)

- [ ] Plugged in, lid open, Claude app running, stable internet. The "keep awake while working" setting prevents idle sleep only; a closed lid still sleeps the Mac.
- [ ] Permission allowlist set up (the `fewer-permission-prompts` skill can generate it), so no tool prompt blocks the run.
- [ ] Remote Control on for the session and tested from the iOS app.
- [ ] Plan usage looks sufficient for the phase, or extra usage is enabled on purpose.
- [ ] Working tree clean, on the right base branch.
- [ ] `STATUS.md` shows the phase and its first slice.

## 10. Usage limits

- The window limits are on **usage**, not context. A single session's context is large and compacts automatically.
- The coordinator checks usage before each slice. If the 5-hour window is nearly full, it finishes the current slice, notifies Manuel with the reset time, and schedules a wake-up for after the reset.
- Untested: whether a scheduled wake-up survives a long wait. Test it with a short dry run first. The fallback is that Manuel replies "continue" from his phone.
- If the limit hits abruptly mid-slice, the session just stops. Because every slice is committed separately, only the in-flight slice is lost.

## 11. Review package and review conversation

`REVIEW-phase-N.md` contains:

1. **Try this:** 3 to 6 things to do in the browser, with the screenshots Claude took.
2. **Decisions:** from `DECISIONS.md`, foundation decisions first, then the easy-to-change ones.
3. **Acceptance:** each slice's criteria with pass or fail and the evidence.
4. **History:** commits on the phase branch, one per slice, so any slice can be reverted alone.
5. **Open issues:** anything unverified, anything the reviewer flagged.

Review conversation: Manuel tries it, goes through the decisions, and says what to change. Claude makes the changes (small fix slice, tracked in `STATUS.md`), then Manuel merges. Claude then writes or updates the next phase in `SPEC.md` using what was learned.

## 12. 3D-specific notes

- **Model contract** (names, origins, applied transforms) stays in `SPEC.md`. A contract change is always a stop.
- **Blender and other taste-driven modeling stay collaborative.** Don't hand them to the autonomous loop. Scripted, repetitive parts (generated keys, rows, arrays) can run autonomously with a before/after preview.
- Verification for 3D: dev server, browser screenshots from fixed camera positions, console clean, and a headless contract or asset check where an asset pipeline exists.
- Per-frame code rules (no allocations, no state updates in the frame loop) go into `CLAUDE.md`, and every worker brief points to them.
- Keep geometry and material constants in one module so retuning after review is cheap.

## 13. Phase kickoff prompt (template)

```
Run phase <N> (<name>) of SPEC.md autonomously, following the Autonomy rules in CLAUDE.md.
You may use subagents, one per slice, as described there.
Stop only at the defined stop conditions. When the phase is done, write REVIEW-phase-N.md and notify me.
I'm away; decide using your recommendations and log them.
```

## 14. Retro after the first phase

- Where did Claude stop that it shouldn't have, or not stop where it should have?
- Which decisions did Manuel change at review? What would have prevented that (earlier mini-gate, better spec)?
- Was the review package enough, or did Manuel have to dig?
- What did a phase cost in usage?
- Update this file and `CLAUDE.md` with what changed.
